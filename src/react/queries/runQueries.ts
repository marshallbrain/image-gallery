import {tagRunQueries} from "./subQueries/tagQueries";
import {collectionRunQueries} from "./subQueries/collectionQueries";
import {imageRunQueries} from "./subQueries/imageQueries";

const set = {
    tag: tagRunQueries,
    collections: collectionRunQueries,
    image: imageRunQueries,
}

export interface RunQuery {
    query: string
}

export default set
