import React, {useContext, useEffect, useState} from 'react';
import {SearchPropTemp} from "@components/gallery/advancedSearch/AdvancedSearch";
import {FormControlLabel, FormGroup, Switch} from "@mui/material";
import TagSelector from "../../../image_viewer/components/TagSelector";
import {Col, SearchPropsType, Tag} from "@components/App";
import {toAny} from "@components/utilities";

const CollectionFilters = (props: PropTypes) => {

    const {
        cols,
    } = props

    const {searchProp, setSearchProp} = useContext(SearchPropTemp)

    const [incCols, setIncCols] = useState(searchProp.collection?.incCols)
    const [excCols, setExcCols] = useState(searchProp.collection?.excCols)
    const [colLess, setColLess] = useState(searchProp.collection?.colLess)

    useEffect(() => {
        console.log(incCols)
        setSearchProp({
            collection: {
                incCols,
                excCols,
                colLess
            }
        })
    }, [incCols, excCols, colLess])

    const toggleTagLess = (event: React.ChangeEvent<HTMLInputElement>) => {
        setColLess(event.target.checked);
    }

    return (
        <React.Fragment>
            <FormGroup>
                <FormControlLabel
                    control={<Switch
                        checked={colLess}
                        onChange={toggleTagLess}
                    />}
                    label="Show images not in any collection" />
            </FormGroup>
            <TagSelector
                label={"Include collections"}
                chips={cols}
                selectedChips={incCols}
                excludeChips={excCols}
                onChange={setIncCols}
                disabled={colLess}
            />
            <TagSelector
                label={"Exclude collections"}
                chips={cols}
                selectedChips={excCols}
                excludeChips={incCols}
                onChange={setExcCols}
                disabled={colLess}
            />
        </React.Fragment>
    )
}

interface PropTypes {
    cols: Col[]
}

export interface CollectionSearchType {
    incTags?: number[]
    excTags?: number[]
    tagLess?: boolean
}

export const collectionSearchMap = (search: SearchPropsType["collection"]): toAny<SearchPropsType>["collection"] => ({
    incCols: search?.incCols?.map((value) => (value).collection_id),
    excCols: search?.excCols?.map((value) => (value).collection_id),
    colLess: search?.colLess
})

interface PropTypes {
}

export default CollectionFilters
