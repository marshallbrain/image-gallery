import {db} from "@electron/database/database";
import {PreparedStatementsFull} from "@electron/database/preparedStatements/preparedStatements";

const prepared: () => PreparedStatementsFull = () => {

    const getCollections = db.prepare("" +
        "select collection_id, name " +
        "from collections " +
        "order by " +
        "name"
    )

    const getImageCollections = db.prepare("" +
        "select c.name " +
        "from image_collection i " +
        "left join collections c on i.collection_id = c.collection_id " +
        "where i.image_id = ?"
    )

    const createCollection = db.prepare("" +
        "insert into collections (name) " +
        "values(?)"
    )

    const addImageCollection = db.prepare("" +
        "insert into image_collection " +
        "select ?, ?"
    )

    const removeImageCollection = db.prepare("" +
        "delete from image_collection " +
        "where image_id = ? and collection_id = ?"
    )

    const clearImageCollection = db.prepare("" +
        "delete from image_collection " +
        "where image_id = ?"
    )

    return {
        getStatements: {
            getCollections,
            getImageCollections,
        },
        runStatements: {
            createCollection,
            addImageCollection,
            removeImageCollection,
            clearImageCollection,
        }
    }
}

export default prepared
