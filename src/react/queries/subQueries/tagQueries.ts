export const tagGetQueries = {
    getTags: {
        query: "" +
            "select tag_id, name\n" +
            "from tags",
        order: "order by name"
    }
}
