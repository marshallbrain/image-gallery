import sqlite3 from "better-sqlite3";
import pathModule from "path";
import {app} from "electron";
import updateDatabase from "@electron/database/updateDatabase";

export const currentDBVersion = 2
const db = new sqlite3(pathModule.join(app.getAppPath(), "../dev-resources/database.db"))

export default () => {
    app.on("window-all-closed", () => {
        db.close()
    })

    updateDatabase(db)

}

const db = new sqlite3.Database(pathModule.join(app.getAppPath(), "../dev-resources/database.db"))

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
