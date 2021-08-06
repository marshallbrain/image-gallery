import {logFeedChannel} from "../utils/ipcCommands";

let loggingWindow

export default {
    registerBindings: (browserWindow) => {
    
    },
    setLoggingWindow: (browserWindow) => {
        loggingWindow = browserWindow
    },
    log: (...data) => {
        loggingWindow.webContents.send(logFeedChannel, ...data)
    }
}
