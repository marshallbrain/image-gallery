import React, {useContext, useEffect, useState} from 'react/index';
import ImageGrid from "./ImageGrid";
import ImageSearch from "./ImageSearch";
import {Button, Dialog, Divider, Grid, IconButton, Paper, Stack, styled, Typography} from "@mui/material";
import {Image, SearchPropsState, SearchPropsType} from "../App";
import {genericSearchMap} from "./advancedSearch/GenericFilters";
import {tagSearchMap} from "./advancedSearch/TagFilters";
import {collectionSearchMap} from "./advancedSearch/CollectionFilters";
import {toAny} from "../../utilities";
import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox";
import ExportDialog from "@components/dialogs/ExportDialog";
import channels from "@utils/channels";
import {getQuery, runQuery, useQuery, useSearch} from "@components/hooks/sqlHooks";
import {sendChannel, useChannel} from "@components/hooks/channelHooks";
import runQueries from "../../queries/runQueries";
import getQueries from "../../queries/getQueries";
import MetadataDialog from "@components/dialogs/MetadataDialog";

function ImageGallery(props: PropTypes) {

    const {onImageSelected, imageIndex} = props

    const searchMap = (search: SearchPropsType): toAny<SearchPropsType> => ({
        generic: genericSearchMap(search["generic"]),
        tag: tagSearchMap(search["tag"]),
        collection: collectionSearchMap(search["collection"])
    })

    const {searchProp} = useContext(SearchPropsState);

    const [selected, setSelected] = useState<Set<number>>(new Set())
    const [exportDialog, setExportDialog] = useState(false)
    const [dialogs, setDialogs] = useState({metadata: false})

    const [images, updateSearch] = useSearch(searchMap(searchProp), [searchProp])
    const [selectedList, updateSelected] = useQuery<number>(getQueries.image.getSelectedImages)

    useChannel(channels.update.reloadSearch, () => {
        updateSearch()
    })

    useEffect(() => {
        sendChannel(channels.update.windowTitle, ["Gallery"])
    }, [])
    useEffect(() => {
        // console.log(selectedList)
        setSelected(new Set(selectedList))
    }, [selectedList])

    const selectAll = () => {
        runQuery(runQueries.image.deselectAllImages)
            .then(() => runQuery(runQueries.image.selectAllImages))
            .then(updateSelected)
        // setSelected(new Set(images.map(((value) => value.image_id))))
    }

    const deselectAll = () => {
        runQuery(runQueries.image.deselectAllImages)
            .then(updateSelected)
        // setSelected(new Set())
    }

    const toggleExportDialog = () => {
        setExportDialog((!exportDialog))
    }

    const toggleDialogs = (dialog: keyof typeof dialogs) => () => {
        setDialogs({
            ...dialogs,
            [dialog]: !dialogs[dialog]
        })
    }

    const selectImages = (id: number, multi: {last: number, shift: boolean}) => {
        const range = [
            (multi.shift && id > multi.last)? multi.last: id,
            (multi.shift && id < multi.last)? multi.last: id
        ]
        console.log(range)

        getQuery(getQueries.image.allSelected, range).then(([{n}]) => {
            if (Math.abs(id - ((multi.shift)? multi.last: id)) + 1 == n) {
                console.log(id)
                runQuery(runQueries.image.deselectImages, range)
                    .then(updateSelected)
            } else {
                runQuery(runQueries.image.selectImages, range)
                    .then(updateSelected)
            }
        })

    }

    const toggleBookmark = () => {
        getQuery(getQueries.image.getCommonBookmark, []).then((bookmark) => {
            console.log(bookmark[0].bookmark)
            if (bookmark[0].bookmark > 0) {
                runQuery(runQueries.image.selectionUnbookmarkImages).then()
            } else {
                runQuery(runQueries.image.selectionBookmarkImages).then()
            }
        })
    }

    return (
        <React.Fragment>
            <Grid container direction="column" sx={{height: "100vh"}}>
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
                            <IconButton color="info" sx={{}} onClick={deselectAll}>
                                <IndeterminateCheckBoxIcon/>
                            </IconButton>
                            <Button variant="outlined" color={"info"} onClick={selectAll}>Select all</Button>
                            <Divider orientation="vertical" flexItem />
                            <Typography variant={"subtitle1"} sx={{fontWeight: "bold", px: 2}}>
                                <StyledText>{selected.size}</StyledText>
                                {(selected.size > 1) ? " Images" : " Image"} selected
                            </Typography>
                            <Divider orientation="vertical" flexItem />
                            <Button
                                variant="outlined"
                                color={"info"}
                                onClick={toggleBookmark}
                            >
                                Bookmark
                            </Button>
                            <Button
                                variant="outlined"
                                color={"info"}
                                onClick={toggleDialogs("metadata")}
                            >
                                Edit Metadata
                            </Button>
                            <Divider orientation="vertical" flexItem />
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
                        selectImages={selectImages}
                        imageIndex={imageIndex}
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
            <Dialog
                open={dialogs.metadata}
                onClose={toggleDialogs("metadata")}
                fullWidth
                maxWidth={"sm"}
            >
                <MetadataDialog
                    onClose={toggleDialogs("metadata")}
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
    imageIndex: number
}

export default ImageGallery;
