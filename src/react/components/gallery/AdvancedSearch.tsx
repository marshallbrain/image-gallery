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
import React, {useEffect, useState} from 'react';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CollectionsIcon from '@mui/icons-material/Collections';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import TagSelector, {Tag} from "../../image_viewer/components/TagSelector";
import GenericFilters, {GenericSearchType} from "@components/gallery/advancedSearch/GenericFilters";
import TagFilters, {TagSearchType} from "@components/gallery/advancedSearch/TagFilters";
import {Search} from "@components/gallery/ImageGallery";

const AdvancedSearch = (props: PropTypes) => {

    const {
        open,
        toggleAS,
        updateSearch,
        title,
        setTitle,
        tags,
        incTags,
        setIncTags
    } = props

    const [group, setGroup] = useState("Generic")
    const [root, setRoot] = useState<{title: string, tags: Tag[]}>({title, tags: incTags})
    const [genericSearch, setGenericSearch] = useState<GenericSearchType>({})
    const [tagSearch, setTagSearch] = useState<TagSearchType>({})

    const changeGroup = (
        event: React.MouseEvent<HTMLElement>,
        newGroup: string | null,
    ) => {
        if (newGroup !== null) {
            setGroup(newGroup)
        }
    }

    const onSearch = () => {

        setTitle(root.title)
        setIncTags(root.tags)

        console.log({
            ...genericSearch,
            ...tagSearch
        })

        toggleAS()
    }

    const updateRoot = (newRoot: {title?: string, tags?: Tag[]}) => {
        setRoot({
            ...root,
            ...newRoot
        })
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
                <Box sx={{maxHeight: 400, overflow: "auto", p: 2}}>
                    {group === "Generic" && <GenericFilters
                        titleInit={title}
                        setSearch={setGenericSearch}
                        updateRoot={updateRoot}
                    />}
                    {group === "Tag" && <TagFilters
                        tags={tags}
                        incTagsInit={incTags}
                        setSearch={setTagSearch}
                        updateRoot={updateRoot}
                    />}
                </Box>
                <Divider/>
            </DialogContent>
            <DialogActions>
                <Button onClick={toggleAS}>Close</Button>
                <Button onClick={onSearch}>Search</Button>
            </DialogActions>
        </Dialog>
    )
}

interface PropTypes {
    open: boolean
    toggleAS: () => void
    updateSearch: (value: Search) => void
    title: string
    setTitle: (value: string) => void
    tags: Tag[]
    incTags: Tag[]
    setIncTags: (value: Tag[]) => void
}

export default AdvancedSearch
