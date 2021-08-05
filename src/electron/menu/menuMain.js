import {isDev} from "../../utils/utilities";
import {Menu} from "electron";
import {handleMenuItemClick} from "./menuActions";

const MenuBuilder = function (window, appName) {
    
    // https://electronjs.org/docs/api/menu#main-process
    const menu = () => {
        return [
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
        ];
    };
    
    return {
        buildMenu: () => {
            const builtMenu = Menu.buildFromTemplate(menu());
            window.setMenu(builtMenu)
            
            return menu;
        }
    };
};

export default MenuBuilder
