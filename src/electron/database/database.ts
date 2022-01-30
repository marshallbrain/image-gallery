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

    const statements = prepareStatements()
    createChannelListeners(statements)

}

const createChannelListeners = (statements: any) => {

    ipcMain.on(sqlSelectChannel, (event, {channel, query, args}) => {
        const response = db.transaction(() => {
            if (args) {
                return statements[query].all(args)
            } else {
                return statements[query].all()
            }
        })()
        event.reply(channel, response)
    })
}

const prepareStatements = () => {

    const imageSearch = db.prepare("" +
        "select image_id, extension " +
        "from images"
    )

    const getImageData = db.prepare("" +
        "select title " +
        "from images " +
        "where image_id = ?"
    )

    const getTags = db.prepare("" +
        "select name " +
        "from tags " +
        "where name = @name " +

        "union " +

        "select name " +
        "from tags " +
        "where name like '%' || @name || '%' " +
        "order by " +
        "name"
    )

    return {
        imageSearch,
        getImageData,
        getTags
    }

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
