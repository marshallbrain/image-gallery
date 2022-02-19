import {BrowserWindow, MenuItem as MI} from "electron";
import channels from "@utils/channels";

export const handleMenuItemClick = (menuItem: MI, browserWindow: BrowserWindow, _event: any) => {
    switch (menuItem.id as unknown as Actions) {
        case Actions.importImages: {
            browserWindow.webContents.send(channels.dialogs.importImages)
            break
        }
    }
}

enum Actions {
    importImages
}

export default Actions
