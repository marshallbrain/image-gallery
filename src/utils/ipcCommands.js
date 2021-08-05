export const namespaceStore = "store-"
export const system = "system-"

export const openImportDialogChannel = "openImportDialog"
export const importImagesChannel = "importImages"

export const getEntry = `${namespaceStore}get-sync`
export const getEntryAsyncRequest = `${namespaceStore}get-req-`
export const getEntryAsyncResponse = `${namespaceStore}get-res-`
export const setEntry = `${namespaceStore}set-sync`
export const setEntryAsyncRequest = `${namespaceStore}set-req-`
export const setEntryAsyncResponse = `${namespaceStore}set-res-`
export const deleteEntry = `${namespaceStore}del-sync`
export const deleteEntryAsyncRequest = `${namespaceStore}del-req-`
export const deleteEntryAsyncResponse = `${namespaceStore}del-res-`

export const logChannel = `${system}log`
export const loggerSubscribeChannel = `${system}loggerSubscribe`

export const ipcChannels = new Set([
    openImportDialogChannel,
    importImagesChannel
])
