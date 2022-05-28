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
    getCommonCollections: {
        query: "" +
            "select c.collection_id, c.name\n" +
            "from images_collections i\n" +
            "left join collections c on i.collection_id = c.collection_id\n" +
            "where i.image_id in (select image_id from selected)\n" +
            "group by i.collection_id\n" +
            "having count(i.collection_id) = (select count(*) from selected)",
        order: "order by name"
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
    },
    selectedAddImageTag: {
        query: "" +
            "insert or ignore into images_collections (collection_id, image_id)\n" +
            "select ?, image_id\n" +
            "from selected",
    },
    selectedRemoveImageTag: {
        query: "" +
            "delete from images_collections\n" +
            "where collection_id = ? and image_id in (select image_id from selected)",
    }
}
