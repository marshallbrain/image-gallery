import React, {useState} from 'react/index';
import ImportImages from "./import_images/ImportImages";
import ImportProgressDialog from "@components/dialogs/ImportProgressDialog";
import {Dialog} from "@mui/material";
import channels from "@utils/channels";
import {useChannel} from "@components/hooks/channelHooks";

function PersistentDialogs() {

    const [dialogState, setDialogState] = useState<Record<Dialogs, boolean>>(dialogsDefault)

    const open = (dialog: Dialogs) => () => {
        setDialogState({
            ...dialogState,
            [dialog]: true
        })
    }
    const close = (dialog: Dialogs) => () => {
        setDialogState({
            ...dialogState,
            [dialog]: false
        })
    }

    useChannel(channels.dialogs.importImages, open(Dialogs.importImages))

    return (
        <React.Fragment>
            <ImportProgressDialog/>
            <Dialog open={dialogState[Dialogs.importImages]} onClose={close(Dialogs.importImages)}>
                <ImportImages
                    close={close(Dialogs.importImages)}
                    reimport={false}
                />
            </Dialog>
        </React.Fragment>
    );
}

enum Dialogs {
    importImages
}

const dialogsDefault: Record<Dialogs, boolean> = {
    "0": false
}

export interface DialogPropType {
    onClose: () => void
}

export default PersistentDialogs;
