import React, {useState} from 'react/index';
import {
    Autocomplete,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, FormControl, InputLabel, MenuItem,
    Select, SelectChangeEvent, Stack, styled,
    TextField, Typography
} from "@mui/material";
import {ImageFile} from "@components/dialogs/import_images/ImportImages";
import {channels, ipcChannels} from "@utils/ipcCommands";
import ImportProgressDialog from "@components/dialogs/ImportProgressDialog";
import {useEffect} from "react";

const ExportDialog = (props: PropTypes) => {

    const {
        toggle,
        selected,
    } = props

    const [title, setTitle] = useState("title")
    const [exporting, setExporting] = useState(false)

    useEffect(() => {
        window.api.once(channels.imageExported, () => {
            setExporting(true)
        })
    }, [])

    const changeTitle = (event: SelectChangeEvent) => {
        setTitle(event.target.value)
    }

    const exportImages = () => {
        window.api.send(channels.exportImages, {selected, title})
    }

    const exportDone = () => {
        toggle()
    }

    return (
        <React.Fragment>
            <DialogTitle>Export Images</DialogTitle>
            <DialogContent>
                <Stack
                    direction="column"
                    justifyContent="center"
                    alignItems="stretch"
                    spacing={2}
                    sx={{pt: 2}}
                >
                    <FormControl variant="standard">
                        <InputLabel>Use as title</InputLabel>
                        <Select
                            value={title}
                            onChange={changeTitle}
                        >
                            <MenuItem value={"image_id"}>Image Id</MenuItem>
                            <MenuItem value={"title"}>Title</MenuItem>
                        </Select>
                    </FormControl>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={toggle}>Cancel</Button>
                <Button onClick={exportImages}>Export</Button>
            </DialogActions>
            <Dialog
                open={exporting}
                maxWidth={"sm"}
                fullWidth
            >
                <ImportProgressDialog
                    updateChannel={channels.imageExported}
                    completeChannel={channels.imageExportComplete}
                    onClose={exportDone}
                />
            </Dialog>
        </React.Fragment>
    )
}

const Input = styled('input')({
    display: 'none',
    imageText: {},
    alignSelf: "flex-start"
});

interface PropTypes {
    toggle: () => void
    selected: Set<number>
}

export default ExportDialog
