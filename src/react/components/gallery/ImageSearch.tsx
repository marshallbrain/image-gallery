import React, {useEffect, useState} from 'react';
import {IconButton, Stack, TextField} from "@mui/material";
import {Search} from "@components/gallery/ImageGallery";
import Settings from '@mui/icons-material/Settings';
import TagSelector, {Tag} from "../../image_viewer/components/TagSelector";
import sqlQueries from "@utils/sqlQueries";

function ImageSearch(props: PropTypes) {

    const {updateSearch} = props

    const [title, setTitle] = useState("")
    const [tags, setTags] = useState<Tag[]>([])
    const [includeTags, setIncludeTags] = useState<Tag[]>([])

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
                tags={tags}
                selectedTags={includeTags}
                onChange={setIncludeTags}
                sx={{
                    width: 256,
                }}
            />
            <IconButton size="large">
                <Settings fontSize="inherit"/>
            </IconButton>
        </Stack>
    );
}

interface PropTypes {
    updateSearch: (value: Search) => void
}

export default ImageSearch;
