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
        "select c.collection_id, c.name " +
        "from images_collections i " +
        "left join collections c on i.collection_id = c.collection_id " +
        "where i.image_id = ? " +
        "order by " +
        "name"
    )

    const createCollection = db.prepare("" +
        "insert into collections (name) " +
        "values(?)"
    )

    const addImageCollection = db.prepare("" +
        "insert into images_collections " +
        "select ?, ?"
    )

    const removeImageCollection = db.prepare("" +
        "delete from images_collections " +
        "where image_id = ? and collection_id = ?"
    )

    const clearImageCollection = db.prepare("" +
        "delete from images_collections " +
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
