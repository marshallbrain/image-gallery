import {tagGetQueries} from "./subQueries/tagQueries";

const get = {
    tag: tagGetQueries
}

export interface GetQuery {
    query: string
    order: string
}

export default get

