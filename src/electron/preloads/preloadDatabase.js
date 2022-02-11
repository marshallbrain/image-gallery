import {
    sqlGetQueryChannel,
    sqlQueryChannel,
    sqlRunQueryChannel,
    sqlSearchChannel,
    sqlSelectChannel
} from "@utils/ipcCommands";
import {v4 as uuid} from "uuid"

export const databasePreload = (ipcRenderer) => {
    return {
        getQuery: (query, callback, args) => {
            const channel = uuid()
            ipcRenderer.once(channel, (event, data) => {
                callback(data)
            })
            ipcRenderer.send(sqlGetQueryChannel, {channel, query, args})
        },
        runQuery: (query, callback, args) => {
            const channel = uuid()
            ipcRenderer.once(channel, (event, data) => {
                callback(data)
            })
            ipcRenderer.send(sqlRunQueryChannel, {channel, query, args})
        },
        search: (callback, args) => {
            const channel = uuid()
            ipcRenderer.once(channel, (event, ...data) => {
                callback(...data)
            })
            ipcRenderer.send(sqlSearchChannel, {channel, args})
        },
        
        
        
        getImages: (query, callback, args) => {
            const channel = uuid()
            ipcRenderer.once(channel, (event, ...data) => {
                callback(...data)
            })
            ipcRenderer.send(sqlSelectChannel, {channel, query, args})
        },
    }
}
