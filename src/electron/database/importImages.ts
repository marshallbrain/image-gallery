import {ImageFile, Mapper} from "@components/dialogs/import_images/ImportImages";
import fs from "fs";
import dotProp from "dot-prop";
import {db} from "@electron/database/database";
import path from "path";
import pathModule, {ParsedPath} from "path";
import sharp from "sharp";
import {appData} from "@utils/utilities";
import {imageImportColumns} from "@utils/constants";
import sizeOf from "image-size"

export default (files: ImageFile[], mappers: Mapper[], callback: () => void) => {
    if (files.length == 0) return
    const newImagePaths = insertMetadata(files, mappers)
    const counter = imageCounter(newImagePaths.length, callback)
    for (const file of newImagePaths) {
        sharp(file.from).toFile(file.to, counter)
    }
}

const columnsFull: string[] = [
    ...imageImportColumns,
    "image_width",
    "image_height",
    "extension",
    "original_metadata"
]

const rawImageLocation = appData("images", "raw")
const previewImageLocation = appData("images", "prev")

const imageCounter = (count: number, callback: () => void) => {
    let currentCount = 0
    return () => {
        currentCount++
        if (currentCount >= count) {
            callback()
        }
    }
}

const insertMetadata = db.transaction((files: ImageFile[], mappers: Mapper[]) => {
    const newImagePaths: {from: string, to: string}[] = []
    const insert = db.prepare("" +
        "insert into images (" +
        columnsFull.join(", ") +
        ") values (" +
        columnsFull.map(() => "?").join(", ") +
        ")"
    )

    for (const file of files) {
        const fileInfo = path.parse(file.path)
        const getJson = () => {
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
        const jsonData = getJson()
        const maps = getInsertMapper(mappers, jsonData)
        const json: object = (jsonData)? jsonData: {
            "title": fileInfo.name
        }

        const {width, height} = sizeOf(file.path)

        const data: (string|number|undefined)[] = columnsFull.map(value => {
            if (dotProp.has(json, maps[value]))
                return dotProp.get(json, maps[value], "")
            switch (value) {
                case "image_width": return width
                case "image_height": return height
                case "extension": return fileInfo.ext.replace(".", "")
                case "original_metadata": return JSON.stringify(json)
                default: return (dotProp.get(json, value, ""))
            }
        })

        const imageId = insert.run(data).lastInsertRowid
        const rawFile = pathModule.join(rawImageLocation, imageId.toString() + fileInfo.ext)
        newImagePaths.push({from: file.path, to: rawFile})

        const previewFile = pathModule.join(previewImageLocation, imageId.toString() + ".jpeg")
        sharp(file.path)
            .resize(256, 256, {fit: sharp.fit.inside})
            .toFormat("jpeg")
            .jpeg({
                quality: 80,
                mozjpeg: true
            })
            .toFile(previewFile)
            .then(r => {})
    }
    return newImagePaths
})

const getInsertMapper = (mappers: Mapper[], jsonData: any) => {
    if (jsonData != undefined) for (const mapper of mappers) {
        let matches = true
        for (const filter of mapper.filters) {
            matches = matches && dotProp.get(jsonData, filter.path) === filter.value
        }
        if (matches) {
            return Object.fromEntries(mapper.transforms.map(value => [value.metadata.toLowerCase(), value.prop]))
        }
    }
    return {}
}
