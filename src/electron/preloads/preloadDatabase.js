import {namespaceSql, sqlSelectChannel} from "@electron/ipcCommands";

export const databasePreload = (ipcRenderer) => {
    return {
        getImages: (query, callback) => {
            const channel = namespaceSql + (Math.random() * 1000000).toFixed(0)
            ipcRenderer.once(channel, (event, ...data) => {
                callback(...data)
            })
            ipcRenderer.send(sqlSelectChannel, {channel, query})
        }
    }
}
