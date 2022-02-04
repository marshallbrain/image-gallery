import {namespaceSql, sqlSelectChannel} from "@utils/ipcCommands";
import {v4 as uuid} from "uuid"

export const databasePreload = (ipcRenderer) => {
    return {
        getImages: (query, callback, args) => {
            const channel = uuid()
            ipcRenderer.once(channel, (event, ...data) => {
                callback(...data)
            })
            ipcRenderer.send(sqlSelectChannel, {channel, query, args})
        }
    }
}
