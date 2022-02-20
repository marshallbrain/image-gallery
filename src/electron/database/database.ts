import sqlite3, {Database} from "better-sqlite3";
import {app, ipcMain} from "electron";
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

const createChannelListeners = () => {
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
