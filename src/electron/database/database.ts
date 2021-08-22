import sqlite3, {Database} from "better-sqlite3";
import pathModule from "path";
import {app, ipcMain} from "electron";
import {sqlSelectChannel} from "@utils/ipcCommands";

export const db: Database = new sqlite3(pathModule.join(app.getPath("userData"), "/database.db"), { verbose: console.log })

export default () => {
    app.on("window-all-closed", () => {
        db.close()
    })

    createChannelListeners()

}

const createChannelListeners = () => {
    ipcMain.on(sqlSelectChannel, (event, {channel, query}) => {
        const response = db.prepare(query).all()
        event.reply(channel, response)
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
