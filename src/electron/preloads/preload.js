require("@babel/register");

const fs = require("fs");
const {contextBridge, ipcRenderer} = require("electron");
const {savedStorePreload} = require("./preloadSavedStore");
const {systemPreload} = require("./preloadSystem");
const {databasePreload} = require("./preloadDatabase");
const {ipcChannels, logChannel} = require("../../utils/ipcCommands");

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("api", {
    savedStore: savedStorePreload(ipcRenderer),
    system: systemPreload(ipcRenderer),
    db: databasePreload(ipcRenderer),
    send: (channel, ...data) => {
        if (ipcChannels.has(channel)) {
            ipcRenderer.send(channel, data);
        } else {
            console.log(`Invalid send channel: "${channel}"`);
        }
    },
    receive: (channel, func) => {
        if (ipcChannels.has(channel)) {
            ipcRenderer.on(channel, (event, ...args) => func(...args));
        } else {
            console.log(logChannel, `Invalid receive channel: "${channel}"`);
        }
    },
    removeAll: (channel) => {
        if (ipcChannels.has(channel)) {
            ipcRenderer.removeAllListeners(channel)
        } else {
            console.log(logChannel, `Invalid remove channel: "${channel}"`);
        }
    }
});
