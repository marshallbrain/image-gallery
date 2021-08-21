import {app, protocol} from "electron";
import pathModule from "path";
import fs from "fs";
import sharp from "sharp";
import {db} from "@electron/database/database";

export default () => {
    protocol.registerFileProtocol('preview', (request, callback) => {
        const imageId = request.url.replace('preview://', "")
        const previewPath = pathModule.join(app.getAppPath(), `../dev-resources/images/temp/${imageId}.jpeg`)
        fs.access(previewPath, fs.constants.R_OK, (err) => {
            if (err) {
                const tempFiles = fs.readdirSync(pathModule.join(app.getAppPath(), "../dev-resources/images/temp/"))
                if (tempFiles.length >= 1000) {
                    let oldest = 0
                    let oldestFile = ""
                    tempFiles.forEach((file) => {
                        const accessed = fs.statSync(file).atimeMs
                        if (oldest > accessed) {
                            oldest = accessed
                            oldestFile = file
                        }
                    })
                    console.log(oldestFile)
                } else {
                    const ext = db.prepare("select extension from images where image_id = ?")
                        .get(imageId).extension
                    const imagePath = pathModule.join(app.getAppPath(), `../dev-resources/images/raw/${imageId}.${ext}`)
                    sharp(imagePath)
                        .resize(256, 256, {fit: sharp.fit.inside})
                        .toFormat("jpeg")
                        .jpeg({
                            quality: 80,
                            mozjpeg: true
                        })
                        .toFile(pathModule.join(app.getAppPath(), `../dev-resources/images/temp/${imageId}.jpeg`))
                        .then(() => {
                            callback(previewPath)
                        })
                }
            } else {
                callback(previewPath)
            }
        })
    });
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


