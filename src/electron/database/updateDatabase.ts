import {Database} from "better-sqlite3";
import dbStructure, {pastDBStrut} from "@electron/database/dbStructure";

export default (db: Database) => {
    const userVersion = db.pragma("user_version", { simple: true }) as number
    const userStrut = pastDBStrut[userVersion]
    const [tableDelta, columnMap] = getTableDelta(userStrut)
    console.log(tableDelta, columnMap)

    // db.pragma(`user_version = ${currentDBVersion}`)
}

const getTableDelta = (userStrut: PastDBStrut) => {
    const dbUpdate: any = {}
    const columnMap: any = {}
    for (const key of Object.keys(dbStructure)) {
        // @ts-ignore
        const table = dbStructure[key]
        // @ts-ignore
        const userTable = userStrut.database[key]
        if (JSON.stringify(table) !== JSON.stringify(userTable)) {
            // @ts-ignore
            dbUpdate[key] = table
            columnMap[key] = userStrut.columnMapping[key]
        }
    }
    return [dbUpdate, columnMap]
}

const createDB = (db: Database) => {
    db.prepare(`
        create table if not exists images (
            image_id integer primary key,
            title text,
            json text
        )
    `).run()
}

// INSERT INTO {insert into table} ({list of columns in order as related to other table})
// SELECT * FROM {other table}
