import {logFeedChannel} from "../../utils/ipcCommands";

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
