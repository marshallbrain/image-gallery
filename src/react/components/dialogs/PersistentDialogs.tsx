import React, {useEffect, useState} from 'react/index';
import ImportImages from "./import_images/ImportImages";
import {channels as ipcChannels} from "@utils/ipcCommands";
import ImportProgressDialog from "@components/dialogs/ImportProgressDialog";
import {Dialog} from "@mui/material";
import channels from "@utils/channels";
import {useChannel} from "@components/utilities";

function PersistentDialogs() {

    const [importImages, setImportImages] = React.useState(false);
    const [importProgress, setImportProgress] = React.useState(false);
    const [reimportImages, setReimportImages] = React.useState(false);

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

    useEffect(() => {
        const openReimportKey = window.api.receive(ipcChannels.openReimportDialog, openOld(D.reimportImages))
        return function cleanup() {
            window.api.remove(ipcChannels.openReimportDialog, openReimportKey)
        };
    }, [])

    const dialogMap = {
        [D.importImages]: setImportImages,
        [D.importProgress]: setImportProgress,
        [D.reimportImages]: setReimportImages
    }

    const openOld = (name: D) => () => {
        dialogMap[name](true)
    }

    const closeOld = (name: D) => () => {
        dialogMap[name](false)
    }

    const swap = (closeName: D, openName: D) => () => {
        closeOld(closeName)()
        openOld(openName)()
    }

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

const dialogsDefault: Record<Dialogs, boolean> = {"0": false}

enum D {
    importImages,
    importProgress,
    reimportImages
}

export interface DialogPropType {
    onClose: () => void
}

export default PersistentDialogs;
