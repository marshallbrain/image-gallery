import {Database} from "better-sqlite3";
import dbStructure, {ColumnConstraints, PastDBStrut, pastDBStrut} from "@electron/database/dbStructure";
import {AnyObject} from "@utils/utilities";
import {DBDataType} from "@electron/database/database";

export default (db: Database) => {
    const userVersion = db.pragma("user_version", {simple: true}) as number
    if (userVersion == 0) createDB(db)
    const userStrut = pastDBStrut[userVersion]
    const [tableDelta, columnMap] = getTableDelta(userStrut)
    updateDB(db, tableDelta, columnMap)

    // db.pragma(`user_version = ${currentDBVersion}`)
}

const getTableDelta = (userStrut: PastDBStrut) => {
    const dbUpdate: DBDelta = {}
    const columnMap: AnyObject = {}
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
}

const updateDB = (db: Database, tableDelta: DBDelta, columnMap: AnyObject) => {
    for (const [key, table] of Object.entries(tableDelta)) {
        db.prepare(`
            create table if not exists ${table.name}Temp(${
            table.columns
                .map(column => [
                    column.name, 
                    column.dataType, 
                    column.constraints && column.constraints.join(" ")
                    ].join(" "))
                .join(", ")
            });
        `).run()
        db.prepare(`
            insert into ${table.name}Temp (${columnMap[key].join(", ")})
            select * from ${table.name}
        `).run()
    }
}

export interface DBDelta {
    [key: string]: {
        name: string
        columns: {
            name: string
            dataType: DBDataType
            constraints?: ColumnConstraints[]
        }[]
    }
}

// INSERT INTO {insert into table} ({list of columns in order as related to other table})
// SELECT * FROM {other table}
