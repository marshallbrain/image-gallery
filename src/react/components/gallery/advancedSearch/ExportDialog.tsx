import React from 'react';
import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";

const ExportDialog = (props: PropTypes) => {

    const {
        open,
        toggle,
        selected
    } = props

    return (
        <Dialog
            open={open}
            maxWidth={"sm"}
            fullWidth
            onClose={toggle}
        >
            <DialogTitle>Export Images</DialogTitle>
            <DialogContent>
            </DialogContent>
            <DialogActions>
                <Button onClick={toggle} >Cancel</Button>
                <Button>Export</Button>
            </DialogActions>
        </Dialog>
    )
}

interface PropTypes {
    open: boolean
    toggle: () => void
    selected: Set<number>
}

export default ExportDialog
