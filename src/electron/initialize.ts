import MainMenu from "./menu/menuMain";
import savedStore from "../utils/savedStore";
import {BrowserWindow, ipcMain} from "electron";
import {importImagesChannel} from "./ipcCommands";
import system from "./system";
import {WindowSetupFunction} from "../main";
import {importImages} from "./database/importImages";
import database from "@electron/database/database";
import updateDatabase from "@electron/database/updateDatabase";

export default (createWindow: WindowSetupFunction) => {
    
    savedStore.initialize({
        fileCache: false
    })

    database()
    updateDatabase()
    
    createWindow("index.html", MainMenu).then((window: BrowserWindow) => {
        system.setLoggingWindow(window)
        createChannelListeners()
    
        console.log = (...data) => {
            system.log(...data)
        }

    })
    
}

const createChannelListeners = () => {
    
    ipcMain.on(importImagesChannel, (_event, [files, mappers]) => {
        importImages(files, mappers)
    })
    
}

// sharp(pathModule.join(app.getAppPath(), "../dev-resources/Medivh_full.jpg"))
//     .resize({height: 192})
//     .jpeg({
//         quality: 50,
//         mozjpeg: true
//     })
//     .toFile(pathModule.join(app.getAppPath(), "../dev-resources/thumbnail.jpg")).then()
