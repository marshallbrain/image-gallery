export const tagGetQueries = {
    getTags: {
        query: "" +
            "select tag_id, name\n" +
            "from tags",
        order: "order by name"
    },
    getImageTags: {
        query: "" +
            "select t.tag_id, t.name\n" +
            "from images_tags i\n" +
            "left join tags t on i.tag_id = t.tag_id\n" +
            "where i.image_id = ?\s",
        order: "order by name"
    },
    createTag: {
        query: "" +
            "insert into tags (name)\n" +
            "values(?)",
        order: ""
    },
    addImageTag: {
        query: "" +
            "insert into images_tags\n" +
            "select ?, ?",
        order: ""
    },
    removeImageTag: {
        query: "" +
            "delete from images_tags\n" +
            "where image_id = ? and tag_id = ?",
        order: ""
    },
    clearImageTag: {
        query: "" +
            "delete from images_tags " +
            "where image_id = ?",
        order: ""
    }

}
