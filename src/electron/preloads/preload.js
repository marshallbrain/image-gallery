require("@babel/register");

const {contextBridge, ipcRenderer} = require("electron");
const {savedStorePreload} = require("./preloadSavedStore");
const {systemPreload} = require("./preloadSystem");
const {databasePreload} = require("./preloadDatabase");

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("api", {
    savedStore: savedStorePreload(ipcRenderer),
    system: systemPreload(ipcRenderer),
    db: databasePreload(ipcRenderer),
    channel: {
        trigger: (channel, callback) => {
            const listener = (event, response) => callback(response)
            ipcRenderer.on(channel, listener)
            return listener
        },
        send(channel, args) {
            ipcRenderer.send(channel, args);
        },
        remove: (channel, listener) => {
            ipcRenderer.removeListener(channel, listener)
        },
    },
});
