import {ipcMain} from "electron";
import {sqlSearchChannel} from "@utils/ipcCommands";
import {Search} from "@components/gallery/ImageGallery";
import _ from "lodash";
import {db} from "@electron/database/database";

export default () => {
    ipcMain.on(sqlSearchChannel, (
        event,
        {channel, searchQuery}: {channel: string, searchQuery: Search}
    ) => {
        const imageQuery = [
            header,
            imageHeader,
            searchQuery.title && titleSlice
        ]

        const param = {
            title: searchQuery.title
        }

        const query = _.join(imageQuery, " ")
        event.reply(channel, db.prepare(query).all(param))
    })
}

const header = "select " +
    "i.image_id, i.title, i.extension"

const imageHeader = "" +
    "from images i"

const titleSlice = "" +
    "where i.title like '%' || $title || '%'"
