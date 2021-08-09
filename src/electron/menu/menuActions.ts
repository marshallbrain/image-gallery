import {BrowserWindow, MenuItem} from "electron";
import {openImportDialogChannel} from "@electron/ipcCommands";

export const handleMenuItemClick = (menuItem: MenuItem, browserWindow: BrowserWindow, _event: any) => {
    switch (menuItem.label) {
        case "Import": {
            browserWindow.webContents.send(openImportDialogChannel)
        }
    }
}
