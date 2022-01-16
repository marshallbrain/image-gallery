import {app, IpcMain} from "electron"
import dotProp from "dot-prop";
import fs from "fs";
import pathModule from "path";
import {appData, isDev} from "./utilities";
import {getEntry, getEntryAsyncResponse, setEntry} from "@utils/ipcCommands";

export interface UserOptions {
    debug?: boolean
    reset?: boolean
    fileCache?: boolean
    path?: string
    filename?: string
    extension?: string
    defaultData?: {}
}

export interface Options extends Omit<UserOptions, "debug" | "reset" | "fileCache" | "filename" | "extension" | "defaultData"> {
    debug: boolean
    reset: boolean
    fileCache: boolean
    filename: string
    extension: string
    defaultData: {}
}

const defaultOptions: Options = {
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
let file: string

const readFile = () => {
    let data = {}
    try {
        data = JSON.parse(fs.readFileSync(file, 'utf8'))
    } catch (e: any) {
        if (e.code === "ENOENT") {
            data = options.defaultData

            let data_string = JSON.stringify(data)

            fs.writeFileSync(file, data_string)
            data = options.defaultData
        } else {
            console.log(e.message)
        }
    }
    return data
}
const writeFile = () => {
    try {
        let data_string = JSON.stringify(fileData, null, 4)
        fs.writeFile(file, data_string, () => {
        })
    } catch (e) {
        console.log(e)
    }
}

const get = (key: string): string => {
    if (!options.fileCache) {
        fileData = readFile()
    }
    return <string>dotProp.get(fileData, key, {})
}

const set = (key: string, value: string) => {
    if (!options.fileCache) {
        fileData = readFile()
    }
    fileData = dotProp.set(fileData, key, value)
    writeFile()
}

export default {

    initialize(userOptions: UserOptions = {}) {
        if (initialized) {
            return
        }
        initialized = true
        options = {...defaultOptions, ...userOptions}
        if (!options.extension.startsWith(".")) {
            options.extension = "." + options.extension
        }

        const getPath = () => {
            if (options.path) {
                return options.path
            }
            return
        }

        file = appData(options.filename + options.extension)
        console.log(file)
        fileData = readFile()

    },
    values: {
        get(key: string) {
            get(key)
        },
        set(value: string, key: string) {
            set(value, key)
        }
    },
    mainBinding(ipcMain: IpcMain) {

        ipcMain.on(getEntry, (event, args) => {
            event.returnValue = get(args)
        })

        ipcMain.on(getEntryAsyncResponse, (event, args) => {
            if (!options.fileCache) {
                fileData = readFile()
            }
            event.reply(getEntryAsyncResponse + args, get(args))
        })

        ipcMain.on(setEntry, (event, key, value) => {
            set(key, value)
            event.returnValue = "done"
        })

    }

}
