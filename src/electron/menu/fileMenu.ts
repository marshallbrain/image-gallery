import menuActions, {handleMenuItemClick} from "@electron/actions/menuActions";

export default {
    label: "File",
    submenu: [
        {
            id: menuActions.importImages,
            label: "Import Images",
            click: handleMenuItemClick
        },
        {
            type: "separator"
        },
        {
            role: "quit",
            label: "Exit"
        }
    ]
}
