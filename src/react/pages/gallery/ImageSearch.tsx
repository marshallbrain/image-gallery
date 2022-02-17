import React, {useContext, useEffect, useState} from 'react/index';
import {IconButton, Stack, TextField} from "@mui/material";
import Settings from '@mui/icons-material/Settings';
import TagSelector, {ChipBase} from "../../image_viewer/components/TagSelector";
import sqlQueries from "@utils/sqlQueries";
import AdvancedSearch from "./advancedSearch/AdvancedSearch";
import {Col, SearchPropsState, Tag} from "../App";
import {orDefault, useGetQuery} from "@components/utilities";
import getQueries from "../../queries/getQueries";
import AsyncSelect from "@components/selectors/AsyncSelect";
import ControlSelector from "@components/selectors/ControlSelector";

function ImageSearch(props: PropTypes) {

    const {searchProp, setSearchProp} = useContext(SearchPropsState);

    const [asOpen, setASOpen] = useState(false)

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
            <ControlSelector
                values={searchProp.tag?.incTags}
                optionsQuery={getQueries.tag.getTags}
                onChange={setIncTags}
                sx={{
                    flexGrow: 1
                }}
            />
            <ControlSelector
                values={searchProp.collection?.incCols}
                optionsQuery={getQueries.collections.getCollections}
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
            />
        </Stack>
    );
}

interface PropTypes {
}

export default ImageSearch;
