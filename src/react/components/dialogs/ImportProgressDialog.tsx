import React, {useEffect, useState} from 'react';
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
import {FixedSizeList, ListChildComponentProps} from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import ImportImages from "@components/dialogs/import_images/ImportImages";
import {useChannel} from "@components/utilities";
import channels from "@utils/channels";

const ImportProgress = () => {

    const [progress, setProgress] = React.useState(0)
    const [filename, setFilename] = React.useState("")

    useChannel(channels.update.progress, (([value, filename]) => {
        setProgress(value * 100)
        setFilename(filename)
    }))

    return (
        <React.Fragment>
            <DialogTitle>Import Progress</DialogTitle>
            <DialogContent>
                <Stack
                    direction={"row"}
                    justifyContent="center"
                    alignItems="center"
                    spacing={2}
                >
                    <LinearProgress
                        variant={(progress <= 0 || progress >= 100)? "indeterminate": "determinate"}
                        value={progress}
                        sx={{
                            flexGrow: 1,
                            ".MuiLinearProgress-bar": {
                                transition: "none"
                            }
                        }}
                    />
                    <Typography variant="body2" color="text.secondary">{`${Math.round(
                        progress,
                    )}%`}</Typography>
                </Stack>
                <Typography variant="body1" color="text.secondary">
                    {filename}
                </Typography>
            </DialogContent>
        </React.Fragment>
    );
};

const ImportProgressDialog = () => {

    const [open, setOpen] = useState(false)
    const [errored, setErrored] = React.useState<any[]>([])

    console.log(errored)

    useChannel(channels.dialogs.startProgress, () => {setOpen(true)})
    useChannel(channels.update.finishProgress, ([errored]: Set<string>[]) => {
        if (errored && errored.size > 0) {
            setErrored([...errored].sort())
        } else {
            setOpen(false)
        }
    })

    const renderError = ({ index, style }: ListChildComponentProps) => (
        <ListItem style={style} key={index} component="div" className={"userSelectable"}>
            {errored[index]}
        </ListItem>
    )

    return (
        <Dialog
            open={open}
            maxWidth={"md"}
            fullWidth
        >
            <Dialog
                open={errored && errored.length > 0}
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
                    <Button onClick={() => setOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>
            <ImportProgress/>
        </Dialog>
    )

}

interface PropTypes extends DialogPropType {
}

export default ImportProgressDialog;
