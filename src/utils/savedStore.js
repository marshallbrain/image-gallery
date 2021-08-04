import {namespaceStore} from "./ipcCommands";
import {app} from "electron"
import dotProp from "dot-prop";
import fs from "fs";
import pathModule from "path";
import {isDev} from "./utilities";

export const getEntry = `${namespaceStore}get-sync`
export const getEntryAsyncRequest = `${namespaceStore}get-req-`
export const getEntryAsyncResponse = `${namespaceStore}get-res-`
export const setEntry = `${namespaceStore}set-sync`
export const setEntryAsyncRequest = `${namespaceStore}set-req-`
export const setEntryAsyncResponse = `${namespaceStore}set-res-`
export const deleteEntry = `${namespaceStore}del-sync`
export const deleteEntryAsyncRequest = `${namespaceStore}del-req-`
export const deleteEntryAsyncResponse = `${namespaceStore}del-res-`

const defaultOptions = {
    debug: false,
    reset: false,
    fileCache: true,
    filename: "settings",
    extension: ".json",
    defaultData: {},
};

let initialized = false
let options = defaultOptions
let fileData = {}
let file = null

const readFile = () => {
    let data = ""
    try {
        data = JSON.parse(fs.readFileSync(file, 'utf8'))
    } catch (e) {
        if (e.code === "ENOENT") {
            data = options.defaultData
            
            data = JSON.stringify(data)
            
            fs.writeFileSync(file, data);
            data = options.defaultData
        } else {
        
        }
    }
    return data
}
const writeFile = () => {
    try {
        let data = fileData
        
        data = JSON.stringify(data)
        
        fs.writeFileSync(file, data, 'utf8')
    } catch (e) {
        console.log(e)
    }
}

export default {
    
    initialize(userOptions) {
        if (initialized) {
            return
        }
        initialized = true
        options = userOptions && {...defaultOptions, ...options}
        
        const getPath = () => {
            if (isDev) {
                // fs.mkdir(
                //     "dev-resources",
                //     {recursive: true},
                //     (err) => {
                //         if (err) throw err;
                //     }
                // );
                return "dev-resources"
            }
            if (this.options.path) {
                return this.options.path
            }
            if (process.env.PORTABLE_EXECUTABLE_DIR) {
                // fs.mkdir(
                //     "data",
                //     {recursive: true},
                //     (err) => {
                //         if (err) throw err;
                //     }
                // );
                return pathModule.join(process.env.PORTABLE_EXECUTABLE_DIR, "data")
            }
            return app.getPath("userData")
        }
        
        file = pathModule.join(getPath(), `${this.options.filename}${this.options.extension}`)
        console.log(file)
        // this.fileData = this.readFile()
        
    },
    mainBinding(ipcMain, browserWindow, fs) {
        
        ipcMain.on(getEntry, (event, args) => {
            if (!options.fileCache) {
                fileData = readFile()
            }
            event.returnValue = dotProp.get(fileData, args)
        })
        
        ipcMain.on(getEntryAsyncResponse, (event, args) => {
            if (!options.fileCache) {
                fileData = readFile()
            }
            event.reply(getEntryAsyncResponse + args, dotProp.get(fileData, args))
        })
        
        ipcMain.on(setEntry, (event, key, value) => {
            if (!options.fileCache) {
                fileData = readFile()
            }
            fileData = dotProp.set(fileData, key, value)
            writeFile()
        })
        
    }
    
}
