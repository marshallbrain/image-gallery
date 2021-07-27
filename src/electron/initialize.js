import SavedStore from "../utils/savedStore";
import {app} from "electron";
import pathModule from "path";

export const savedStore = new SavedStore({
    path: pathModule.join(app.getAppPath(), "../dev-resources"),
    defaultData: {"test": "YES"},
    fileCache: false
})
