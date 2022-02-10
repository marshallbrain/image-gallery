import {tagGetQueries} from "./subQueries/tagQueries";
import {collectionGetQueries} from "./subQueries/collectionQueries";

const get = {
    tag: tagGetQueries,
    collections: collectionGetQueries
}

export interface GetQuery {
    query: string
    order: string
}

export default get

