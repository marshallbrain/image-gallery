import {tagRunQueries} from "./tagQueries";
import {collectionRunQueries} from "./collectionQueries";

const set = {
    tag: tagRunQueries,
    collections: collectionRunQueries
}

export interface RunQuery {
    query: string
}

export default set
