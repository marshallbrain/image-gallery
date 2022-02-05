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
import React, {useState} from 'react';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CollectionsIcon from '@mui/icons-material/Collections';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import TagSelector, {Tag} from "../../image_viewer/components/TagSelector";
import GenericFilters from "@components/gallery/advancedSearch/GenericFilters";
import TagFilters from "@components/gallery/advancedSearch/TagFilters";

const AdvancedSearch = (props: PropTypes) => {

    const {
        open,
        title,
        changeTitle,
        tags,
        incTags,
        setIncTags
    } = props

    const [group, setGroup] = useState("Generic")

    const changeGroup = (
        event: React.MouseEvent<HTMLElement>,
        newGroup: string | null,
    ) => {
        if (newGroup !== null) {
            setGroup(newGroup)
        }
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
                    {group === "Generic" && <GenericFilters title={title} changeTitle={changeTitle}/>}
                    {group === "Tag" && <TagFilters tags={tags} incTags={incTags} setIncTags={setIncTags}/>}
                </Box>
                <Divider/>
            </DialogContent>
            <DialogActions>
                <Button>Close</Button>
                <Button>Search</Button>
            </DialogActions>
        </Dialog>
    )
}

interface PropTypes {
    open: boolean
    title: string
    changeTitle: (event: React.ChangeEvent<HTMLInputElement>) => void
    tags: Tag[]
    incTags: Tag[]
    setIncTags: (value: Tag[]) => void
}

export default AdvancedSearch
