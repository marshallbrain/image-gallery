import React, {useEffect} from 'react';
import {
    Button,
    Chip,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    LinearProgress,
    ListItem,
    Stack,
    Typography
} from "@mui/material";
import {DialogPropType} from "@components/PersistentDialogs";
import {channels} from "@utils/ipcCommands";
import {FixedSizeList, ListChildComponentProps} from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

const ImportProgressDialog = (props: PropTypes) => {

    const {open, onClose, updateChannel, completeChannel} = props

    const [importCount, setImportCount] = React.useState(0)
    const [lastFilename, setLastFilename] = React.useState("")
    const [errored, setErrored] = React.useState([])

    useEffect(() => {
        const imageImportedKey = window.api.receive(updateChannel, (presentDone, filename) => {
            setImportCount(presentDone * 100)
            setLastFilename(filename)
        })
        const imageImportCompleteKey = window.api.receive(completeChannel, (errored) => {
            setErrored(errored)
            onClose()
        })
        return function cleanup() {
            window.api.remove(updateChannel, imageImportedKey)
            window.api.remove(completeChannel, imageImportCompleteKey)
        }
    }, [])

    const renderError = ({ index, style }: ListChildComponentProps) => (
        <ListItem style={style} key={index} component="div" className={"userSelectable"}>
            {errored[index]}
        </ListItem>
    )

    return (
        <React.Fragment>
            <Dialog
                open={errored && errored.length > 0 && open}
                maxWidth={"sm"}
                fullWidth
            >
                <DialogTitle>Files that Failed to be Imported</DialogTitle>
                <DialogContent sx={{minHeight: 300}}>
                    <AutoSizer>
                        {({height, width}) => (
                            <FixedSizeList
                                height={height}
                                width={width}
                                itemSize={42}
                                itemCount={errored.length}
                                overscanCount={5}
                                style={{
                                }}
                            >
                                {renderError}
                            </FixedSizeList>
                        )}
                    </AutoSizer>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Close</Button>
                </DialogActions>
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
    updateChannel: string
    completeChannel: string
}

export default ImportProgressDialog;
