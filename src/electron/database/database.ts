import sqlite3, {Database} from "better-sqlite3";
import pathModule from "path";
import {app} from "electron";
import updateDatabase from "@electron/database/updateDatabase";

export const currentDBVersion = 2
const db: Database = new sqlite3(pathModule.join(app.getAppPath(), "../dev-resources/database.db"))

export default () => {
    app.on("window-all-closed", () => {
        db.close()
    })

    updateDatabase(db)

}

export interface InsertData {
    [key: string]: string | number
}
export const insert = (database: string, data: InsertData) => {
    const keys = Object.keys(data)
    const values = Object.values(data)
    db.prepare(`
        insert into ${database} (${keys.map(value => value.toLowerCase()).join(",")})
        values(${values.map(() => "?").join(",")})
    `).run(values)
}
export const insertAll = (database: string, data: [][]) => {

}

export type DBDataType = "integer" | "real" | "text"

/*

Image Database
--------------
ID
Title
Author
Group
Category
Collections
Tags
Rating
Content Rating
Source Website
Date Added
Date Modified
Date Image Modified
Size
Width
Height
Description
Other (Source Url)

Author

Group

Category

Collections

Tags

 */
