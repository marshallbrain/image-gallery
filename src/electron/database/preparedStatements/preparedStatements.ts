import {Statement} from "better-sqlite3";
import _ from "lodash"
import tagStatements from "@electron/database/preparedStatements/tagStatements";
import imageStatements from "@electron/database/preparedStatements/imageStatements";
import collectionStatements from "@electron/database/preparedStatements/collectionStatements";

const prepared: () => PreparedStatementsFull = () => {
    return _.merge(
        imageStatements(),
        tagStatements(),
        collectionStatements()
    )
}

export interface PreparedStatementsFull {
    getStatements: PreparedStatements,
    runStatements: PreparedStatements
}

export interface PreparedStatements {
    [index: string]: Statement
}

export default prepared
