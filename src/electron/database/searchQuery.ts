import {ipcMain} from "electron";
import {sqlSearchChannel} from "@utils/ipcCommands";
import {Search} from "@components/gallery/ImageGallery";
import _ from "lodash";
import {db} from "@electron/database/database";

export default () => {
    ipcMain.on(sqlSearchChannel, (
        event,
        {channel, args}
    ) => {
        const searchQuery = args as Search

        const imageQuery = [
            header,
            imageHeader,
            searchQuery.title && titleSlice
        ]

        const tagQuery = [
            header,
            tagHeader,
            ...suffix([searchQuery.incTags && incTagsSlice.replace(
                "$tags",
                searchQuery.incTags.map((
                    (value, index) => `@incTags${index}`
                )).join(",")),
            searchQuery.excTags && excTagsSlice.replace(
                "$tags",
                searchQuery.excTags.map((
                    (value, index) => `@excTags${index}`
                )).join(","))], " and")
        ]

        const param = {
            title: searchQuery.title,
            incTagsLen: searchQuery.incTags?.length,
            ...searchQuery.incTags?.reduce((p, v, i) => ({...p, [`incTags${i}`]: v}), {}),
            ...searchQuery.excTags?.reduce((p, v, i) => ({...p, [`excTags${i}`]: v}), {})
        }

        const query = join([
            join(imageQuery),
            tagQuery.length > 2 && "intersect",
            tagQuery.length > 2 && join(tagQuery)
        ])

        event.reply(channel, db.prepare(query).all(param))
    })
}

const header = "select " +
    "i.image_id, i.title, i.extension"

//---------------

const imageHeader = "" +
    "from images i"

const titleSlice = "" +
    "where title like '%' || @title || '%'"

//---------------

const tagHeader = "" +
    "from images i " +
    "left join images_tags it on i.image_id = it.image_id " +
    "group by i.image_id " +
    "having"

const incTagsSlice = "" +
    "sum(it.tag_id in ($tags)) >= @incTagsLen"

const excTagsSlice = "" +
    "sum(it.tag_id in ($tags)) = 0"

const nulTagsSlice = "" +
    "it.tag_id is null"

function join<T>(array: T[], sep=" ") {
    return _.compact(array).join(sep)
}

function suffix(array: (string|undefined)[], s: string) {
    return _.compact(array).map((value, index) =>
        value + ((index < array.length-1)? s: ""))
}
