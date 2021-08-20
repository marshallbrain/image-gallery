import {BrowserWindow, MenuItem} from "electron";
import {channels} from "@utils/ipcCommands";

export const handleMenuItemClick = (menuItem: MenuItem, browserWindow: BrowserWindow, _event: any) => {
    switch (menuItem.label) {
        case "Import Images": {
            browserWindow.webContents.send(channels.openImportDialog)
            break
        }
        case "Reimport Images": {
            browserWindow.webContents.send(channels.openReimportDialog)
            break
        }
    }
}
