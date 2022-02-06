import pathModule from "path";
import {app} from "electron";
import fs from "fs";

const exception = ():string => {
    throw "Not Dev Environment"
}

export const isDev = process.env.NODE_ENV === "development";

export function appData(...path: string[]): string {
    const fullPath = pathModule.join(app.getAppPath(), "../", "resources", ...path)
    const parsedPath = pathModule.parse(fullPath)

    if (parsedPath.ext != "" && !fs.existsSync(parsedPath.dir)) {
        fs.mkdirSync(parsedPath.dir, {recursive: true})
    } else if (parsedPath.ext == "" && !fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, {recursive: true})
    }

    if (isDev) {
        return fullPath
    } else {
        return fullPath
    }
}

