export const imageGetQueries = {
    getImageData: {
        query: "" +
            "select image_id, title, bookmark, image_width, image_height\n" +
            "from images\n" +
            "where image_id = ?",
    },
    getSelectedImages: {
        query: "" +
            "select image_id\n" +
            "from selected",
        pluck: true
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
    },
    selectImages: {
        query: "" +
            "insert or ignore into selected (image_id)\n" +
            "select image_id\n" +
            "from search\n" +
            "where id = ?"
    },
    selectMultiImages: {
        query: "" +
            "insert or ignore into selected (image_id)\n" +
            "select image_id\n" +
            "from search\n" +
            "where id between ? and ?"
    }
}
