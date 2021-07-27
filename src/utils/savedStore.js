import {namespaceStore} from "./ipcCommands";
import {app} from "electron"
import dotProp from "dot-prop";
import fs from "fs";
import pathModule from "path";

const defaultOptions = {
    debug: false,
    reset: false,
    fileCache: true,
    path: "",
    filename: "settings",
    extension: ".json",
    defaultData: {},
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
    
    constructor(options = {}) {
        this.options = options && {...defaultOptions, ...options}
        this.fileData = {}
        this.file = pathModule.join(
            this.options.path !== "" ? this.options.path : app.getPath("userData"),
            `${this.options.filename}${this.options.extension}`
        )
        fs.mkdir(this.options.path, { recursive: true }, (err) => {
            if (err) throw err;
        });
        
        this.fileData = this.readFile()
        
    }
    
    readFile = () => {
        let data = ""
        try {
            data = JSON.parse(fs.readFileSync(this.file, 'utf8'))
        } catch (e) {
            if(e.code === "ENOENT") {
                data = this.options.defaultData
                
                data = JSON.stringify(data)
                
                fs.writeFileSync(this.file, data);
                data = this.options.defaultData
            } else {
            
            }
        }
        return data
    }
    
    writeFile = () => {
        try {
            fs.writeFileSync(this.file, this.fileData, 'utf8')
        } catch (e) {
        }
    }
    
    mainBinding(ipcMain, browserWindow, fs) {
        
        ipcMain.on(getEntry, (event, args) => {
            if (!this.options.fileCache) {
                this.fileData = this.readFile()
            }
            event.returnValue = dotProp.get(this.fileData, args)
        })
    
        ipcMain.on(getEntryAsyncResponse, (event, args) => {
            if (!this.options.fileCache) {
                this.fileData = this.readFile()
            }
            event.reply(getEntryAsyncResponse+args, dotProp.get(this.fileData, args))
        })
        
        ipcMain.on(setEntry, (event, [key, value]) => {
            if (!this.options.fileCache) {
                this.fileData = this.readFile()
            }
            dotProp.set(this.fileData, key, value)
            this.writeFile(this.fileData)
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
