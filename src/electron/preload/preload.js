require("@babel/register");
const fs = require("fs");
const {contextBridge, ipcRenderer} = require("electron");
const {ipcChannels} = require("../../utils/ipcCommands");
const preloadBindings = require("./preloadSavedStore");

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("api", {
    savedStore: preloadBindings(ipcRenderer, fs),
    send: (channel, ...data) => {
        if (ipcChannels.has(channel)) {
            ipcRenderer.send(channel, data);
        } else {
            ipcRenderer.send("invalid channel electron", `Invalid send channel: "${channel}"`);
        }
    },
    receive: (channel, func) => {
        if (ipcChannels.has(channel)) {
            ipcRenderer.on(channel, (event, ...args) => func(...args));
        } else {
            ipcRenderer.send("invalid channel electron", `Invalid receive channel: "${channel}"`);
        }
    },
    removeAll: (channel) => {
        if (ipcChannels.has(channel)) {
            ipcRenderer.removeAllListeners(channel)
        } else {
            ipcRenderer.send("invalid channel electron", `Invalid receive channel: "${channel}"`);
        }
    }
});
