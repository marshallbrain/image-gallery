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
    },
    allSelected: {
        query: "" +
            "select count(*) as n\n" +
            "from selected s\n" +
            "inner join search f on s.image_id = f.image_id\n" +
            "where f.id between ? and ?"
    },
    getCommonBookmark: {
        query: "" +
            "select min(i.bookmark) as bookmark\n" +
            "from images i\n" +
            "inner join selected s on i.image_id = s.image_id",
        order: "order by bookmark"
    },
    getAuthor: {
        query: "" +
            "select author\n" +
            "from images\n" +
            "where image_id = ?",
        order: "order by author"
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
            "where id between ? and ?"
    },
    selectAllImages: {
        query: "" +
            "insert or ignore into selected (image_id)\n" +
            "select image_id\n" +
            "from search\n"
    },
    deselectImages: {
        query: "" +
            "delete from selected\n" +
            "where image_id in (\n" +
                "select s.image_id\n" +
                "from selected s\n" +
                "inner join search f on s.image_id = f.image_id\n" +
                "where f.id between ? and ?\n" +
            ")"
    },
    deselectAllImages: {
        query: "" +
            "delete from selected"
    },
    selectionBookmarkImages: {
        query: "" +
            "update images\n" +
            "set bookmark = 1\n" +
            "where bookmark = 0 and\n" +
            "image_id in (select image_id from selected)"
    },
    selectionUnbookmarkImages: {
        query: "" +
            "update images\n" +
            "set bookmark = 0\n" +
            "where bookmark = 1 and\n" +
            "image_id in (select image_id from selected)"
    }
}
