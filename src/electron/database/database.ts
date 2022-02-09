import sqlite3, {Database, Statement} from "better-sqlite3";
import pathModule from "path";
import {app, ipcMain} from "electron";
import {channels, sqlQueryChannel, sqlSelectChannel} from "@utils/ipcCommands";
import {appData} from "@utils/utilities";
import preparedStatements, {
    PreparedStatements,
} from "@electron/database/preparedStatements/preparedStatements";
import searchQuery from "@electron/database/searchQuery";

export const db: Database = new sqlite3(appData("database.db"), { verbose: console.log })

export default () => {
    app.on("window-all-closed", () => {
        db.close()
    })

    const {getStatements, runStatements} = preparedStatements()
    createChannelListeners(getStatements, runStatements)

}

const createChannelListeners = (
    getStatements: PreparedStatements,
    runStatements: PreparedStatements
) => {

    ipcMain.on(sqlSelectChannel, (event, {channel, query, args}) => {
        try {
            const response = db.transaction(() => {
                if (query in getStatements) {
                    return args? getStatements[query].all(args): getStatements[query].all()
                } else {
                    return args? runStatements[query].run(args): runStatements[query].run()
                }
            })()
            event.reply(channel, response)

            triggers[query](event)

        } catch (e) {
            event.reply(channel, e)
        }
    })

    ipcMain.on(sqlQueryChannel, (event, {channel, query, args}) => {
        try {
            const response = db.transaction(() => {
                return db.prepare(query).all(args)
            })()
            event.reply(channel, response)

        } catch (e) {
            event.reply(channel, e)
        }
    })

    searchQuery()
}

const triggers: {[index: string]: (event: Electron.IpcMainEvent) => void} = {
    createTag: (event) => event.reply(channels.updateTagLists),
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
