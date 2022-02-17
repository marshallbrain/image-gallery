import React, {useContext, useEffect, useState} from 'react/index';
import {SearchPropTemp} from "./AdvancedSearch";
import {FormControlLabel, FormGroup, Switch} from "@mui/material";
import TagSelector from "../../../image_viewer/components/TagSelector";
import {Col, SearchPropsType, Tag} from "../../App";
import {toAny} from "../../../utilities";
import ControlSelector from "@components/selectors/ControlSelector";
import getQueries from "../../../queries/getQueries";

const CollectionFilters = (props: PropTypes) => {

    const {} = props

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
            <ControlSelector
                values={incCols}
                exclude={excCols}
                optionsQuery={getQueries.collections.getCollections}
                onChange={setIncCols}
                disabled={colLess}
                sx={{
                    flexGrow: 1
                }}
            />
            <ControlSelector
                values={excCols}
                exclude={incCols}
                optionsQuery={getQueries.collections.getCollections}
                onChange={setExcCols}
                disabled={colLess}
                sx={{
                    flexGrow: 1
                }}
            />
{/*            <TagSelector
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
            />*/}
        </React.Fragment>
    )
}

interface PropTypes {
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
