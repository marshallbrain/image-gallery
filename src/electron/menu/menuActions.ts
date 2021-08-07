import {BrowserWindow, MenuItem} from "electron";

export const handleMenuItemClick = (menuItem: MenuItem, browserWindow: BrowserWindow, _event: any) => {
    switch (menuItem.label) {
        case "Import": {
            browserWindow.webContents.send(openImportDialogChannel)
        }
    }
}
