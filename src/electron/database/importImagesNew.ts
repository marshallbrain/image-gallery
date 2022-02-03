import {ImageFile, Mapper} from "@components/dialogs/import_images/ImportImages";
import sharp from "sharp";
import {imageImportColumns} from "@utils/constants";
import fs from "fs";
import pathModule, {ParsedPath} from "path";
import path from "path";
import dotProp from "dot-prop";
import * as exifReader from "exifreader"

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
    const remaining = new Set(imageData.map(({file}) => file.name))
    for (const image of imageData) {
        new Promise((resolve, reject) => {
            const sharpImage = sharp(pathModule.join(image.file.dir, image.file.base))
            sharpImage
                .withMetadata()
                .toBuffer()
                .then((buffer) => {
                    const exif = exifReader.load(buffer)
                    const entry = formatMetadata(image.file, image.jsonData, image.jsonMapper, exif)
                    console.log(entry)
                })
        })
        //save metadata and exif to db
        //save image and create prev
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
        case "image_width": return exifData["Image Width"]
        case "image_height": return exifData["Image Height"]
        case "date_added": return new Date().getTime()
        case "extension": return imageFile.ext.replace(".", "")
        case "original_metadata": return JSON.stringify(jsonData)
        case "original_exif": return JSON.stringify(exifData)
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
