const { ipcMain } = require("electron");
const {importImagesChannel} = require("../../utils/ipcCommands");

ipcMain.on(importImagesChannel, (event, files, mappers) => {
    console.log(files, mappers)
})
