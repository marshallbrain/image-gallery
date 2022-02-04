import React, {useEffect, useState} from 'react';
import {TextField} from "@mui/material";
import {Search} from "@components/gallery/ImageGallery";

function ImageSearch(props: PropTypes) {

    const {updateSearch} = props

    const [title, setTitle] = useState("")

    useEffect(() => {
        updateSearch({
            ...title && {title}
        })
    }, [title])

    const changeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value)
    }

    return (
        <TextField
            value={title}
            label="Search Title"
            variant="outlined"
            sx={{margin: 2}}
            onChange={changeTitle}
        />
    );
}

interface PropTypes {
    updateSearch: (value: Search) => void
}

export default ImageSearch;
