import React, {useEffect, useState} from 'react/index';
import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import sqlQueries from "@utils/sqlQueries";
import {channels} from "@utils/ipcCommands";
import runQueries from "../queries/runQueries";
import {setQuery} from "@components/hooks/sqlHooks";

const TitleRename = (props: PropTypes) => {

    const {
        open,
        toggleTR,
        imageID,
        title
    } = props

    const [editTitle, setEditTitle] = useState<string|undefined>("")

    useEffect(() => {
        setEditTitle(title)
    }, [title])

    const updateTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEditTitle(event.target.value)
    }

    const saveTitle = () => {
        setQuery(runQueries. image.setImageTitle, {imageID, title: editTitle}).then(() => {
            toggleTR()
            window.api.send(channels.setWindowTitle, editTitle)
        })
    }

    return (
        <Dialog
            open={open}
            maxWidth={"sm"}
            fullWidth
            onClose={toggleTR}
        >
            <DialogTitle>Edit Name</DialogTitle>
            <DialogContent>
                <Box sx={{pt: 2}}>
                    <TextField
                        autoFocus
                        fullWidth
                        variant="outlined"
                        label="Name"
                        value={editTitle}
                        onChange={updateTitle}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={toggleTR} >Cancel</Button>
                <Button onClick={saveTitle}>Update</Button>
            </DialogActions>
        </Dialog>
    )
}

interface PropTypes {
    open: boolean
    toggleTR: () => void
    title: string|undefined
    imageID: number|undefined
}

export default TitleRename
