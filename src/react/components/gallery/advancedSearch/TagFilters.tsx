import React, {useContext, useEffect, useRef, useState} from 'react';
import TagSelector, {ChipBase} from "../../../image_viewer/components/TagSelector";
import {Search} from "@components/gallery/ImageGallery";
import {SearchPropsState, SearchPropsType, Tag} from "@components/App";
import {orDefault} from "@components/utilities";
import {SearchPropsOpp, SearchPropTemp} from "@components/gallery/advancedSearch/AdvancedSearch";
import {FormControlLabel, FormGroup, Switch} from "@mui/material";

const AdvancedSearch = (props: PropTypes) => {

    const {
        tags,
    } = props

    const {searchProp, setSearchProp } = useContext(SearchPropTemp)

    const [incTags, setIncTags] = useState(searchProp.tag?.incTags)
    const [excTags, setExcTags] = useState(searchProp.tag?.excTags)
    const [tagLess, setTagLess] = useState(searchProp.tag?.tagLess)

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
                    label="Show images with no tags" />
            </FormGroup>
            <TagSelector
                label={"Include Tags"}
                chips={tags}
                selectedChips={incTags}
                excludeChips={excTags}
                onChange={setIncTags}
                disabled={tagLess}
            />
            <TagSelector
                label={"Exclude Tags"}
                chips={tags}
                selectedChips={excTags}
                excludeChips={incTags}
                onChange={setExcTags}
                disabled={tagLess}
            />
        </React.Fragment>
    )
}

interface PropTypes {
    tags: Tag[]
}

export interface TagSearchType {
    incTags?: number[]
    excTags?: number[]
    tagLess?: boolean
}

export default AdvancedSearch
