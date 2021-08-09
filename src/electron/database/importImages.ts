import {ImageFile, Mapper} from "@components/dialogs/import_images/ImportImages";
import fs from "fs";
import dotProp from "dot-prop";
import {db} from "@electron/database/database";
import {columns} from "@electron/database/dbStructure";
import path from "path";
import pathModule from "path";
import {app} from "electron";

export const importImages = (files: ImageFile[], mappers: Mapper[]) => {
    if (files.length == 0) return
    const newImagePaths: {from: string, to: string}[] = []
    insertMetadata(files, mappers, newImagePaths)
    console.log(newImagePaths)
}

const insertMetadata = db.transaction((
    files: ImageFile[],
    mappers: Mapper[],
    newImagePaths: {from: string, to: string}[]
) => {
    const cols = Object.values(columns.images).slice(1)
    const insert = db.prepare(
        `insert into images (${cols.join(", ")}) values (${cols.map(() => "?").join(", ")})`
    )
    for (const file of files) {
        const filePath = path.parse(file.name)
        const getJson = () => {
            try {
                return JSON.parse(fs.readFileSync(file.path + ".json", 'utf8'))
            } catch (e) {
                if (e.code === "ENOENT") {
                    return undefined
                } else {
                    throw e
                }
            }
        }
        const jsonData = getJson()

        const maps = getInsertMapper(mappers, jsonData)
        const data: string[] = cols.map(value => {
            if (value === columns.images.original_metadata) return (jsonData)? JSON.stringify(jsonData): "{}"
            if (jsonData === undefined) return (value === columns.images.title)? filePath.name: "null"
            return jsonData[maps[value]] || "null"
        })

        const imageId = insert.run(data).lastInsertRowid
        console.log(imageId)
        const newFile = pathModule.join(app.getAppPath(), `../dev-resources/images/raw/${imageId}${filePath.ext}`)
        newImagePaths.push({from: file.path, to: newFile})
    }
})

const getInsertMapper = (mappers: Mapper[], jsonData: any) => {
    if (jsonData == undefined) for (const mapper of mappers) {
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
