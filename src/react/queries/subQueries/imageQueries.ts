export const imageGetQueries = {
    imageSearch: {
        query: "" +
            "select image_id, extension\n" +
            "from images",
        order: ""
    },
    getImageData: {
        query: "" +
            "select image_id, title, image_width, image_height\n" +
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
            "where image_id = @imageID",
    }
}
