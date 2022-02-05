import React, {useContext, useEffect, useRef, useState} from 'react';
import {TextField} from "@mui/material";
import {Search} from "@components/gallery/ImageGallery";
import {ChipBase} from "../../../image_viewer/components/TagSelector";
import {orDefault} from "@components/utilities";
import {SearchPropsState, SearchPropsType} from "@components/App";
import {SearchPropTemp} from "@components/gallery/advancedSearch/AdvancedSearch";

const AdvancedSearch = (props: PropTypes) => {

    const {searchProp, setSearchProp } = useContext(SearchPropTemp)

    const [title, setTitle] = useState(orDefault(searchProp.generic?.title, ""))

    useEffect(() => {
        setSearchProp({
            generic: {
                title
            }
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
}

export interface GenericSearchType {
    title?: string
}

export default AdvancedSearch
