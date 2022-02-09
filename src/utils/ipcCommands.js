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
export const sqlSearchChannel = `${namespaceSql}search`
export const sqlQueryChannel = `${namespaceSql}query`

export const channels = {
    openImportDialog: "openImportDialog",
    importImages: "importImages",
    
    openReimportDialog: "openReimportDialog",
    reimportImages: "reimportImages",
    
    imageImported: "imageImported",
    imageImportComplete: "imageImportComplete",
    
    reimportImagesComplete: "reimportImagesComplete",
    openImageViewer: "openImageViewer",
    onImageViewerOpen: "onImageViewerOpen",
    updateImageViewerList: "updateImageViewerList",
    updateTagLists: "updateTags",
    
    getFolder: "getFolder",
    exportImages: "exportImages",
    
    imageExported: "imageExported",
    imageExportComplete: "imageExportComplete",
    
    setWindowTitle: "setWindowTitle"
    
}

export const ipcChannels = new Set(Object.values(channels))
