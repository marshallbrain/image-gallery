import React, {useContext, useEffect, useRef, useState} from 'react';
import TagSelector, {Tag} from "../../../image_viewer/components/TagSelector";
import {Search} from "@components/gallery/ImageGallery";
import {SearchPropsCon} from "@components/App";
import {orDefault} from "@components/utilities";

const AdvancedSearch = (props: PropTypes) => {

    const {
        tags,
        incTagsInit,
        setSearch,
        updateRoot,
    } = props

    const {searchProp, setSearchProp} = useContext(SearchPropsCon);

    const [incTags, setIncTags] = useState<Tag[]>([])

    const incTagsRef = useRef(incTags)

    useEffect(() => {
        setIncTags(orDefault(searchProp.main.incTags, []))
        return () => {
            console.log(incTagsRef.current)
            setSearchProp({
                ...searchProp,
                main: {
                    ...searchProp.main,
                    incTags: incTagsRef.current
                }
            })
        }
    }, [])

    useEffect(() => {
        incTagsRef.current = incTags

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
