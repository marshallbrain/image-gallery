export const collectionGetQueries = {
    getCollections: {
        query: "" +
            "select collection_id, name\n" +
            "from collections",
        order: "order by name = @search desc, name like @search || '%' desc, name",
    },
    getImageCollections: {
        query: "" +
            "select c.collection_id, c.name\n" +
            "from images_collections i\n" +
            "left join collections c on i.collection_id = c.collection_id\n" +
            "where i.image_id = ?",
        order: "order by name",
    },
}

export const collectionRunQueries = {
    createCollection: {
        query: "" +
            "insert into collections (name)\n" +
            "values(?)",
    },
    addImageCollection: {
        query: "" +
            "insert into images_collections\n" +
            "select ?, ?",
    },
    removeImageCollection: {
        query: "" +
            "delete from images_collections\n" +
            "where image_id = ? and collection_id = ?",
    },
    clearImageCollection: {
        query: "" +
            "delete from images_collections\n" +
            "where image_id = ?",
    }
}
