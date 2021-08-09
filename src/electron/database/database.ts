import sqlite3, {Database} from "better-sqlite3";
import pathModule from "path";
import {app} from "electron";

export const currentDBVersion = 2
export const db: Database = new sqlite3(pathModule.join(app.getAppPath(), "../dev-resources/database.db"), { verbose: console.log })

export default () => {
    app.on("window-all-closed", () => {
        db.close()
    })

}

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
