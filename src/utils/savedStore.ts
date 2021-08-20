import {app, IpcMain} from "electron"
import dotProp from "dot-prop";
import fs from "fs";
import pathModule from "path";
import {isDev} from "./utilities";
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
let options: Options
let fileData = {}
let file: string

const readFile = () => {
    let data = {}
    try {
        data = JSON.parse(fs.readFileSync(file, 'utf8'))
    } catch (e) {
        if (e.code === "ENOENT") {
            data = options.defaultData

            data = JSON.stringify(data)

            fs.writeFileSync(file, data)
            data = options.defaultData
        } else {
            console.log(e.message)
        }
    }
    return data
}
const writeFile = () => {
    try {
        let data = fileData

        data = JSON.stringify(data, null, 4)
        fs.writeFile(file, data, () => {
        })
    } catch (e) {
        console.log(e)
    }
}

export default {

    initialize(userOptions: UserOptions = {}) {
        if (initialized) {
            return
        }
        initialized = true
        options = {...defaultOptions, ...userOptions}

        const getPath = () => {
            if (isDev) {
                return pathModule.join(app.getAppPath(), `../dev-resources`)
            }
            if (options.path) {
                return options.path
            }
            return app.getPath("appData")
        }

        file = pathModule.join(getPath(), `${options.filename}${options.extension}`)
        console.log(file)
        fileData = readFile()

    },
    mainBinding(ipcMain: IpcMain) {

        ipcMain.on(getEntry, (event, args) => {
            if (!options.fileCache) {
                fileData = readFile()
            }
            event.returnValue = dotProp.get(fileData, args, {})
        })

        ipcMain.on(getEntryAsyncResponse, (event, args) => {
            if (!options.fileCache) {
                fileData = readFile()
            }
            event.reply(getEntryAsyncResponse + args, dotProp.get(fileData, args, {}))
        })

        ipcMain.on(setEntry, (event, key, value) => {
            if (!options.fileCache) {
                fileData = readFile()
            }
            fileData = dotProp.set(fileData, key, value)
            writeFile()
            event.returnValue = "done"
        })

    }

}
