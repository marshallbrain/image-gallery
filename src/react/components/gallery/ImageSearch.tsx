import React, {useContext, useEffect, useState} from 'react';
import {IconButton, Stack, TextField} from "@mui/material";
import {Search} from "@components/gallery/ImageGallery";
import Settings from '@mui/icons-material/Settings';
import TagSelector, {ChipBase} from "../../image_viewer/components/TagSelector";
import sqlQueries from "@utils/sqlQueries";
import AdvancedSearch from "@components/gallery/advancedSearch/AdvancedSearch";
import {SearchPropsState, Tag} from "@components/App";
import {orDefault} from "@components/utilities";

function ImageSearch(props: PropTypes) {

    const {updateSearch} = props

    const {searchProp, setSearchProp} = useContext(SearchPropsState);

    const [tags, setTags] = useState<Tag[]>([])
    const [asOpen, setASOpen] = useState(false)

    useEffect(() => {
        window.api.db.getImages(sqlQueries.getTags, (data: Tag[]) => {
            setTags(data)
        })
    }, [])

    const setIncTags = (incTags: Tag[]|undefined) => {
        setSearchProp({
            ...searchProp,
            main: {
                ...searchProp.main,
                incTags
            }
        })
    }

    const setTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchProp({
            ...searchProp,
            main: {
                ...searchProp.main,
                title: event.target.value
            }
        })
    }

    const toggleAS = () => {
        setASOpen(!asOpen)
    }

    return (
        <Stack
            direction={"row"}
            spacing={2}
            sx={{
                p: 2,
            }}
        >
            <TextField
                value={orDefault(searchProp.main.title, "")}
                label="Search Title"
                variant="outlined"
                onChange={setTitle}
            />
            <TagSelector
                label={"Include Tags"}
                limitTags={1}
                chips={tags}
                selectedChips={orDefault(searchProp.main.incTags, [])}
                onChange={setIncTags}
                sx={{
                    width: 256,
                }}
            />
            <IconButton size="large" onClick={toggleAS} >
                <Settings fontSize="inherit"/>
            </IconButton>
            <AdvancedSearch
                open={asOpen}
                toggleAS={toggleAS}
                updateSearch={updateSearch}
                tags={tags}
            />
        </Stack>
    );
}

interface PropTypes {
    updateSearch: (value: Search) => void
}

export default ImageSearch;
