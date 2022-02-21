import React, {useContext, useEffect, useState} from 'react/index';
import ImageGrid from "./ImageGrid";
import ImageSearch from "./ImageSearch";
import {Button, Dialog, Grid, IconButton, Paper, Stack, styled, Typography} from "@mui/material";
import {Image, SearchPropsState, SearchPropsType} from "../App";
import {genericSearchMap} from "./advancedSearch/GenericFilters";
import {tagSearchMap} from "./advancedSearch/TagFilters";
import {collectionSearchMap} from "./advancedSearch/CollectionFilters";
import {toAny} from "../../utilities";
import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox";
import ExportDialog from "@components/dialogs/ExportDialog";
import channels from "@utils/channels";
import {runQuery, useQuery, useSearch} from "@components/hooks/sqlHooks";
import {sendChannel, useChannel} from "@components/hooks/channelHooks";
import runQueries from "../../queries/runQueries";
import getQueries from "../../queries/getQueries";

function ImageGallery(props: PropTypes) {

    const {onImageSelected} = props

    const searchMap = (search: SearchPropsType): toAny<SearchPropsType> => ({
        generic: genericSearchMap(search["generic"]),
        tag: tagSearchMap(search["tag"]),
        collection: collectionSearchMap(search["collection"])
    })

    const {searchProp} = useContext(SearchPropsState);

    const [selected, setSelected] = useState<Set<number>>(new Set())
    const [exportDialog, setExportDialog] = useState(false)

    const [images, updateSearch] = useSearch(searchMap(searchProp), [searchProp])
    const [selectedList, updateSelected] = useQuery<number>(getQueries.image.getSelectedImages)

    useChannel(channels.update.reloadSearch, () => {
        updateSearch()
    })

    useEffect(() => {
        sendChannel(channels.update.windowTitle, ["Gallery"])
    }, [])
    useEffect(() => {
        console.log(selectedList)
        setSelected(new Set(selectedList))
    }, [selectedList])

    const selectAll = () => {
        // setSelected(new Set(images.map(((value) => value.image_id))))
    }

    const deselectAll = () => {
        // setSelected(new Set())
    }

    const toggleExportDialog = () => {
        setExportDialog((!exportDialog))
    }

    const selectImages = (id: number, multi: {last: number, shift: boolean}) => {
        console.log(multi.shift)
        if (multi.shift) {
            runQuery(runQueries.image.selectMultiImages, [multi.last, id]).then(updateSelected)
        } else {
            runQuery(runQueries.image.selectImages, [id]).then(updateSelected)
        }
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
                        selectImages={selectImages}
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
