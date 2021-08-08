import {ImageFile, Mapper, Metadata, Transform} from "@components/dialogs/import_images/ImportImages";
import fs from "fs";
import dotProp from "dot-prop";

export const importImages = (files: ImageFile[], mappers: Mapper[]) => {
    if (files.length == 0) return
    for (const file of files) {
        try {
            const jsonData = JSON.parse(fs.readFileSync(file.path + ".json", 'utf8'))
            let maps: Transform[] = []
            for (const mapper of mappers) {
                let matches = true
                for (const filter of mapper.filters) {
                    matches = matches && dotProp.get(jsonData, filter.path) === filter.value
                }
                if (matches) {
                    maps = mapper.transforms
                    break
                }
            }
            const data: {[key in Metadata]?: string} = {}
            for (const map of maps) {
                data[map.metadata] = jsonData[map.prop]
            }
            console.log(data)
        } catch (e) {
            console.log(e)
        }
    }
}
