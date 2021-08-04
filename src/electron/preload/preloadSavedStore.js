import {getEntry, getEntryAsyncResponse, setEntry} from "../../utils/savedStore";

export default (ipcRenderer, fs) => {
    
    return {
        get: (key) => {
            return ipcRenderer.sendSync(getEntry, key)
        },
        getRequest: (key) => {
            ipcRenderer.send(getEntryAsyncResponse, key)
        },
        getResponse: (entry, func) => {
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
