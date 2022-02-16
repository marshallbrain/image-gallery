import sqlite3, {Database, Statement} from "better-sqlite3";
import pathModule from "path";
import {app, ipcMain} from "electron";
import {sqlGetQueryChannel, sqlRunQueryChannel, sqlSelectChannel} from "@utils/ipcCommands";
import {appData} from "@utils/utilities";
import searchQuery from "@electron/database/searchQuery";
import channels from "@utils/channels";

export const db: Database = new sqlite3(appData("database.db"), { verbose: console.log })

export default () => {
    app.on("window-all-closed", () => {
        db.close()
    })

    createChannelListeners()

}

const createChannelListeners = (
) => {
    ipcMain.on(channels.sql.get, (event, {channel, query, args}) => {
        try {
            const response = db.transaction(() => {
                return db.prepare(query).all(args)
            })()
            event.reply(channel, response)

        } catch (e) {
            event.reply(channel, e)
        }
    })

    ipcMain.on(channels.sql.run, (event, {channel, query, args}) => {
        try {
            const response = db.transaction(() => {
                return db.prepare(query).run(args)
            })()
            event.reply(channel, response)

        } catch (e) {
            event.reply(channel, e)
        }
    })

    searchQuery()
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
