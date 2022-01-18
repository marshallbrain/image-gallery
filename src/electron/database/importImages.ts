import {ImageFile, Mapper} from "@components/dialogs/import_images/ImportImages";
import fs from "fs";
import dotProp from "dot-prop";
import {db} from "@electron/database/database";
import path from "path";
import pathModule, {ParsedPath} from "path";
import sharp from "sharp";
import {appDataDir} from "@utils/utilities";
import {imageImportColumns} from "@utils/constants";

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
    "extension",
    "original_metadata"
]

const rawImageLocation = appDataDir("images", "raw")

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
    const insert = db.prepare(
        `insert into images (${columnsFull.join(", ")}) values (${columnsFull.map(() => "?").join(", ")})`
    )
    for (const file of files) {
        const filePath = path.parse(file.name)
        const getJson = () => {
            try {
                return JSON.parse(fs.readFileSync(file.path + ".json", 'utf8'))
            } catch (e: any) {
                if (e.code === "ENOENT") {
                    return undefined
                } else {
                    throw e
                }
            }
        }
        const jsonData = getJson()

        const maps = getInsertMapper(mappers, jsonData)
        const data: string[] = columnsFull.map(value => {
            const data = ColumnAutofill(value, jsonData, filePath)
            if (data != "") return data
            if (jsonData === undefined) return (value === "title")? filePath.name: "null"
            return jsonData[maps[value]] || "null"
        })

        const imageId = insert.run(data).lastInsertRowid
        const newFile = pathModule.join(rawImageLocation, imageId.toString() + filePath.ext)
        newImagePaths.push({from: file.path, to: newFile})
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

const ColumnAutofill = (value: string, jsonData: string, file: ParsedPath) => {
    switch (value) {
        case "original_metadata": return (jsonData)? JSON.stringify(jsonData): "{}"
        case "extension": return file.ext.substr(1)
        default: return ""
    }
}
