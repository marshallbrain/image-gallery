import {sqlQueryChannel, sqlSearchChannel, sqlSelectChannel} from "@utils/ipcCommands";
import {v4 as uuid} from "uuid"

export const databasePreload = (ipcRenderer) => {
    return {
        query: (query, callback, args) => {
            const channel = uuid()
            ipcRenderer.once(channel, (event, ...data) => {
                console.log(data)
                callback(...data)
            })
            ipcRenderer.send(sqlQueryChannel, {channel, query, args})
        },
        
        
        
        getImages: (query, callback, args) => {
            const channel = uuid()
            ipcRenderer.once(channel, (event, ...data) => {
                callback(...data)
            })
            ipcRenderer.send(sqlSelectChannel, {channel, query, args})
        },
        search: (callback, args) => {
            const channel = uuid()
            ipcRenderer.once(channel, (event, ...data) => {
                callback(...data)
            })
            ipcRenderer.send(sqlSearchChannel, {channel, args})
        }
    }
}
