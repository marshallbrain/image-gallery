import MainMenu from "./menu/menuMain";
import savedStore from "../utils/savedStore";
import {BrowserWindow, ipcMain} from "electron";
import {channels as ipcChannels} from "@utils/ipcCommands";
import system from "./system";
import {WindowSetupFunction} from "../main";
import importImages from "./actions/importImages";
import setupDatabase from "@electron/database/database";
import updateDatabase from "@electron/database/updateDatabase";
import channels from "@utils/channels";
import exportImages from "@electron/actions/exportImages";

export default (createWindow: WindowSetupFunction) => {

    savedStore.initialize({
        fileCache: false
    })

    updateDatabase()
    setupDatabase()

    createWindow("index.html", MainMenu).then((window: BrowserWindow) => {
        system.setLoggingWindow(window)
        window.maximize()

        createChannelListeners(window)

        // let imageViewerWindow = false
        // ipcMain.on(ipcChannels.openImageViewer, (_event, [images, index]) => {
        //     if (!imageViewerWindow) {
        //         imageViewerWindow = true
        //         createWindow("index_viewer.html").then((window: BrowserWindow) => {
        //             window.on("close", () => {
        //                 imageViewerWindow = false
        //             })
        //             //TODO Change to once
        //             ipcMain.on(ipcChannels.onImageViewerOpen, (event) => {
        //                 event.reply(ipcChannels.updateImageViewerList, images, index)
        //             })
        //         })
        //     }
        // })

        console.log = (...data) => {
            system.log(...data)
        }

    })

}

const createChannelListeners = (window: BrowserWindow) => {

    ipcMain.on(ipcChannels.setWindowTitle, (event, [title]) => {
        if (event.frameId == window.id){
            window.setTitle(title)
        }
    })

    ipcMain.on(channels.execute.importImages, (event, [files, mappers]) => {
        importImages(files, mappers, event)
    })

    ipcMain.on(channels.execute.exportImages, (event, {selected, title}) => {
        exportImages(selected, title, event)
    })

}
