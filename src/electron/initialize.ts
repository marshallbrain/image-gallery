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
import {isDev} from "@utils/utilities";

export default (createWindow: WindowSetupFunction) => {

    savedStore.initialize({
        fileCache: false
    })

    database()
    updateDatabase()

    createWindow("index.html", MainMenu).then((window: BrowserWindow) => {
        system.setLoggingWindow(window)
        createChannelListeners()

        let imageViewerWindow = false
        ipcMain.on(channels.openImageViewer, (_event, [images, index]) => {
            if (!imageViewerWindow) {
                imageViewerWindow = true
                createWindow("index_viewer.html", MainMenu).then((window: BrowserWindow) => {
                    window.on("close", () => {
                        imageViewerWindow = false
                    })
                    ipcMain.on(channels.onImageViewerOpen, (event) => {
                        event.reply(channels.updateImageViewerList, images, index)
                    })
                })
            }
        })

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

    ipcMain.on(channels.reimportImages, (event, [_files, mappers]) => {
        reimportImages(mappers, () => {
            event.reply(channels.reimportImagesComplete)
        })
    })

}
