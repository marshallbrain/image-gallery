import {db} from "@electron/database/database";
import {appData} from "@utils/utilities";
import moment from "moment";

const currentDBVersion = 2

export default () => {
    const userVersion = db.pragma("user_version", {simple: true}) as number
    if (userVersion == currentDBVersion) return
    else if (userVersion == 0) createDB()
    else if (userVersion < currentDBVersion) {
        db.backup(appData(`database-${moment().format("YY-MM-DD_HH-mm-ss")}.db.bak`)).then(() => {
            db.pragma("foreign_keys = off")
            updateDB(userVersion)
            db.pragma("foreign_keys = on")
        })
    } else throw "Unknown database version"
}

const createDB = db.transaction(() => {
    createTables()
    db.pragma(`user_version = ${currentDBVersion}`)
})

function createTables() {

    for (const table of Object.values(tableDef)) {
        db.prepare("create table if not exists " + table.name + " (" +
            table.def
            + ");"
        ).run()
    }

}

const updateDB = db.transaction((version: number) => {
    createTables()

    switch (version) {
        case 1: {
            moveTable(tableDef.tags)
            moveTable(tableDef.collections)
        }
    }

    db.pragma(`user_version = ${currentDBVersion}`)
})

function moveTable(table: { name: string, def: string }, newColumns?: string, oldColumns?: string) {
    db.prepare("create table new_" + table.name + " (" +
        table.def
        + ");").run()

    db.prepare("" +
        "INSERT INTO new_" + table.name +
        (newColumns ? `(${newColumns})` : "")
        + " SELECT " +
        (oldColumns || "*")
        + " FROM " + table.name +
        ";"
    ).run()

    db.prepare("drop table " + table.name + ";").run()
    db.prepare("alter table new_" + table.name + " rename to " + table.name + ";").run()
}

const tableDef = {
    images: {
        name: "images",
        def: "" +
            "image_id integer primary key," +
            "title text not null," +
            "image_width integer not null," +
            "image_height integer not null," +
            "date_added integer not null," +
            "extension text not null," +
            "original_metadata text not null," +
            "original_exif text not null "
    },
    tags: {
        name: "tags",
        def: "" +
            "tag_id integer primary key," +
            "name text not null unique collate nocase"
    },
    imagesTags: {
        name: "images_tags",
        def: "" +
            "image_id integer not null," +
            "tag_id integer not null," +
            "primary key (image_id, tag_id)," +
            "foreign key (image_id) " +
            "references images (image_id) " +
            "on update cascade " +
            "on delete cascade," +
            "foreign key (tag_id) " +
            "references tags (tag_id) " +
            "on update cascade " +
            "on delete cascade"
    },
    collections: {
        name: "collections",
        def: "" +
            "collection_id integer primary key," +
            "name text not null unique collate nocase"
    },
    imageCollection: {
        name: "images_collections",
        def: "" +
            "image_id integer not null," +
            "collection_id integer not null," +
            "primary key (image_id, collection_id)," +
            "foreign key (image_id) " +
            "references images (image_id) " +
            "on update cascade " +
            "on delete cascade," +
            "foreign key (collection_id) " +
            "references collections (collection_id) " +
            "on update cascade " +
            "on delete cascade"
    }
}

// const update = (version: number) => {
//     if (version == currentDBVersion-1) {
//         transferTable(
//             "images",
//             "(" +
//             "image_id integer primary key," +
//             "title text," +
//             "author text," +
//             "extension text," +
//             "original_metadata text" +
//             ")",
//             "image_id, title, author, original_metadata",
//             "*"
//         )
//         version = currentDBVersion
//     }
//     db.pragma(`user_version = ${currentDBVersion}`)
// }
//
// const transferTable = (name: string, strut: string, transformFrom: string, transformTo: string, script?: () => void) => {
//     db.transaction(() => {
//         if (script) script()
//         db.prepare(`create table ${name}Temp ${strut};`).run()
//         db.prepare(`insert into ${name}Temp (${transformFrom}) select ${transformTo} from ${name}`).run()
//         db.prepare(`drop table if exists ${name}`).run()
//         db.prepare(`alter table ${name}Temp rename to ${name};`).run()
//     })()
// }

// export default () => {
//     const userVersion = db.pragma("user_version", {simple: true}) as number
//     if (userVersion == currentDBVersion) return
//     if (userVersion == 0) createDB()
//     else {
//         const userStrut = pastDBStrut[userVersion]
//         const [tableDelta, columnMap] = getTableDelta(userStrut)
//         updateDB(tableDelta as DBDelta, columnMap as {[key: string]: string[]})
//     }
//
//     db.pragma("user_version = ${currentDBVersion}`)
// }
//
// // Finds which table are different between the users version and the current version
// const getTableDelta = (userStrut: PastDBStrut) => {
//     const dbUpdate: DBDelta = {}
//     const columnMap: {[key: string]: string[]} = {}
//     for (const [key, table] of Object.entries(dbStructure)) {
//         // @ts-ignore
//         const userTable = userStrut.database[key]
//         if (table !== userTable) {
//             dbUpdate[key] = table
//             columnMap[key] = userStrut.columnMapping[key]
//         }
//     }
//     return [dbUpdate, columnMap]
// }
//
// const createDB = db.transaction( () => {
//     db.prepare(`create table ${dbStructure.images.name}Temp ${dbStructure.images.strut};`).run()
// })
//
// // Creates a new table for each table that needs to be changed
// // Copies all of the columns from the old table to the appropriate columns in the new table
// const updateDB = db.transaction((tableDelta: DBDelta, columnMap: {[key: string]: string[]}) => {
//     for (const [key, table] of Object.entries(tableDelta)) {
//         db.prepare(`create table ${table.name}Temp ${table.strut};`).run()
//         db.prepare(
//             `insert into ${table.name}Temp (${columnMap[key].join(", ")}) select * from ${table.name}`
//         ).run()
//         db.prepare(`drop table if exists ${table.name}`).run()
//         db.prepare(`alter table ${table.name}Temp rename to ${table.name};`).run()
//     }
// })
//
// export interface DBDelta {
//     [key: string]: {
//         name: string,
//         strut: string
//     }
// }

// INSERT INTO {insert into table} ({list of columns in order as related to other table})
// SELECT * FROM {other table}
