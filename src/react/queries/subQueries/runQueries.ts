import {tagRunQueries} from "./tagQueries";
import {collectionRunQueries} from "./collectionQueries";
import {imageRunQueries} from "./imageQueries";

const set = {
    tag: tagRunQueries,
    collections: collectionRunQueries,
    image: imageRunQueries,
}

export interface RunQuery {
    query: string
}

export default set
