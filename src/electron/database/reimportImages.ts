import {Mapper} from "@components/dialogs/import_images/ImportImages";
import {db} from "@electron/database/database";
import dotProp from "dot-prop";

export default (mappers: Mapper[], callback: () => void) => {
    const metadataCheck: {[key: string]: string} = {}
    mappers.forEach(map => {map.transforms.forEach(value => {metadataCheck[value.metadata] = ""})})
    const result = db.prepare("" +
        `select image_id, original_metadata, ${Object.keys(metadataCheck).join(",")} ` +
        "from images " +
        `where ${Object.keys(metadataCheck).map(value => value.toLowerCase() + " is null").join(" or ")}`
    )
    db.transaction(() => {
        for (const {image_id: id, original_metadata: json, ...other} of result.iterate()) {
            const data = JSON.parse(json)
            const unfilled = new Set(Object.entries(other).filter(value => value[1] === null).map(value => value[0]))
            for (const mapper of mappers) {
                let matches = true
                for (const filter of mapper.filters) {
                    matches = matches && dotProp.get(data, filter.path) === filter.value
                }
                if (matches) {
                    for (const {prop, metadata} of mapper.transforms) {
                        if (unfilled.has(metadata.toLowerCase())) {
                            db.prepare("" +
                                "update images " +
                                `set ${metadata.toLowerCase()} = ? ` +
                                "where image_id = ?"
                            ).run(data[prop], id)
                        }
                    }
                }
            }
        }
    })()
    callback()
}
