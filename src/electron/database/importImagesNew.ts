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

export default (files: ImageFile[], mappers: Mapper[]) => {
    if (files.length == 0) return
    const imagesData = retrieveMetadata(files, mappers)
    importImageData(imagesData)
}

const importImageData = (imageData: ImageData[]) => {
    const totalImages = imageData.length
    const remaining = new Set(imageData.map(({file}) => file.name))
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
                            return importStatement.run(entry).lastInsertRowid
                        })()
                    } catch (e) {
                        reject(image.file.name)
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
                }).then(() => {
                    resolve(image.file.name)
                })
                .catch(() => {
                    reject(image.file.name)
                })
        })
            .then((filename) => {
                remaining.delete(filename as string)
                console.log(totalImages - remaining.size, filename)
            })
            .catch((filename) => {
                remaining.delete(filename as string)
                console.log("ERROR:", filename)
            })
            .finally(() => {
                if (remaining.size == 0) {
                    console.log("complete")
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
        case "image_width": return exifData["Image Width"].value as unknown as number
        case "image_height": return exifData["Image Height"].value as unknown as number
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
