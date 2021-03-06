import React, {useContext, useEffect, useState} from 'react/index';
import {SearchPropsType} from "../../App";
import {toAny, useDefault} from "../../../utilities";
import {SearchPropTemp} from "./AdvancedSearch";
import {FormControlLabel, FormGroup, Switch} from "@mui/material";
import ControlSelector from "@components/selectors/ControlSelector";
import getQueries from "../../../queries/getQueries";

const AdvancedSearch = (props: PropTypes) => {

    const {} = props

    const {searchProp, setSearchProp} = useContext(SearchPropTemp)

    const [incTags, setIncTags] = useState(searchProp.tag?.incTags)
    const [excTags, setExcTags] = useState(searchProp.tag?.excTags)
    const [tagLess, setTagLess] = useState(useDefault(searchProp.tag?.tagLess, false))

    useEffect(() => {
        setSearchProp({
            tag: {
                incTags,
                excTags,
                tagLess
            }
        })
    }, [incTags, excTags, tagLess])

    const toggleTagLess = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTagLess(event.target.checked);
    }

    return (
        <React.Fragment>
            <FormGroup>
                <FormControlLabel
                    control={<Switch
                        checked={tagLess}
                        onChange={toggleTagLess}
                    />}
                    label="Show images with no tags"/>
            </FormGroup>
            <ControlSelector
                values={incTags}
                exclude={excTags}
                optionsQuery={getQueries.tag.getTags}
                onChange={setIncTags}
                disabled={tagLess}
                sx={{
                    flexGrow: 1
                }}
            />
            <ControlSelector
                values={excTags}
                exclude={incTags}
                optionsQuery={getQueries.tag.getTags}
                onChange={setExcTags}
                disabled={tagLess}
                sx={{
                    flexGrow: 1
                }}
            />
        </React.Fragment>
    )
}

interface PropTypes {
}

export interface TagSearchType {
    incTags?: number[]
    excTags?: number[]
    tagLess?: boolean
}

export const tagSearchMap = (search: SearchPropsType["tag"]): toAny<SearchPropsType>["tag"] => ({
    incTags: search?.incTags?.map((value) => (value).tag_id),
    excTags: search?.excTags?.map((value) => (value).tag_id),
    tagLess: search?.tagLess
})

export default AdvancedSearch
