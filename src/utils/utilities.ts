import pathModule from "path";
import {app} from "electron";
import fs from "fs";

const exception = ():string => {
    throw "Not Dev Environment"
}

export const isDev = process.env.NODE_ENV === "development";

export function appDataDir(...path: string[]): string {
    const fullPath = appData(...path)
    try {
        if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath, {recursive: true})
        }
    } catch (err) {
        console.error(err)
    }
    return fullPath
}

export function appData(...path: string[]): string {
    if (isDev) {
        return pathModule.join(app.getAppPath(), "../", "resources", ...path)
    } else {
        exception()
        return ""
    }
}

export interface AnyObject {
    [key: string]: any
}
