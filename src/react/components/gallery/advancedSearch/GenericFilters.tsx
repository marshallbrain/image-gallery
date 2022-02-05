import React, {useEffect, useState} from 'react';
import {TextField} from "@mui/material";
import {Search} from "@components/gallery/ImageGallery";

const AdvancedSearch = (props: PropTypes) => {

    const {
        titleInit,
        setSearch
    } = props

    const [title, setTitle] = useState(titleInit)

    const changeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value)
    }

    useEffect(() => {

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
}

export interface GenericSearchType {
    title?: string
}

export default AdvancedSearch
