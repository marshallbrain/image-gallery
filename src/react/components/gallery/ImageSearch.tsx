import React, {useEffect, useState} from 'react';
import {IconButton, Stack, TextField} from "@mui/material";
import {Search} from "@components/gallery/ImageGallery";
import Settings from '@mui/icons-material/Settings';
import TagSelector, {Tag} from "../../image_viewer/components/TagSelector";
import sqlQueries from "@utils/sqlQueries";
import AdvancedSearch from "@components/gallery/AdvancedSearch";

function ImageSearch(props: PropTypes) {

    const {updateSearch} = props

    const [title, setTitle] = useState("")
    const [tags, setTags] = useState<Tag[]>([])
    const [incTags, setIncTags] = useState<Tag[]>([])
    const [asOpen, setASOpen] = useState(false)

    useEffect(() => {
        window.api.db.getImages(sqlQueries.getTags, (data: Tag[]) => {
            setTags(data)
        })
    }, [])

    useEffect(() => {
        const incTags: {tag_id: number}[] = includeTags as unknown as {tag_id: number}[]

        updateSearch({
            ...title && {title},
            ...includeTags.length > 0 && {incTags: incTags.map((value) => value.tag_id)}
        })
    }, [title, includeTags])

    const changeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value)
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
                value={title}
                label="Search Title"
                variant="outlined"
                onChange={changeTitle}
            />
            <TagSelector
                label={"Include Tags"}
                tags={tags}
                selectedTags={incTags}
                onChange={setIncTags}
                sx={{
                    width: 256,
                }}
            />
            <IconButton size="large" onClick={toggleAS} >
                <Settings fontSize="inherit"/>
            </IconButton>
            <AdvancedSearch open={asOpen} />
        </Stack>
    );
}

interface PropTypes {
    updateSearch: (value: Search) => void
}

export default ImageSearch;
