import {ipcMain} from "electron";
import _ from "lodash";
import {db} from "@electron/database/database";
import {SearchPropsType} from "../../react/pages/App";
import {toAny} from "../../react/utilities";
import channels from "@utils/channels";

export default () => {
    ipcMain.on(channels.sql.search, (
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
            insert,
            join(genericQuery),
            tagQuery.length > 2 && "intersect",
            tagQuery.length > 2 && join(tagQuery),
            collectionQuery.length > 2 && "intersect",
            collectionQuery.length > 2 && join(collectionQuery),
            orderByTitle
        ])

        const searchTransaction = db.transaction(() => {
            db.prepare("delete from temp.search").run()
            db.prepare(query).run(param)
            return db.prepare("select image_id, title, extension from temp.search").all()
        })

        event.reply(channel, searchTransaction())
    })
}

const getGenericQuery = (query: toAny<SearchPropsType>["generic"]) => ({
    genericQuery: [
        header,
        imageHeader,
        ...suffix([
            query.title && titleSlice,
            query.author && authorSlice,
            query.bookmark && bookmarkSlice
        ])

    ],
    genericParam: {
        title: query.title,
        author: query.author
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
                query.excTags.map((
                    (value: any, index: any) => `@excTags${index}`
                )).join(","))
        ])
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
        ])
    ],
    collectionParam: {
        incColsLen: query.incCols?.length,
        ...query.incCols?.reduce((p: any, v: any, i: any) => ({...p, [`incCols${i}`]: v}), {}),
        ...query.excCols?.reduce((p: any, v: any, i: any) => ({...p, [`excCols${i}`]: v}), {})
    }
})

//---------------

const insert = "insert into temp.search " +
    "(image_id, title, extension)"

const header = "select " +
    "i.image_id, i.title, i.extension"

//---------------

const orderByTitle = "" +
    "order by i.title"

//---------------

const imageHeader = "" +
    "from images i"

const titleSlice = "" +
    "where title like '%' || @title || '%'"

const authorSlice = "" +
    "where author like '%' || @author || '%'"

const bookmarkSlice = "" +
    "where bookmark = 1"

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
    "left join images_collections it on i.image_id = it.image_id " +
    "group by i.image_id " +
    "having"

const incColsSlice = "" +
    "sum(it.collection_id in ($collections)) >= @incColsLen"

const excColsSlice = "" +
    "sum(it.collection_id in ($collections)) = 0"

const colLessSlice = "" +
    "it.collection_id is null"

//---------------

function join<T>(array: T[], sep = " ") {
    return _.compact(array).join(sep)
}

function suffix(array: (string | undefined | false)[], s: string = " and") {
    return _.compact(array).map((value, index, pact) =>
        value + ((index < pact.length - 1) ? s : ""))
}
