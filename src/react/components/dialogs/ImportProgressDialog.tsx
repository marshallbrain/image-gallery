import React, {useEffect} from 'react';
import {Dialog, DialogContent, DialogTitle, Divider, LinearProgress, Stack, Typography} from "@mui/material";
import {DialogPropType} from "@components/PersistentDialogs";
import {channels} from "@utils/ipcCommands";

const ImportProgressDialog = (props: PropTypes) => {

    const {open, onClose} = props

    const [importCount, setImportCount] = React.useState(0)
    const [lastFilename, setLastFilename] = React.useState("")
    const [errored, setErrored] = React.useState([])

    useEffect(() => {
        const imageImportedKey = window.api.receive(channels.imageImported, (presentDone, filename) => {
            setImportCount(presentDone * 100)
            setLastFilename(filename)
        })
        const imageImportCompleteKey = window.api.receive(channels.imageImportComplete, (errored) => {
            setErrored(errored)
        })
    }, [])

    return (
        <React.Fragment>
            <Dialog
                open={errored.length > 0}
            >
                <DialogTitle>Import Progress</DialogTitle>
                <DialogContent>

                </DialogContent>
            </Dialog>
            <Dialog
                open={open}
                maxWidth={"sm"}
                fullWidth
            >
                <DialogTitle>Import Progress</DialogTitle>
                <DialogContent>
                    <Stack
                        direction={"row"}
                        justifyContent="center"
                        alignItems="center"
                        spacing={2}
                    >
                        <LinearProgress variant="determinate" value={importCount} sx={{flexGrow: 1}}/>
                        <Typography variant="body2" color="text.secondary">{`${Math.round(
                            importCount,
                        )}%`}</Typography>
                    </Stack>
                    <Typography variant="body1" color="text.secondary">
                        {lastFilename}
                    </Typography>
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
};

interface PropTypes extends DialogPropType {

}

export default ImportProgressDialog;
