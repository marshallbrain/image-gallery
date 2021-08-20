import {BrowserWindow, MenuItem} from "electron";
import {openImportDialogChannel, openReimportDialogChannel} from "@electron/ipcCommands";

export const handleMenuItemClick = (menuItem: MenuItem, browserWindow: BrowserWindow, _event: any) => {
    switch (menuItem.label) {
        case "Import Images": {
            browserWindow.webContents.send(openImportDialogChannel)
            break
        }
        case "Reimport Images": {
            browserWindow.webContents.send(openReimportDialogChannel)
            break
        }
    }
}
