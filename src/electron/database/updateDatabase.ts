import {Database} from "better-sqlite3";
import dbStructure, {PastDBStrut, pastDBStrut} from "@electron/database/dbStructure";

export default (db: Database) => {
    const userVersion = db.pragma("user_version", {simple: true}) as number
    if (userVersion == 0) createDB(db)
    const userStrut = pastDBStrut[userVersion]
    const [tableDelta, columnMap] = getTableDelta(userStrut)
    updateDB(db, tableDelta as DBDelta, columnMap as {[key: string]: string[]})

    // db.pragma(`user_version = ${currentDBVersion}`)
}

const getTableDelta = (userStrut: PastDBStrut) => {
    const dbUpdate: DBDelta = {}
    const columnMap: {[key: string]: string[]} = {}
    for (const [key, table] of Object.entries(dbStructure)) {
        // @ts-ignore
        const userTable = userStrut.database[key]
        if (table !== userTable) {
            dbUpdate[key] = table
            columnMap[key] = userStrut.columnMapping[key]
        }
    }
    return [dbUpdate, columnMap]
}

const createDB = (db: Database) => {
}

const updateDB = (db: Database, tableDelta: DBDelta, columnMap: {[key: string]: string[]}) => {
    db.transaction(() => {
        for (const [key, table] of Object.entries(tableDelta)) {
            db.prepare(`create table ${table.name}Temp ${table.strut};`).run()
            db.prepare(
                `insert into ${table.name}Temp (${columnMap[key].join(", ")}) select * from ${table.name}`
            ).run()
            db.prepare(`drop table if exists ${table.name}`).run()
            db.prepare(`alter table ${table.name}Temp rename to ${table.name};`).run()
        }
    })()
}

export interface DBDelta {
    [key: string]: {
        name: string,
        strut: string
    }
}

// INSERT INTO {insert into table} ({list of columns in order as related to other table})
// SELECT * FROM {other table}
