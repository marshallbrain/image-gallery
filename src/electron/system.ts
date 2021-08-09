import {logFeedChannel} from "@electron/ipcCommands";
import {BrowserWindow} from "electron";

let loggingWindow: BrowserWindow

export default {
    registerBindings: (_browserWindow: BrowserWindow) => {
    
    },
    setLoggingWindow: (browserWindow: BrowserWindow) => {
        loggingWindow = browserWindow
    },
    log: (...data: any[]) => {
        loggingWindow.webContents.send(logFeedChannel, ...data)
    }
}
