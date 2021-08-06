import MainMenu from "./menu/menuMain";
import savedStore from "../utils/savedStore";

export default (createWindow) => {
    savedStore.initialize({
        fileCache: false
    })
    
    createWindow("index.html", MainMenu).then((window) => {
        createChannelListeners()
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
