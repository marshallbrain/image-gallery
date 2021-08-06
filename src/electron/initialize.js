import MainMenu from "./menu/menuMain";
import savedStore from "../utils/savedStore";
import {ipcMain} from "electron";
import {importImagesChannel} from "../utils/ipcCommands";
import system from "./system";

export default (createWindow) => {
    
    savedStore.initialize({
        fileCache: false
    })
    
    createWindow("index.html", MainMenu).then((window) => {
        system.setLoggingWindow(window)
        createChannelListeners()
    
        console.log = (...data) => {
            system.log(...data)
        }
    })
    
}

const createChannelListeners = () => {
    
    ipcMain.on(importImagesChannel, (event, [files, mappers]) => {
        console.log(files, mappers)
    })
    
}

// sharp(pathModule.join(app.getAppPath(), "../dev-resources/Medivh_full.jpg"))
//     .resize({height: 192})
//     .jpeg({
//         quality: 50,
//         mozjpeg: true
//     })
//     .toFile(pathModule.join(app.getAppPath(), "../dev-resources/thumbnail.jpg")).then()
