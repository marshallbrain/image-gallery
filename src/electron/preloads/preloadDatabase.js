import {v4 as uuid} from "uuid"
import channels from "@utils/channels";

export const databasePreload = (ipcRenderer) => {
    return {
        getQuery: (query, callback, args) => {
            const channel = uuid()
            ipcRenderer.once(channel, (event, data) => {
                callback(data)
            })
            ipcRenderer.send(channels.sql.get, {channel, query, args})
        },
        runQuery: (query, callback, args) => {
            const channel = uuid()
            ipcRenderer.once(channel, (event, data) => {
                callback(data)
            })
            ipcRenderer.send(channels.sql.run, {channel, query, args})
        },
        search: (callback, args) => {
            const channel = uuid()
            ipcRenderer.once(channel, (event, ...data) => {
                callback(...data)
            })
            ipcRenderer.send(channels.sql.search, {channel, args})
        },
    }
}
