import {BrowserWindow, MenuItem} from "electron";
import channels from "@utils/channels";

export const handleMenuItemClick = (menuItem: MenuItem, browserWindow: BrowserWindow, _event: any) => {
    switch (menuItem.label) {
        case "Import Images": {
            browserWindow.webContents.send(channels.dialogs.importImages)
            break
        }
    }
}
