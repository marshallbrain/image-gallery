import sqlite3, {Database} from "better-sqlite3";
import pathModule from "path";
import {app, ipcMain} from "electron";
import {sqlSelectChannel} from "@utils/ipcCommands";
import {appData} from "@utils/utilities";

export const db: Database = new sqlite3(appData("database.db"), { verbose: console.log })

export default () => {
    app.on("window-all-closed", () => {
        db.close()
    })

    createChannelListeners()

}

const createChannelListeners = () => {
    ipcMain.on(sqlSelectChannel, (event, {channel, query, args}) => {
        const response = db.transaction(() => {
            return preparedStatements[query].all(args)
        })()
        event.reply(channel, response)
    })
}

const imageSearch: any = db.prepare("" +
    "select image_id, extension " +
    "from images"
)

const getImageData: any = db.prepare("" +
    "select title " +
    "from images " +
    "where image_id = ?"
)

const preparedStatements: any =  {
    imageSearch,
    getImageData
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
