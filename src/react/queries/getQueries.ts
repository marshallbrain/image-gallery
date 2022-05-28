import {tagGetQueries} from "./subQueries/tagQueries";
import {collectionGetQueries} from "./subQueries/collectionQueries";
import {imageGetQueries} from "./subQueries/imageQueries";

const get = {
    tag: tagGetQueries,
    collections: collectionGetQueries,
    image: imageGetQueries,
}

export interface GetQuery {
    query: string
    order?: string
    pluck?: boolean
}

export default get

