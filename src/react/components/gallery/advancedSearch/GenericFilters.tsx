import React, {useEffect, useState} from 'react';
import {TextField} from "@mui/material";
import {Search} from "@components/gallery/ImageGallery";
import {Tag} from "../../../image_viewer/components/TagSelector";

const AdvancedSearch = (props: PropTypes) => {

    const {
        titleInit,
        setSearch,
        updateRoot
    } = props

    const [title, setTitle] = useState(titleInit)

    const changeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value)
    }

    useEffect(() => {

        updateRoot({title})
        setSearch({
            ...title && {title},
        })
    }, [title])

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
