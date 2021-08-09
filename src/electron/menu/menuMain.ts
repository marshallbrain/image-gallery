import {handleMenuItemClick} from "./menuActions";
import {isDev} from "@utils/utilities";

export default [
    {
        label: "File",
        submenu: [
            {
                label: "Import",
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
    },
    {
        label: "View",
        submenu: [
            {
                role: "reload",
                label: "Reload",
                visible: isDev
            },
            {
                role: "forcereload",
                label: "Force Reload",
                visible: isDev
            },
            {
                role: "toggledevtools",
                label: "Toggle Developer Tools",
                visible: isDev
            },
            {
                type: "separator"
            },
            {
                role: "resetzoom",
                label: "Reset Zoom"
            },
            {
                role: "zoomin",
                label: "Zoom In"
            },
            {
                role: "zoomout",
                label: "Zoom Out"
            },
            {
                type: "separator"
            },
            {
                role: "togglefullscreen",
                label: "Toggle Fullscreen"
            }
        ]
    },
]
