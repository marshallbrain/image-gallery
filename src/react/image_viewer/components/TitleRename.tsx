import React, {useState} from 'react';
import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import sqlQueries from "@utils/sqlQueries";

const TitleRename = (props: PropTypes) => {

    const {
        open,
        toggleTR,
        imageID,
        updateData,
    } = props

    const [title, setTitle] = useState(props.title)

    const updateTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value)
    }

    const saveTitle = () => {
        window.api.db.getImages(sqlQueries.setImageTitle, () => {
            updateData()
            toggleTR()
        }, {imageID, title})
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
                        value={title}
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
    updateData: () => void
}

export default TitleRename
