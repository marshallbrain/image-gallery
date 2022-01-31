import {namespaceSql, sqlSelectChannel} from "@utils/ipcCommands";

export const databasePreload = (ipcRenderer) => {
    return {
        getImages: (query, callback, args) => {
            const channel = namespaceSql + (Math.random() * 1000000).toFixed(0)
            ipcRenderer.once(channel, (event, ...data) => {
                callback(...data)
            })
            ipcRenderer.send(sqlSelectChannel, {channel, query, args})
        }
    }
}
