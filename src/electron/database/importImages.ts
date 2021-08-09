import {ImageFile, Mapper} from "@components/dialogs/import_images/ImportImages";
import fs from "fs";
import dotProp from "dot-prop";
import {db} from "@electron/database/database";
import {columns} from "@electron/database/dbStructure";

export const importImages = (files: ImageFile[], mappers: Mapper[]) => {
    const cols = Object.values(columns.images).slice(1)
    const insert = db.prepare(
        `insert into images (${cols.join(", ")}) values (${cols.map(() => "?").join(", ")})`
    )
    if (files.length == 0) return
    for (const file of files) {
        try {
            const jsonData = JSON.parse(fs.readFileSync(file.path + ".json", 'utf8'))
            let maps: {[key: string]: string} = {}
            for (const mapper of mappers) {
                let matches = true
                for (const filter of mapper.filters) {
                    matches = matches && dotProp.get(jsonData, filter.path) === filter.value
                }
                if (matches) {
                    maps = Object.fromEntries(mapper.transforms.map(value => [value.metadata.toLowerCase(), value.prop]))
                    break
                }
            }

            const data: string[] = cols.map(value => {
                if (value === "original_metadata") return JSON.stringify(jsonData)
                return jsonData[maps[value]] || "null"
            })
            const imageId = insert.run(data).lastInsertRowid
            console.log(imageId)
        } catch (e) {
            console.log(e.message)
        }
    }
}
