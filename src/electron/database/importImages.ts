import {ImageFile, Mapper} from "@components/dialogs/import_images/ImportImages";
import sharp from "sharp";
import {imageImportColumns} from "@utils/constants";
import fs from "fs";
import pathModule, {ParsedPath} from "path";
import path from "path";
import dotProp from "dot-prop";
import * as exifReader from "exifreader"
import {db} from "@electron/database/database";
import {appData} from "@utils/utilities";
import {IpcMainEvent} from "electron";
import {channels} from "@utils/ipcCommands";

const rawFolder = appData("images", "raw")
const prevFolder = appData("images", "prev")
const columnsFull: string[] = [
    ...imageImportColumns,
    "image_width",
    "image_height",
    "date_added",
    "extension",
    "original_metadata",
    "original_exif"
]

export default (files: ImageFile[], mappers: Mapper[], event: IpcMainEvent) => {
    if (files.length == 0) return
    const imagesData = retrieveMetadata(files, mappers)
    importImageData(imagesData, event)
}

const addImageTag = db.prepare("" +
    "insert into images_tags " +
    "select ?, ?"
)

const additionalStatement = (imageID: number | bigint) => {
    for (let i = 0; i < Math.floor(Math.random() * 3) + 1; i++) {
        addImageTag.run(imageID, Math.floor(Math.random() * 26) + 1)
    }
}

const importImageData = (imageData: ImageData[], event: IpcMainEvent) => {
    const totalImages = imageData.length
    const importRemaining = new Set(imageData.map(({file}) => file.base))
    const imagesRemaining = new Set(importRemaining)
    const errored: string[] = []

    const importStatement = db.prepare("" +
        "insert into images (" +
        columnsFull.join(", ") +
        ") values (" +
        columnsFull.map(() => "?").join(", ") +
        ")"
    )

    for (const image of imageData) {
        new Promise((resolve, reject) => {
            const sharpImage = sharp(pathModule.join(image.file.dir, image.file.base))
            sharpImage
                .withMetadata()
                .toBuffer()
                .then((buffer) => {
                    const exif = exifReader.load(buffer)
                    const entry = formatMetadata(image.file, image.jsonData, image.jsonMapper, exif)
                    try {
                        return db.transaction(() => {
                            const imageID = importStatement.run(entry).lastInsertRowid
                            additionalStatement(imageID)
                            return imageID
                        })()
                    } catch (e) {
                        reject(image.file.base)
                        return -1
                    }
                })
                .then((imageID) => {
                    sharpImage
                        .toFile(pathModule.join(rawFolder, imageID+image.file.ext))
                        .then(() => {
                            return sharpImage
                                .resize(256, 256, {fit: sharp.fit.inside})
                                .toFormat("jpeg")
                                .jpeg({
                                    quality: 80,
                                    mozjpeg: true
                                })
                                .toFile(pathModule.join(prevFolder, `${imageID}.jpeg`))
                        })
                        .then(() => {
                            imagesRemaining.delete(image.file.base)
                            if (importRemaining.size == 0) {
                                event.reply(
                                    channels.imageImported,
                                    (totalImages - imagesRemaining.size) / totalImages,
                                    "Creating thumbnails")
                            }
                        })
                        .catch(() => {
                            reject(image.file.base)
                        })
                        .finally(() => {
                            if (importRemaining.size == 0 && imagesRemaining.size == 0) {
                                event.reply(channels.imageImportComplete, errored)
                            }
                        })
                }).then(() => {
                    resolve(image.file.base)
                })
                .catch(() => {
                    reject(image.file.base)
                })
        })
            .then((filename) => {
                importRemaining.delete(filename as string)
                event.reply(channels.imageImported, (totalImages - importRemaining.size) / totalImages, filename)
            })
            .catch((filename) => {
                importRemaining.delete(filename as string)
                errored.push(filename)
                event.reply(channels.imageImported, (totalImages - importRemaining.size) / totalImages, filename)
            })
            .finally(() => {
                if (importRemaining.size == 0 && imagesRemaining.size == 0) {
                    event.reply(channels.imageImportComplete, errored)
                }
            })
    }
}

const formatMetadata  = (
    imageFile: ParsedPath,
    jsonData: object,
    jsonMapper: {[p: string]: string},
    exifData: exifReader.Tags & exifReader.XmpTags & exifReader.IccTags
) => columnsFull.map(value => {
    switch (value) {
        case "title": return (dotProp.get(jsonData, jsonMapper[value], imageFile.name))
        case "image_width": return (
            (exifData["Image Width"])?
                exifData["Image Width"].value:
                exifData["PixelXDimension"]?.value) as unknown as number
        case "image_height": return (
            (exifData["Image Height"])?
                exifData["Image Height"].value:
                exifData["PixelYDimension"]?.value) as unknown as number
        case "date_added": return new Date().getTime()
        case "extension": return imageFile.ext.replace(".", "")
        case "original_metadata": return (jsonData)? JSON.stringify(jsonData): ""
        case "original_exif": return (exifData)? JSON.stringify(exifData): ""
        default: return (dotProp.get(jsonData, jsonMapper[value], ""))
    }
})

const retrieveMetadata = (files: ImageFile[], mappers: Mapper[]) => {
    const imageData: ImageData[] = []
    for (const file of files) {
        const jsonData = getJsonData(file)
        const mappedJson = getInsertMapper(mappers, jsonData)
        imageData.push({file: pathModule.parse(file.path), jsonData, jsonMapper: mappedJson})
    }

    return imageData
}

const getJsonData = (file: ImageFile) => {
    const fileInfo = path.parse(file.path)

    if (fs.existsSync(pathModule.join(fileInfo.dir, `${fileInfo.name}${fileInfo.ext}.json`)))
        return JSON.parse(fs.readFileSync(
            pathModule.join(fileInfo.dir, `${fileInfo.name}${fileInfo.ext}.json`),
            'utf8'
        ))
    if (fs.existsSync(pathModule.join(fileInfo.dir, `${fileInfo.name}.json`)))
        return JSON.parse(fs.readFileSync(
            pathModule.join(fileInfo.dir, `${fileInfo.name}.json`),
            'utf8'
        ))
    return undefined
}

const getInsertMapper = (mappers: Mapper[], jsonData: any) => {
    if (jsonData != undefined) for (const mapper of mappers) {

        let matches = mapper.filters.every((filter) =>
            dotProp.get(jsonData, filter.path) === filter.value
        )
        if (matches) {
            return mapper.transforms.reduce((prev, curr) => {
                return {
                    ...prev,
                    [curr.metadata.toLowerCase()]: curr.prop
                }
            }, {})
        }
    }
    return {}
}

interface ImageData {
    file: ParsedPath,
    jsonData: object,
    jsonMapper: {
        [p: string]: string
    }
}
