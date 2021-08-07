import {logFeedChannel} from "@electron/ipcCommands";

export const systemPreload = (ipcRenderer) => {
    return {
        registerListener: {
            log: (listener) => {
                ipcRenderer.on(logFeedChannel, (event, ...data) => {
                    listener(...data)
                })
            }
        },
    }
}
