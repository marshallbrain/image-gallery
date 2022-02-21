export const imageGetQueries = {
    imageSearch: {
        query: "" +
            "select image_id, extension\n" +
            "from images",
        order: ""
    },
    getImageData: {
        query: "" +
            "select image_id, title, bookmark, image_width, image_height\n" +
            "from images\n" +
            "where image_id = ?",
        order: "",
    }
}

export const imageRunQueries = {
    setImageTitle: {
        query: "" +
            "update images " +
            "set title = @title " +
            "where image_id = @imageId",
    },
    bookmark: {
        query: "" +
            "update images\n" +
            "set bookmark = 1\n" +
            "where image_id = @imageId"
    },
    unBookmark: {
        query: "" +
        "update images\n" +
        "set bookmark = 0\n" +
        "where image_id = @imageId"
    }
}
