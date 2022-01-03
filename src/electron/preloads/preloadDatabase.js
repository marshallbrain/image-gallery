import {namespaceSql, sqlGetChannel} from "@electron/ipcCommands";

export const databasePreload = (ipcRenderer) => {
    return {
        getImages: (data, callback) => {
            const channel = namespaceSql + (Math.random() * 1000000).toFixed(0)
            ipcRenderer.once(channel, (event, ...data) => {
                callback(...data)
            })
            ipcRenderer.send(sqlGetChannel, {channel, data})
        }
    }
}
