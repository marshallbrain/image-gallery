import {db} from "@electron/database/database";
import {PreparedStatementsFull} from "@electron/database/preparedStatements/preparedStatements";


const getTags = db.prepare("" +
    "select tag_id, name " +
    "from tags " +
    "order by " +
    "name"
)

const getImageTags = db.prepare("" +
    "select t.name " +
    "from images_tags i " +
    "left join tags t on i.tag_id = t.tag_id " +
    "where i.image_id = ?"
)

const createTag = db.prepare("" +
    "insert into tags (name) " +
    "values(?)"
)

const addImageTag = db.prepare("" +
    "insert into images_tags " +
    "select ?, ?"
)

const removeImageTag = db.prepare("" +
    "delete from images_tags " +
    "where image_id = ? and tag_id = ?"
)

const clearImageTag = db.prepare("" +
    "delete from images_tags " +
    "where image_id = ?"
)

const prepared: PreparedStatementsFull = {
    getStatements: {
        getTags,
        getImageTags,
    },
    runStatements: {
        createTag,
        addImageTag,
        removeImageTag,
        clearImageTag,
    }
}

export default prepared
