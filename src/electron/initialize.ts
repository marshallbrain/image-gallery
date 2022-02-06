import MainMenu from "./menu/menuMain";
import savedStore from "../utils/savedStore";
import {app, BrowserWindow, ipcMain, dialog} from "electron";
import {channels, ipcChannels} from "@utils/ipcCommands";
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

export default (createWindow: WindowSetupFunction) => {

    savedStore.initialize({
        fileCache: false
    })

    updateDatabase()
    setupDatabase()

    createWindow("index.html", MainMenu).then((window: BrowserWindow) => {
        system.setLoggingWindow(window)
        createChannelListeners()

        let imageViewerWindow = false
        ipcMain.on(channels.openImageViewer, (_event, [images, index]) => {
            if (!imageViewerWindow) {
                imageViewerWindow = true
                createWindow("index_viewer.html").then((window: BrowserWindow) => {
                    window.on("close", () => {
                        imageViewerWindow = false
                    })
                    //TODO Change to once
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
        importImages(files, mappers, event)
    })

    ipcMain.on(channels.reimportImages, (event, [_files, mappers]) => {
        reimportImages(mappers, () => {
            event.reply(channels.reimportImagesComplete)
        })
    })

    ipcMain.on(channels.getFolder, (event, {callBackChannel, data}) => {
    })

    ipcMain.on(channels.exportImages, (event, [{selected, title}]) => {
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
                sharp(appData("images", "raw", `${image.image_id}.${image.extension}`))
                    .toFile(pathModule.join(folder, filename))
                    .then(() => {
                        resolve(filename)
                    })
                    .catch(() => {
                        reject()
                    })

            }).then((filename) => {
                imagesLeft.delete(id)
                event.reply(
                    channels.imageExported,
                    (selected.size - imagesLeft.size) / selected.size,
                    filename
                )
            }).finally(() => {
                if (imagesLeft.size == 0) {
                    event.reply(channels.imageExportComplete)
                }
            })
        }
    })

}
