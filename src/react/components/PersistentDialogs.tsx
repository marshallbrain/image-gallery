import React, {useEffect} from 'react';
import ImportImages from "./dialogs/import_images/ImportImages";
import {channels} from "@utils/ipcCommands";
import ImportProgressDialog from "@components/dialogs/ImportProgressDialog";
import {Dialog} from "@mui/material";

function PersistentDialogs() {

    const [importImages, setImportImages] = React.useState(false);
    const [importProgress, setImportProgress] = React.useState(false);
    const [reimportImages, setReimportImages] = React.useState(false);

    useEffect(() => {
        const openImportKey = window.api.receive(channels.openImportDialog, open(Dialogs.importImages))
        const openReimportKey = window.api.receive(channels.openReimportDialog, open(Dialogs.reimportImages))
        return function cleanup() {
            window.api.remove(channels.openImportDialog, openImportKey)
            window.api.remove(channels.openReimportDialog, openReimportKey)
        };
    }, [])

    const dialogMap = {
        [Dialogs.importImages]: setImportImages,
        [Dialogs.importProgress]: setImportProgress,
        [Dialogs.reimportImages]: setReimportImages
    }

    const open = (name: Dialogs) => () => {
        dialogMap[name](true)
    }

    const close = (name: Dialogs) => () => {
        dialogMap[name](false)
    }

    const swap = (closeName: Dialogs, openName: Dialogs) => () => {
        close(closeName)()
        open(openName)()
    }

    return (
        <React.Fragment>
            <Dialog open={importImages} onClose={close(Dialogs.importImages)}>
                <ImportImages
                    close={swap(Dialogs.importImages, Dialogs.importProgress)}
                    reimport={false}
                />
            </Dialog>
            <Dialog
                open={importProgress}
                maxWidth={"sm"}
                fullWidth
            >
                <ImportProgressDialog
                    onClose={close(Dialogs.importProgress)}
                    updateChannel={channels.imageImported}
                    completeChannel={channels.imageImportComplete}
                />
            </Dialog>
        </React.Fragment>
    );
}

enum Dialogs {
    importImages,
    importProgress,
    reimportImages
}

export interface DialogPropType {
    onClose: () => void
}

export default PersistentDialogs;
