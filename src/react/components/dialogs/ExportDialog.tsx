import React, {useState} from 'react/index';
import {
    Button,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Stack,
    styled
} from "@mui/material";
import channels from "@utils/channels";
import {sendChannel} from "@components/hooks/channelHooks";

const ExportDialog = (props: PropTypes) => {

    const {
        toggle,
        selected,
    } = props

    const [title, setTitle] = useState("title")

    const changeTitle = (event: SelectChangeEvent) => {
        setTitle(event.target.value)
    }

    const exportImages = () => {
        sendChannel(channels.execute.exportImages, {selected, title})
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
