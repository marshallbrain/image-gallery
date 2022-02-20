import {isDev} from "@utils/utilities";

export default {
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
            role: "togglefullscreen",
            label: "Toggle Fullscreen"
        }
    ]
}
