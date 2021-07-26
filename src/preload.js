const {contextBridge, ipcRenderer} = require("electron");

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("api", {
    send: (channel, ...data) => {
        if ([].includes(channel)) {
            ipcRenderer.send(channel, data);
        } else {
            ipcRenderer.send("invalid channel electron", `Invalid send channel: "${channel}"`);
        }
    },
    receive: (channel, func) => {
        if ([].includes(channel)) {
            ipcRenderer.on(channel, (event, ...args) => func(...args));
        } else {
            ipcRenderer.send("invalid channel electron", `Invalid receive channel: "${channel}"`);
        }
    },
    removeAll: (channel) => {
        if ([].includes(channel)) {
            ipcRenderer.removeAllListeners(channel)
        } else {
            ipcRenderer.send("invalid channel electron", `Invalid receive channel: "${channel}"`);
        }
    }
});
