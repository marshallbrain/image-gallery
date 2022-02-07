import React, {useContext, useEffect, useState} from 'react';
import sqlQueries from "@utils/sqlQueries";
import {channels} from "@utils/ipcCommands";
import ImageGrid from "@components/gallery/ImageGrid";
import ImageSearch from "@components/gallery/ImageSearch";
import {Button, Dialog, Grid, IconButton, Paper, Stack, styled, Typography} from "@mui/material";
import {Image, SearchPropsState, SearchPropsType} from "@components/App";
import {genericSearchMap, GenericSearchType} from "@components/gallery/advancedSearch/GenericFilters";
import {tagSearchMap, TagSearchType} from "@components/gallery/advancedSearch/TagFilters";
import {collectionSearchMap, CollectionSearchType} from "@components/gallery/advancedSearch/CollectionFilters";
import {toAny} from "@components/utilities";
import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox";
import ExportDialog from "@components/gallery/advancedSearch/ExportDialog";

function ImageGallery(props: PropTypes) {

    const {onImageSelected} = props

    const {searchProp} = useContext(SearchPropsState);

    const [images, setImages] = React.useState<Image[]>([])
    const [selected, setSelected] = useState<Set<number>>(new Set())
    const [exportDialog, setExportDialog] = useState(false)

    useEffect(() => {
        getImages()
        window.api.send(channels.setWindowTitle, "Gallery")
        const imageImportCompleteKey = window.api.receive(channels.imageImportComplete, () => {
            getImages()
        })
        return function cleanup() {
            window.api.remove(channels.imageImportComplete, imageImportCompleteKey)
        }
    }, [])

    const selectAll = () => {
        setSelected(new Set(images.map(((value) => value.image_id))))
    }

    const deselectAll = () => {
        setSelected(new Set())
    }

    const toggleExportDialog = () => {
        setExportDialog((!exportDialog))
    }

    useEffect(() => {
        getImages()
    }, [searchProp])

    const getImages = () => {
        window.api.db.search((data) => {
            setImages(data)
        }, searchMap(searchProp))
    }

    const searchMap = (search: SearchPropsType): toAny<SearchPropsType> => ({
        generic: genericSearchMap(search["generic"]),
        tag: tagSearchMap(search["tag"]),
        collection: collectionSearchMap(search["collection"])
    })

    return (
        <React.Fragment>
            <Grid container direction="column" sx={{height: "100vh"}} >
                <Grid item xs={1}>
                    <ImageSearch/>
                </Grid>
                <Grid item>
                    {selected.size > 0 && <Paper sx={{p: 2}}>
                        <Stack
                            direction="row"
                            justifyContent="flex-start"
                            alignItems="center"
                            spacing={1}
                        >
                            <IconButton color="info" sx={{pr: 0}} onClick={deselectAll}>
                                <IndeterminateCheckBoxIcon/>
                            </IconButton>
                            <Button variant="outlined" color={"info"} onClick={selectAll}>Select all</Button>
                            <Typography variant={"subtitle1"} sx={{fontWeight: "bold", px: 2}}>
                                <StyledText>{selected.size}</StyledText>
                                {(selected.size > 1) ? " Images" : " Image"} selected
                            </Typography>
                            <Button
                                variant="outlined"
                                color={"info"}
                                onClick={toggleExportDialog}
                            >
                                Export
                            </Button>
                        </Stack>
                    </Paper>}
                </Grid>
                <Grid item xs>
                    <ImageGrid
                        images={images}
                        onImageSelected={onImageSelected}
                        selected={selected}
                        setSelected={setSelected}
                    />
                </Grid>
            </Grid>
            <Dialog
                open={exportDialog}
                onClose={toggleExportDialog}
                fullWidth
                maxWidth={"xs"}
            >
                <ExportDialog
                    toggle={toggleExportDialog}
                    selected={selected}
                />
            </Dialog>
        </React.Fragment>
    )

}

const StyledText = styled("span")(({theme}) => ({
    color: theme.palette.info.dark
}))

interface PropTypes {
    onImageSelected: (index: number, imageList: Image[]) => void
}

export default ImageGallery;
