import {db} from "@electron/database/database";
import {PreparedStatementsFull} from "@electron/database/preparedStatements/preparedStatements";

const prepared: () => PreparedStatementsFull = () => {
    const getTags = db.prepare("" +
        "select tag_id, name " +
        "from tags " +
        "order by " +
        "name"
    )

    const getImageTags = db.prepare("" +
        "select t.tag_id, t.name " +
        "from images_tags i " +
        "left join tags t on i.tag_id = t.tag_id " +
        "where i.image_id = ? " +
        "order by " +
        "name"
    )

    const createTag = db.prepare("" +
        "insert into tags (name) " +
        "values(?)"
    )

    const addImageTag = db.prepare("" +
        "insert into images_tags " +
        "select ?, ?"
    )

    const addImageTagName = db.prepare("" +
        "insert into images_tags " +
        "select ?, tag_id " +
        "from tags " +
        "where name like ?"
    )

    const removeImageTag = db.prepare("" +
        "delete from images_tags " +
        "where image_id = ? and tag_id = ?"
    )

    const clearImageTag = db.prepare("" +
        "delete from images_tags " +
        "where image_id = ?"
    )

    return {
        getStatements: {
            getTags,
            getImageTags,
        },
        runStatements: {
            createTag,
            addImageTag,
            addImageTagName,
            removeImageTag,
            clearImageTag,
        }
    }
}

export default prepared
