import {ipcMain} from "electron";
import {sqlSearchChannel} from "@utils/ipcCommands";
import _ from "lodash";
import {db} from "@electron/database/database";
import {SearchPropsType} from "@components/App";
import {toAny} from "@components/utilities";

export default () => {
    ipcMain.on(sqlSearchChannel, (
        event,
        {channel, args}
    ) => {
        const searchQuery = args as toAny<SearchPropsType>

        const {genericQuery, genericParam} = getGenericQuery(searchQuery["generic"])

        const {tagQuery, tagParam} = getTagQuery(searchQuery["tag"])

        const {collectionQuery, collectionParam} = getCollectionQuery(searchQuery["collection"])

        const param = {
            ...genericParam,
            ...tagParam,
            ...collectionParam
        }

        const query = join([
            join(genericQuery),
            tagQuery.length > 2 && "intersect",
            tagQuery.length > 2 && join(tagQuery),
            collectionQuery.length > 2 && "intersect",
            collectionQuery.length > 2 && join(collectionQuery),
            orderByTitle
        ])

        console.log(query)
        console.log(param)

        event.reply(channel, db.prepare(query).all(param))
    })
}

const getGenericQuery = (query: toAny<SearchPropsType>["generic"]) => ({
    genericQuery: [
            header,
            imageHeader,
            query.title && titleSlice
        ],
    genericParam: {
        title: query.title,
    }

})

const getTagQuery = (query: toAny<SearchPropsType>["tag"]) => ({
    tagQuery: [
        header,
        tagHeader,
        ...suffix([
            query.tagLess && tagLessSlice,
            !query.tagLess && query.incTags && incTagsSlice.replace(
                "$tags",
                query.incTags.map((
                    (value: any, index: any) => `@incTags${index}`
                )).join(",")),
            !query.tagLess && query.excTags && excTagsSlice.replace(
                "$tags",
                query.tag?.excTags.map((
                    (value: any, index: any) => `@excTags${index}`
                )).join(","))
        ], " and")
    ],
    tagParam: {
        incTagsLen: query.incTags?.length,
        ...query.incTags?.reduce((p: any, v: any, i: any) => ({...p, [`incTags${i}`]: v}), {}),
        ...query.excTags?.reduce((p: any, v: any, i: any) => ({...p, [`excTags${i}`]: v}), {})
    }
})

const getCollectionQuery = (query: toAny<SearchPropsType>["collection"]) => ({
    collectionQuery: [
        header,
        collectionHeader,
        ...suffix([
            query.colLess && colLessSlice,
            !query.colLess && query.incCols && incColsSlice.replace(
                "$collections",
                query.incCols.map((
                    (value: any, index: any) => `@incCols${index}`
                )).join(",")),
            !query.colLess && query.excCols && excColsSlice.replace(
                "$collections",
                query.excCols.map((
                    (value: any, index: any) => `@excCols${index}`
                )).join(","))
        ], " and")
    ],
    collectionParam: {
        incColsLen: query.incCols?.length,
        ...query.incCols?.reduce((p: any, v: any, i: any) => ({...p, [`incCols${i}`]: v}), {}),
        ...query.excCols?.reduce((p: any, v: any, i: any) => ({...p, [`excCols${i}`]: v}), {})
    }
})

const header = "select " +
    "i.image_id, i.title, i.extension"

const orderByTitle = "" +
    "order by i.title"

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

const tagLessSlice = "" +
    "it.tag_id is null"

//---------------

const collectionHeader = "" +
    "from images i " +
    "left join image_collection it on i.image_id = it.image_id " +
    "group by i.image_id " +
    "having"

const incColsSlice = "" +
    "sum(it.collection_id in ($collections)) >= @incColsLen"

const excColsSlice = "" +
    "sum(it.collection_id in ($collections)) = 0"

const colLessSlice = "" +
    "it.collection_id is null"

//---------------

function join<T>(array: T[], sep=" ") {
    return _.compact(array).join(sep)
}

function suffix(array: (string|undefined|false)[], s: string) {
    return _.compact(array).map((value, index, pact) =>
        value + ((index < pact.length-1)? s: ""))
}
