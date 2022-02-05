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

    const [incTags, setIncTags] = useState(searchProp.main.incTags)

    useEffect(() => {
        setSearchProp({
            main: {
                incTags
            }
        })
    }, [incTags])

    return (
        <React.Fragment>
            <TagSelector
                label={"Include Tags"}
                chips={tags}
                selectedChips={incTags}
                onChange={setIncTags}
            />
        </React.Fragment>
    )
}

interface PropTypes {
    tags: Tag[]
}

export interface TagSearchType {
    incTags?: number[]
}

export default AdvancedSearch
