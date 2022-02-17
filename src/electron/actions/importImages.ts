import {ImageFile, Mapper} from "@components/dialogs/import_images/ImportImages";
import sharp from "sharp";
import {imageImportColumns} from "@utils/constants";
import fs from "fs";
import pathModule from "path";
import path, {ParsedPath} from "path";
import dotProp from "dot-prop";
import * as exifReader from "exifreader"
import {db} from "@electron/database/database";
import {appData} from "@utils/utilities";
import {IpcMainEvent} from "electron";
import channels from "@utils/channels";

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
    event.reply(channels.dialogs.startProgress)
    if (files.length == 0) return
    const imagesData = retrieveMetadata(files, mappers)
    new Promise(() => {
        importImageData(imagesData, event)
    }).then(() => {})
}

const importImageData = (imageData: ImageData[], event: IpcMainEvent) => {
    let totalImages = imageData.length
    const importRemaining = new Set(imageData.map(({file}) => file.base))
    const errored = new Set<string>()

    const importStatement = db.prepare("" +
        "insert into images (" +
        columnsFull.join(", ") +
        ") values (" +
        columnsFull.map(() => "?").join(", ") +
        ")"
    )
    const deleteStatement = db.prepare("" +
        "delete from images " +
        "where image_id = ?"
    )

    for (const image of imageData) {
        const sharpImage = sharp(pathModule.join(image.file.dir, image.file.base))
        new Promise<{filename: string, imageId: number|bigint}>(((resolve, reject) => {
            sharpImage
                .withMetadata()
                .toBuffer()
                .then((buffer) => {
                    const exif = exifReader.load(buffer)
                    const entry = formatMetadata(image.file, image.jsonData, image.jsonMapper, exif)
                    try {
                        return db.transaction(() => {
                            return importStatement.run(entry).lastInsertRowid
                        })()
                    } catch (e) {
                        throw -1
                    }
                })
                .then((imageId) => {
                    return new Promise<{filename: string, imageId: number|bigint}>((
                        (resolveCopy, rejectCopy) => {
                            fs.copyFile(
                                pathModule.join(image.file.dir, image.file.base),
                                pathModule.join(rawFolder, imageId+image.file.ext),
                                (error) => {
                                    if (error) {
                                        rejectCopy(image.file.base)
                                    } else {
                                        resolveCopy({filename: image.file.base, imageId})
                                    }
                                }
                            )
                        }
                    ))
                })
                .then(({filename, imageId}) => {
                    sharpImage
                        .resize(256, 256, {fit: sharp.fit.inside})
                        .toFormat("jpeg")
                        .jpeg({
                            quality: 80,
                            mozjpeg: true
                        })
                        .toFile(pathModule.join(prevFolder, `${imageId}.jpeg`))
                        .then(() => {
                            resolve({filename, imageId})
                        })
                        .catch(() => {
                            reject({filename, imageId})
                        })
                })
        }))
            .then(({filename}) => {
                return new Promise<void>(resolve => {
                    setTimeout(() => {
                        importRemaining.delete(filename)
                        event.reply(
                            channels.update.progress,
                            [(totalImages - importRemaining.size) / totalImages, filename]
                        )
                        resolve()
                    }, Math.floor(Math.random() * 1000)+100)
                })
            })
            .catch(({filename, imageId}) => {
                importRemaining.delete(filename)
                errored.add(filename)
                deleteStatement.run(imageId)
            })
            .finally(() => {
                if (importRemaining.size == 0) {
                    event.reply(channels.update.finishProgress, Array.of(errored))
                    event.reply(channels.update.reloadSearch)
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
