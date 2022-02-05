import React, {useContext, useEffect, useRef, useState} from 'react';
import {TextField} from "@mui/material";
import {Search} from "@components/gallery/ImageGallery";
import {Tag} from "../../../image_viewer/components/TagSelector";
import {orDefault} from "@components/utilities";
import {SearchPropsState, SearchPropsType} from "@components/App";
import {SearchPropTemp} from "@components/gallery/advancedSearch/AdvancedSearch";

const AdvancedSearch = (props: PropTypes) => {

    const {
        setSearch,
        updateRoot
    } = props

    const {searchProp, setSearchProp } = useContext(SearchPropTemp)

    const [title, setTitle] = useState("")

    const titleRef = useRef(title)

    useEffect(() => {
        setTitle(orDefault(searchProp.main.title, ""))
        return () => {
            console.log(titleRef.current)
            setSearchProp({
                main: {
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
    setSearch: (value: GenericSearchType) => void
    updateRoot: (root: {title?: string, tags?: Tag[]}) => void
}

export interface GenericSearchType {
    title?: string
}

export default AdvancedSearch
