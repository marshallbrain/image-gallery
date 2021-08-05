import {openImportDialogChannel} from "../../utils/ipcCommands";

export const handleMenuItemClick = (menuItem, browserWindow, event) => {
    
    switch (menuItem.label) {
        case "Import": {
            browserWindow.webContents.send(openImportDialogChannel, "")
        }
    }

}
