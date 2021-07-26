import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { app, protocol, BrowserWindow } from "electron"
import Protocol, {scheme} from "./protocol";
import path from 'path';
import fs from "fs"

const isDev = process.env.NODE_ENV === "development";
const selfHost = `http://localhost:${3000}`

const createWindow = async () => {
    
    if (!isDev) {
        // Needs to happen before creating/loading the browser window;
        // protocol is only used in prod
        protocol.registerBufferProtocol(scheme, Protocol); /* eng-disable PROTOCOL_HANDLER_JS_CHECK */
    }
    
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        title: "Application is currently initializing...",
        webPreferences: {
            devTools: true,
            nodeIntegration: false,
            nodeIntegrationInWorker: false,
            nodeIntegrationInSubFrames: false,
            contextIsolation: true,
            enableRemoteModule: false,
            preload: path.join(__dirname, "preload.js"),
            /* eng-disable PRELOAD_JS_CHECK */
            disableBlinkFeatures: "Auxclick"
        }
    });
    
    if (isDev) {
        mainWindow.loadURL(`${selfHost}/dist`).then();
    } else {
        mainWindow.loadURL(`${scheme}://rse/index.html`).then();
        console.log()
    }

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

app.whenReady().then(createWindow)

app.on("window-all-closed", () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
        app.quit()
    } else {
    }
});

app.on("activate", () => {
    if (win === null) {
        createWindow().then(r => {})
    }
});

app.on("web-contents-created", (event, contents) => {
    contents.on("will-navigate", (contentsEvent, navigationUrl) => {
        /* eng-disable LIMIT_NAVIGATION_JS_CHECK  */
        const parsedUrl = new URL(navigationUrl)
        const validOrigins = [selfHost]
    
        console.log(validOrigins)
        console.log(parsedUrl.origin)
        
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
        const validOrigins = []
        
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
    contents.on("will-attach-webview", (contentsEvent, webPreferences, params) => {
        // Strip away preload scripts if unused or verify their location is legitimate
        delete webPreferences.preload;
        delete webPreferences.preloadURL;
        
        // Disable Node.js integration
        webPreferences.nodeIntegration = false;
    })
    
    // https://electronjs.org/docs/tutorial/security#13-disable-or-limit-creation-of-new-windows
    // This code replaces the old "new-window" event handling;
    // https://github.com/electron/electron/pull/24517#issue-447670981
    contents.setWindowOpenHandler(({url}) => {
        const parsedUrl = new URL(url);
        const validOrigins = []
        
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
