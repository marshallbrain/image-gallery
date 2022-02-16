import MainMenu from "./menu/menuMain";
import savedStore from "../utils/savedStore";
import {app, BrowserWindow, ipcMain, dialog} from "electron";
import {channels as ipcChannels} from "@utils/ipcCommands";
import system from "./system";
import {WindowSetupFunction} from "../main";
import importImages from "./database/importImages";
import setupDatabase, {db} from "@electron/database/database";
import updateDatabase from "@electron/database/updateDatabase";
import fs from "fs";
import pathModule from "path";
import reimportImages from "@electron/database/reimportImages";
import {appData, isDev} from "@utils/utilities";
import sharp from "sharp";
import channels from "@utils/channels";

export default (createWindow: WindowSetupFunction) => {

    savedStore.initialize({
        fileCache: false
    })

    updateDatabase()
    setupDatabase()

    createWindow("index.html", MainMenu).then((window: BrowserWindow) => {
        system.setLoggingWindow(window)
        window.maximize()

        ipcMain.on(ipcChannels.setWindowTitle, (event, [title]) => {
            if (event.frameId == window.id){
                window.setTitle(title)
            }
        })

        createChannelListeners()

        let imageViewerWindow = false
        ipcMain.on(ipcChannels.openImageViewer, (_event, [images, index]) => {
            if (!imageViewerWindow) {
                imageViewerWindow = true
                createWindow("index_viewer.html").then((window: BrowserWindow) => {
                    window.on("close", () => {
                        imageViewerWindow = false
                    })
                    //TODO Change to once
                    ipcMain.on(ipcChannels.onImageViewerOpen, (event) => {
                        event.reply(ipcChannels.updateImageViewerList, images, index)
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

    ipcMain.on(channels.execute.importImages, (event, [files, mappers]) => {
        importImages(files, mappers, event)
    })

    ipcMain.on(ipcChannels.reimportImages, (event, [_files, mappers]) => {
        reimportImages(mappers, () => {
            event.reply(ipcChannels.reimportImagesComplete)
        })
    })

    ipcMain.on(ipcChannels.getFolder, (event, {callBackChannel, data}) => {
    })

    ipcMain.on(channels.execute.exportImages, (event, {selected, title}) => {
        const location = dialog.showOpenDialogSync({
            buttonLabel: "Select",
            message: "Select export folder",
            properties: [
                "openDirectory",
                "createDirectory",
                "treatPackageAsDirectory"
            ]
        })

        if (!location) return
        const folder = location[0]

        const statement = db.prepare(`select image_id, extension, ${title} from images where image_id = ?`)

        const imagesLeft = new Set(selected)
        for (const id of selected) {
            new Promise((resolve, reject) => {

                const image = db.transaction(() => {
                    return statement.get(id)
                })() as { image_id: number, extension: string, [p: string]: any }

                const filename =
                    image[title] +
                    ((title != "image_id")? `.${image.image_id}`: "") +
                    `.${image.extension}`

                fs.copyFile(
                    appData("images", "raw", `${image.image_id}.${image.extension}`),
                    pathModule.join(folder, filename.replace(/[/\\?%*:|"<>]/g, '_')),
                    (error) => {
                        if (error) {
                            reject (filename)
                        } else {
                            resolve(filename)
                        }
                    }
                )

            }).then((filename) => {
                imagesLeft.delete(id)
                event.reply(
                    channels.update.progress,
                    (selected.size - imagesLeft.size) / selected.size,
                    filename
                )
            }).finally(() => {
                if (imagesLeft.size == 0) {
                    event.reply(channels.update.finishProgress)
                }
            })
        }
    })

}
