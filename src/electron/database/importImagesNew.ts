import {ImageFile, Mapper} from "@components/dialogs/import_images/ImportImages";
import sharp from "sharp";
import {imageImportColumns} from "@utils/constants";
import fs from "fs";
import pathModule from "path";
import path from "path";
import dotProp from "dot-prop";

const columnsFull: string[] = [
    ...imageImportColumns,
    "image_width",
    "image_height",
    "extension",
    "original_metadata"
]

export default (files: ImageFile[], mappers: Mapper[]) => {
    if (files.length == 0) return
    const imagesData = retrieveMetadata(files, mappers)
}

const retrieveMetadata = (files: ImageFile[], mappers: Mapper[]) => {
    for (const file of files) {
        const jsonData = getJsonData(file)
        const maps = getInsertMapper(mappers, jsonData)
    }

    return undefined
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
