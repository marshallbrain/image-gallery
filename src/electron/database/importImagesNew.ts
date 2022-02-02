import {ImageFile, Mapper} from "@components/dialogs/import_images/ImportImages";
import sharp from "sharp";
import {imageImportColumns} from "@utils/constants";

const columnsFull: string[] = [
    ...imageImportColumns,
    "image_width",
    "image_height",
    "extension",
    "original_metadata"
]

export default (files: ImageFile[], mappers: Mapper[]) => {
    if (files.length == 0) return
}
