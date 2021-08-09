import {getEntry, getEntryAsyncRequest, getEntryAsyncResponse, setEntry} from "@electron/ipcCommands";

export const savedStorePreload = (ipcRenderer) => {
    return {
        get: (key) => {
            return ipcRenderer.sendSync(getEntry, key)
        },
        getRequest: (key) => {
            ipcRenderer.send(getEntryAsyncRequest, key)
        },
        getResponse: (key, func) => {
            ipcRenderer.once(getEntryAsyncResponse + key, (event, data) => {
                func(data)
            })
        },
        set: (key, value) => {
            ipcRenderer.sendSync(setEntry, key, value)
        },
        setRequest: () => {
        },
        setResponse: () => {
        },
        delete: () => {
        },
        deleteRequest: () => {
        },
        deleteResponse: () => {
        },
    }
}
