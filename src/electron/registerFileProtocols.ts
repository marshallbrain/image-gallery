import {app, protocol} from "electron";
import pathModule from "path";
import fs from "fs";
import sharp from "sharp";
import {db} from "@electron/database/database";
import {appData, appDataDir} from "@utils/utilities";

export default () => {
    protocol.registerFileProtocol('preview', (request, callback) => {
        const imageId = request.url.replace('preview://', "")
        const previewPath = appData("images", "prev", imageId + ".jpeg")
        callback(previewPath)
    })
    protocol.registerFileProtocol('image', (request, callback) => {
        const image = request.url.replace('image://', "")
        const path = appData("images", "raw", image)
        callback(path)
    })
}

// fs.stat("", (_err, stats) => {
//     stats.atimeMs //time the file was lass accessed
// })

// sharp(pathModule.join(app.getAppPath(), "../dev-resources/Medivh_full.jpg"))
//     .resize({height: 192})
//     .jpeg({
//         quality: 50,
//         mozjpeg: true
//     })
//     .toFile(pathModule.join(app.getAppPath(), "../dev-resources/thumbnail.jpg")).then()


