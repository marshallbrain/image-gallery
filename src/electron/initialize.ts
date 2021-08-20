import MainMenu from "./menu/menuMain";
import savedStore from "../utils/savedStore";
import {app, BrowserWindow, ipcMain} from "electron";
import {channels} from "@utils/ipcCommands";
import system from "./system";
import {WindowSetupFunction} from "../main";
import importImages from "./database/importImages";
import database from "@electron/database/database";
import updateDatabase from "@electron/database/updateDatabase";
import fs from "fs";
import pathModule from "path";
import reimportImages from "@electron/database/reimportImages";

export default (createWindow: WindowSetupFunction) => {
    
    savedStore.initialize({
        fileCache: false
    })

    setupDir()
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
    
    ipcMain.on(channels.importImages, (event, [files, mappers]) => {
        importImages(files, mappers, () => {
            event.reply(channels.importImagesComplete)
        })
    })

    ipcMain.on(channels.reimportImages, (event, [files, mappers]) => {
        reimportImages(files, mappers, () => {
            event.reply(channels.reimportImagesComplete)
        })
    })
    
}

const setupDir = () => {
    fs.mkdirSync(pathModule.join(app.getAppPath(), `../dev-resources/images/raw`), { recursive: true })
}



// sharp(pathModule.join(app.getAppPath(), "../dev-resources/Medivh_full.jpg"))
//     .resize({height: 192})
//     .jpeg({
//         quality: 50,
//         mozjpeg: true
//     })
//     .toFile(pathModule.join(app.getAppPath(), "../dev-resources/thumbnail.jpg")).then()
