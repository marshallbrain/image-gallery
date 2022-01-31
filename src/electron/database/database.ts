import sqlite3, {Database, Statement} from "better-sqlite3";
import pathModule from "path";
import {app, ipcMain} from "electron";
import {channels, sqlSelectChannel} from "@utils/ipcCommands";
import {appData} from "@utils/utilities";

interface PreparedStatements {
    [index: string]: Statement
}

export const db: Database = new sqlite3(appData("database.db"), { verbose: console.log })

export default () => {
    app.on("window-all-closed", () => {
        db.close()
    })

    const [getStatements, runStatements] = prepareStatements()
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
}

const prepareStatements: () => [PreparedStatements, PreparedStatements] = () => {

    const imageSearch = db.prepare("" +
        "select image_id, extension " +
        "from images"
    )

    const getImageData = db.prepare("" +
        "select title, image_width, image_height " +
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

    const createTag = db.prepare("" +
        "insert into tags (name) " +
        "values(?)"
    )

    return [{
        imageSearch,
        getImageData,
        getTags,
    }, {
        createTag,
    }
    ]

}

const triggers: {[index: string]: (event: Electron.IpcMainEvent) => void} = {
    createTag: (event) => event.reply(channels.updateTagLists)
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
