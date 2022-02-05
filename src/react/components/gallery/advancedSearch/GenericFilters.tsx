import React, {useContext, useEffect, useRef, useState} from 'react';
import {TextField} from "@mui/material";
import {Search} from "@components/gallery/ImageGallery";
import {Tag} from "../../../image_viewer/components/TagSelector";
import {orDefault} from "@components/utilities";
import {SearchPropsCon} from "@components/App";

const AdvancedSearch = (props: PropTypes) => {

    const {
        titleInit,
        setSearch,
        updateRoot
    } = props

    const {searchProp, setSearchProp} = useContext(SearchPropsCon);

    const [title, setTitle] = useState("")

    const titleRef = useRef(title)

    useEffect(() => {
        setTitle(orDefault(searchProp.main.title, ""))
        return () => {
            console.log(titleRef.current)
            setSearchProp({
                ...searchProp,
                main: {
                    ...searchProp.main,
                    title: titleRef.current
                }
            })
        }
    }, [])

    useEffect(() => {
        titleRef.current = title

        updateRoot({title})
        setSearch({
            ...title && {title},
        })
    }, [title])

    const changeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value)
    }

    return (
        <React.Fragment>
            <TextField
                value={title}
                label="Search Title"
                variant="outlined"
                onChange={changeTitle}
                fullWidth
            />
        </React.Fragment>
    )
}

interface PropTypes {
    titleInit: string
    setSearch: (value: GenericSearchType) => void
    updateRoot: (root: {title?: string, tags?: Tag[]}) => void
}

export interface GenericSearchType {
    title?: string
}

export default AdvancedSearch
