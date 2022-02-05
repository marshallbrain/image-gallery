import React, {useEffect, useState} from 'react';
import TagSelector, {Tag} from "../../../image_viewer/components/TagSelector";
import {Search} from "@components/gallery/ImageGallery";

const AdvancedSearch = (props: PropTypes) => {

    const {
        tags,
        incTagsInit,
        setSearch,
        updateRoot,
    } = props

    const [incTags, setIncTags] = useState(incTagsInit)

    useEffect(() => {

        const incTagIDs: {tag_id: number}[] = incTags as unknown as {tag_id: number}[]
        updateRoot({tags: incTags})
        setSearch({
            ...incTagIDs.length && {incTags: incTagIDs.map((value) => value.tag_id)}
        })
    }, [incTags])

    return (
        <React.Fragment>
            <TagSelector
                label={"Include Tags"}
                tags={tags}
                selectedTags={incTags}
                onChange={setIncTags}
            />
        </React.Fragment>
    )
}

interface PropTypes {
    tags: Tag[]
    incTagsInit: Tag[]
    setSearch: (value: TagSearchType) => void
    updateRoot: (root: {title?: string, tags?: Tag[]}) => void
}

export interface TagSearchType {
    incTags?: number[]
}

export default AdvancedSearch
