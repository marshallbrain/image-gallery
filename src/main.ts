import 'regenerator-runtime/runtime';
import {app, protocol, BrowserWindow, ipcMain, Menu} from "electron"
import Protocol, {scheme} from "./protocol";
import path from 'path';
import initialize from "./electron/initialize";
import savedStore from "./utils/savedStore";
import installExtension, {REACT_DEVELOPER_TOOLS} from "electron-devtools-installer"
import registerFileProtocols from "@electron/registerFileProtocols";

const isDev = process.env.NODE_ENV === "development";
const selfHost = `http://localhost:${3000}`

export type WindowSetupFunction = (htmlFile: string, menuBuilder: any, x?: number, y?: number, openDevTools?: boolean) => Promise<Electron.BrowserWindow>
const windowSetup = async (
    htmlFile: string,
    menu: any[] ,
    x = 1400,
    y = 800,
    openDevTools = true
) => {

    if (!isDev) {
        // Needs to happen before creating/loading the browser window;
        // protocol is only used in prod
        protocol.registerBufferProtocol(scheme, Protocol); /* eng-disable PROTOCOL_HANDLER_JS_CHECK */
    }

    const createdWindow = new BrowserWindow({
        width: x,
        height: y,
        title: "Application is currently initializing...",
        webPreferences: {
            devTools: isDev,
            nodeIntegration: false,
            nodeIntegrationInWorker: false,
            nodeIntegrationInSubFrames: false,
            contextIsolation: true,
            preload: path.join(__dirname, "electron/preloads/preload.js"),
            /* eng-disable PRELOAD_JS_CHECK */
            disableBlinkFeatures: "Auxclick"
        }
    });

    const buildMenu = () => {
        const builtMenu = Menu.buildFromTemplate(menu);
        createdWindow.setMenu(builtMenu)
    }

    savedStore.mainBinding(ipcMain)
    buildMenu()

    if (isDev) {
        createdWindow.loadURL(`${selfHost}/dist/${htmlFile}`).then();
    } else {
        createdWindow.loadURL(`${scheme}://rse/${htmlFile}`).then();
    }

    if (isDev) {

        process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

        // Errors are thrown if the dev tools are opened
        // before the DOM is ready
        createdWindow.webContents.once("dom-ready", async () => {
            await installExtension(REACT_DEVELOPER_TOOLS)
                .then((name) => console.log(`Added Extension: ${name}`))
                .catch((err) => console.log("An error occurred: ", err))
                .finally(() => {
                    require("electron-debug")(); // https://github.com/sindresorhus/electron-debug
                    openDevTools && createdWindow.webContents.openDevTools();
                });
        });
    }

    return createdWindow

}

// Needs to be called before app is ready;
// gives our scheme access to load relative files,
// as well as local storage, cookies, etc.
// https://electronjs.org/docs/api/protocol#protocolregisterschemesasprivilegedcustomschemes
protocol.registerSchemesAsPrivileged([{
    scheme: scheme,
    privileges: {
        standard: true,
        secure: true
    }
}]);

app.whenReady().then(() => {
    initialize(windowSetup)
    registerFileProtocols()
})

app.on("window-all-closed", () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
        app.quit()
    } else {
    }
});

// app.on("activate", () => {
//     if (win === null) {
//         windowSetup().then(r => {})
//     }
// });

app.on("web-contents-created", (_, contents) => {
    contents.on("will-navigate", (contentsEvent, navigationUrl) => {
        /* eng-disable LIMIT_NAVIGATION_JS_CHECK  */
        const parsedUrl = new URL(navigationUrl)
        const validOrigins = [selfHost]

        // Log and prevent the app from navigating to a new page if that page's origin is not whitelisted
        if (!validOrigins.includes(parsedUrl.origin)) {
            //TODO add to custom logger
            console.error(
                `The application tried to navigate to the following address: '${parsedUrl}'. This origin is not whitelisted and the attempt to navigate was blocked.`
            );

            contentsEvent.preventDefault()
        }
    })

    contents.on("will-redirect", (contentsEvent, navigationUrl) => {
        const parsedUrl = new URL(navigationUrl)
        const validOrigins: string[] = []

        // Log and prevent the app from redirecting to a new page
        if (!validOrigins.includes(parsedUrl.origin)) {
            //TODO add to custom logger
            console.error(
                `The application tried to redirect to the following address: '${navigationUrl}'. This attempt was blocked.`
            )

            contentsEvent.preventDefault()
        }
    })

    // https://electronjs.org/docs/tutorial/security#11-verify-webview-options-before-creation
    contents.on("will-attach-webview", (_event, webPreferences, _params) => {
        // Strip away preload scripts if unused or verify their location is legitimate
        delete webPreferences.preload;
        // @ts-ignore
        delete webPreferences.preloadURL;

        // Disable Node.js integration
        webPreferences.nodeIntegration = false;
    })

    // https://electronjs.org/docs/tutorial/security#13-disable-or-limit-creation-of-new-windows
    // This code replaces the old "new-window" event handling;
    // https://github.com/electron/electron/pull/24517#issue-447670981
    contents.setWindowOpenHandler(({url}) => {
        const parsedUrl = new URL(url);
        const validOrigins: string[] = []

        // Log and prevent opening up a new window
        if (!validOrigins.includes(parsedUrl.origin)) {
            console.error(
                `The application tried to open a new window at the following address: '${url}'. This attempt was blocked.`
            )

            return {
                action: "deny"
            }
        }

        return {
            action: "allow"
        }
    });
});
