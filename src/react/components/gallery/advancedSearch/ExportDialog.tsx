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

const ExportDialog = (props: PropTypes) => {

    const {
        open,
        toggle,
        selected
    } = props

    const [title, setTitle] = useState("image_id")
    const [folder, setFolder] = useState("")

    const changeTitle = (event: SelectChangeEvent) => {
        setTitle(event.target.value)
    }

    const getExportFolder = () => {

    }

    return (
        <Dialog
            open={open}
            onClose={toggle}
            fullWidth
            maxWidth={"xs"}
        >
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
                    <Button
                        variant="contained"
                        sx={{alignSelf: "flex-start"}}
                        onClick={getExportFolder}
                    >
                        select folder
                    </Button>
                    {folder !== "" && <Typography>
                        {folder}
                    </Typography>}
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={toggle} >Cancel</Button>
                <Button>Export</Button>
            </DialogActions>
        </Dialog>
    )
}

const Input = styled('input')({
    display: 'none',
    imageText: {},
    alignSelf: "flex-start"
});

interface PropTypes {
    open: boolean
    toggle: () => void
    selected: Set<number>
}

export default ExportDialog
