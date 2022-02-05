import React, {useContext, useEffect, useRef, useState} from 'react';
import TagSelector, {ChipBase} from "../../../image_viewer/components/TagSelector";
import {Search} from "@components/gallery/ImageGallery";
import {SearchPropsState, SearchPropsType, Tag} from "@components/App";
import {orDefault} from "@components/utilities";
import {SearchPropsOpp, SearchPropTemp} from "@components/gallery/advancedSearch/AdvancedSearch";

const AdvancedSearch = (props: PropTypes) => {

    const {
        tags,
    } = props

    const {searchProp, setSearchProp } = useContext(SearchPropTemp)

    const [incTags, setIncTags] = useState(searchProp.tag?.incTags)
    const [excTags, setExcTags] = useState(searchProp.tag?.excTags)

    useEffect(() => {
        setSearchProp({
            tag: {
                incTags,
                excTags,
            }
        })
    }, [incTags, excTags])

    return (
        <React.Fragment>
            <TagSelector
                label={"Include Tags"}
                chips={tags}
                selectedChips={incTags}
                excludeChips={excTags}
                onChange={setIncTags}
            />
            <TagSelector
                label={"Exclude Tags"}
                chips={tags}
                selectedChips={excTags}
                excludeChips={incTags}
                onChange={setExcTags}
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
}

export default AdvancedSearch
