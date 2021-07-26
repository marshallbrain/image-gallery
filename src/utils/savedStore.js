import {namespaceStore} from "./ipcCommands";
import {app} from "electron"
import dotProp from "dot-prop";

const defaultOptions = {
    debug: false,
    reset: false,
    path: "",
    filename: "settings",
    extension: ".json",
};

export const getEntry = `${namespaceStore}get-sync`
export const getEntryAsyncRequest = `${namespaceStore}get-req-`
export const getEntryAsyncResponse = `${namespaceStore}get-res-`
export const setEntry = `${namespaceStore}set-sync`
export const setEntryAsyncRequest = `${namespaceStore}set-req-`
export const setEntryAsyncResponse = `${namespaceStore}set-res-`
export const deleteEntry = `${namespaceStore}del-sync`
export const deleteEntryAsyncRequest = `${namespaceStore}del-req-`
export const deleteEntryAsyncResponse = `${namespaceStore}del-res-`

export default class SavedStore {
    
    #fileData = {test: "!!!!"}
    
    constructor(options = {}) {
        this.options = defaultOptions;
    
        if (typeof options !== "undefined") {
            this.options = Object.assign(this.options, options);
        }
    }
    
    mainBinding(ipcMain, browserWindow, fs, ) {
        
        ipcMain.on(getEntry, (event, args) => {
            event.returnValue = dotProp.get(this.#fileData, args)
        })
    
        ipcMain.on(getEntryAsyncResponse, (event, args) => {
            event.reply(getEntryAsyncResponse+args, dotProp.get(this.#fileData, args))
        })
    
    }
    
}

export const preloadBindings = (ipcRenderer, fs) => {
    
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
        set: () => {
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
