import {PreparedStatementsFull} from "@electron/database/preparedStatements/preparedStatements";
import {db} from "@electron/database/database";

const imageSearch = db.prepare("" +
    "select image_id, extension " +
    "from images"
)

const getImageData = db.prepare("" +
    "select image_id, title, image_width, image_height " +
    "from images " +
    "where image_id = ?"
)

const prepared: PreparedStatementsFull = {
    getStatements: {
        getImageData,
        imageSearch,
    },
    runStatements: {
    }
}

export default prepared
