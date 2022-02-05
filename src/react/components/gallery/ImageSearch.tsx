import React, {useContext, useEffect, useState} from 'react';
import {IconButton, Stack, TextField} from "@mui/material";
import Settings from '@mui/icons-material/Settings';
import TagSelector, {ChipBase} from "../../image_viewer/components/TagSelector";
import sqlQueries from "@utils/sqlQueries";
import AdvancedSearch from "@components/gallery/advancedSearch/AdvancedSearch";
import {Col, SearchPropsState, Tag} from "@components/App";
import {orDefault} from "@components/utilities";

function ImageSearch(props: PropTypes) {

    const {searchProp, setSearchProp} = useContext(SearchPropsState);

    const [tags, setTags] = useState<Tag[]>([])
    const [cols, setCols] = useState<Col[]>([])
    const [asOpen, setASOpen] = useState(false)

    useEffect(() => {
        window.api.db.getImages(sqlQueries.getTags, (data: Tag[]) => {
            setTags(data)
        })
        window.api.db.getImages(sqlQueries.getCollections, (data: Col[]) => {
            setCols(data)
        })
    }, [])

    const setTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchProp({
            ...searchProp,
            generic: {
                ...searchProp.generic,
                title: event.target.value
            }
        })
    }

    const setIncTags = (incTags: Tag[]|undefined) => {
        setSearchProp({
            ...searchProp,
            tag: {
                ...searchProp.tag,
                incTags
            }
        })
    }

    const setIncCols = (incCols: Col[]|undefined) => {
        setSearchProp({
            ...searchProp,
            collection: {
                ...searchProp.collection,
                incCols
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
                value={orDefault(searchProp.generic?.title, "")}
                label="Search Title"
                variant="outlined"
                onChange={setTitle}
                sx={{
                    width: 256
                }}
            />
            <TagSelector
                label={"Include Tags"}
                chips={tags}
                selectedChips={searchProp.tag?.incTags}
                excludeChips={searchProp.tag?.excTags}
                onChange={setIncTags}
                sx={{
                    flexGrow: 1
                }}
            />
            <TagSelector
                label={"Include Collections"}
                chips={cols}
                selectedChips={searchProp.collection?.incCols}
                excludeChips={searchProp.collection?.excCols}
                onChange={setIncCols}
                sx={{
                    flexGrow: 1
                }}
            />
            <IconButton size="large" onClick={toggleAS} >
                <Settings fontSize="inherit"/>
            </IconButton>
            <AdvancedSearch
                open={asOpen}
                toggleAS={toggleAS}
                tags={tags}
                cols={cols}
            />
        </Stack>
    );
}

interface PropTypes {
}

export default ImageSearch;
