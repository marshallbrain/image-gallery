import {Statement} from "better-sqlite3";
import tagStatements from "@electron/database/preparedStatements/tagStatements";
import imageStatements from "@electron/database/preparedStatements/imageStatements";

const prepared: PreparedStatementsFull = {
    ...(imageStatements),
    ...(tagStatements)
}

export interface PreparedStatementsFull {
    getStatements: PreparedStatements,
    runStatements: PreparedStatements
}

export interface PreparedStatements {
    [index: string]: Statement
}

export default prepared
