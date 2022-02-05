import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, Divider, TextField,
    ToggleButton,
    ToggleButtonGroup, Typography
} from '@mui/material';
import React, {useContext, useEffect, useState} from 'react';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CollectionsIcon from '@mui/icons-material/Collections';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import TagSelector, {Tag} from "../../../image_viewer/components/TagSelector";
import GenericFilters, {GenericSearchType} from "@components/gallery/advancedSearch/GenericFilters";
import TagFilters, {TagSearchType} from "@components/gallery/advancedSearch/TagFilters";
import {Search} from "@components/gallery/ImageGallery";
import {SearchPropsState, SearchPropsType} from "@components/App";
import {orDefault} from "@components/utilities";

const AdvancedSearch = (props: PropTypes) => {

    const {
        open,
        toggleAS,
        updateSearch,
        tags,
    } = props

    const {searchProp, setSearchProp} = useContext(SearchPropsState);

    const [group, setGroup] = useState("Generic")
    const [searchPropTemp, setSearchPropTemp] = useState(searchProp)

    useEffect(() => {
        compileSearch()
    }, [])

    useEffect(() => {
        compileSearch()
    }, [searchProp])

    const compileSearch = () => {
        const incTags: any = (orDefault(searchProp.main.incTags, []).length > 0)?
                searchProp.main.incTags: undefined

        updateSearch({
            title: searchProp.main.title,
            ...incTags && {incTags: incTags.map((value: {tag_id: number}) => (value).tag_id)}
        })
    }

    const updateSearchPropT = (value: Partial<SearchPropsType>) => {
        setSearchPropTemp({
            ...searchPropTemp,
            main: {
                ...searchPropTemp.main,
                title: value.main?.title,
                incTags: value.main?.incTags,
            },
            generic: {
            },
            tag: {
            },
        })
    }

    const changeGroup = (
        event: React.MouseEvent<HTMLElement>,
        newGroup: string | null,
    ) => {
        if (newGroup !== null) {
            setGroup(newGroup)
        }
    }

    const onSearch = () => {
        setSearchProp(searchPropTemp)
        toggleAS()
    }


    return (
        <Dialog
            open={open}
            fullWidth
            maxWidth={"sm"}
        >
            <DialogTitle>
                Advanced Search Options
            </DialogTitle>
            <DialogContent
                sx={{
                    display: "flex",
                    flexDirection: "column"
                }}
            >
                <ToggleButtonGroup
                    exclusive
                    value={group}
                    onChange={changeGroup}
                    sx={{
                        alignSelf: "center",
                        mb: 2
                    }}
                >
                    <ToggleButton value="Generic">
                        <FilterAltIcon fontSize={"large"} />
                    </ToggleButton>
                    <ToggleButton value="Tag">
                        <LocalOfferIcon fontSize={"large"} />
                    </ToggleButton>
                    <ToggleButton value="Collection">
                        <CollectionsIcon fontSize={"large"} />
                    </ToggleButton>
                </ToggleButtonGroup>
                <Typography variant="h5" gutterBottom >
                    {group} Filters
                </Typography>
                <Divider/>

                <SearchPropTemp.Provider value={{
                    searchProp: searchPropTemp,
                    setSearchProp: updateSearchPropT
                }}>
                    <Box sx={{maxHeight: 400, overflow: "auto", p: 2}}>
                        {group === "Generic" && <GenericFilters/>}
                        {group === "Tag" && <TagFilters tags={tags}/>}
                    </Box>
                </SearchPropTemp.Provider>
                <Divider/>
            </DialogContent>
            <DialogActions>
                <Button onClick={toggleAS}>Close</Button>
                <Button onClick={onSearch}>Search</Button>
            </DialogActions>
        </Dialog>
    )
}

export interface SearchPropsOpp {
    searchProp: SearchPropsType
    setSearchProp: (value: Partial<SearchPropsType>) => void
}

export const SearchPropTemp = React.createContext<SearchPropsOpp>(
    {
        searchProp: {main: {}, generic: {}, tag:{}},
        setSearchProp: (v) => {}
    }
)

interface PropTypes {
    open: boolean
    toggleAS: () => void
    updateSearch: (value: Search) => void
    tags: Tag[]
}

export default AdvancedSearch
