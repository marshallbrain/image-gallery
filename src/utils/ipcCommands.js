export const namespaceStore = "store-"
export const namespaceSql = "sql-"
export const system = "system-"

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
export const logFeedChannel = `${system}logFeed`

export const sqlSelectChannel = `${namespaceSql}select`

export const channels = {
    openImportDialog: "openImportDialog",
    importImages: "importImages",
    importImagesComplete: "importImagesComplete",
    openReimportDialog: "openReimportDialog",
    reimportImages: "reimportImages",
    reimportImagesComplete: "reimportImagesComplete"
}

export const ipcChannels = new Set(Object.values(channels))