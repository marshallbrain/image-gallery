import {dialog, IpcMainEvent} from "electron";
import {db} from "@electron/database/database";
import fs from "fs";
import {appData} from "@utils/utilities";
import pathModule from "path";
import channels from "@utils/channels";

export default (selected: Set<number>, title: string, event: IpcMainEvent) => {
    const location = dialog.showOpenDialogSync({
        buttonLabel: "Select",
        message: "Select export folder",
        properties: [
            "openDirectory",
            "createDirectory",
            "treatPackageAsDirectory"
        ]
    })

    if (!location) return
    const folder = location[0]

    const statement = db.prepare(`select image_id, extension, ${title} from images where image_id = ?`)

    const imagesLeft = new Set(selected)
    for (const id of selected) {
        new Promise((resolve, reject) => {

            const image = db.transaction(() => {
                return statement.get(id)
            })() as { image_id: number, extension: string, [p: string]: any }

            const filename =
                image[title] +
                ((title != "image_id")? `.${image.image_id}`: "") +
                `.${image.extension}`

            fs.copyFile(
                appData("images", "raw", `${image.image_id}.${image.extension}`),
                pathModule.join(folder, filename.replace(/[/\\?%*:|"<>]/g, '_')),
                (error) => {
                    if (error) {
                        reject (filename)
                    } else {
                        resolve(filename)
                    }
                }
            )

        }).then((filename) => {
            imagesLeft.delete(id)
            event.reply(
                channels.update.progress,
                (selected.size - imagesLeft.size) / selected.size,
                filename
            )
        }).finally(() => {
            if (imagesLeft.size == 0) {
                event.reply(channels.update.finishProgress)
            }
        })
    }
}
