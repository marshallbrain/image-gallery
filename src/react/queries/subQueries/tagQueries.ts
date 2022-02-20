export const tagGetQueries = {
    getTags: {
        query: "" +
            "select tag_id, name\n" +
            "from tags\n" +
            "where name like '%' || @search || '%'",
        order: "order by name = @search desc, name like @search || '%' desc, name"
    },
    getImageTags: {
        query: "" +
            "select t.tag_id, t.name\n" +
            "from images_tags i\n" +
            "left join tags t on i.tag_id = t.tag_id\n" +
            "where i.image_id = ?\n",
        order: "order by name"
    },
}

export const tagRunQueries = {
    createTag: {
        query: "" +
            "insert into tags (name)\n" +
            "values(?)",
    },
    addImageTag: {
        query: "" +
            "insert into images_tags\n" +
            "select ?, ?",
    },
    removeImageTag: {
        query: "" +
            "delete from images_tags\n" +
            "where image_id = ? and tag_id = ?",
    },
    clearImageTag: {
        query: "" +
            "delete from images_tags " +
            "where image_id = ?",
    }
}
