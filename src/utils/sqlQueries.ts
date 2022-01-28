export const sqlImageSearch = "" +
    "select image_id, extension " +
    "from images"

export const sqlGetImageData = "" +
    "select title " +
    "from images " +
    "where image_id = ?"
