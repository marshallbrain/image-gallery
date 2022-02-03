import React, {useEffect} from 'react';
import ImportImages from "./dialogs/import_images/ImportImages";
import {channels} from "@utils/ipcCommands";
import ImportProgressDialog from "@components/dialogs/ImportProgressDialog";

function PersistentDialogs() {

    const [importImages, setImportImages] = React.useState(false);
    const [importProgress, setImportProgress] = React.useState(false);
    const [reimportImages, setReimportImages] = React.useState(false);

    useEffect(() => {
        const openImportKey = window.api.receive(channels.openImportDialog, open(Dialog.importImages))
        const openReimportKey = window.api.receive(channels.openReimportDialog, open(Dialog.reimportImages))
        return function cleanup() {
            window.api.remove(channels.openImportDialog, openImportKey)
            window.api.remove(channels.openReimportDialog, openReimportKey)
        };
    }, [])

    const dialogMap = {
        [Dialog.importImages]: setImportImages,
        [Dialog.importProgress]: setImportProgress,
        [Dialog.reimportImages]: setReimportImages
    }

    const open = (name: Dialog) => () => {
        dialogMap[name](true)
    }

    const close = (name: Dialog) => () => {
        dialogMap[name](false)
    }

    const swap = (closeName: Dialog, openName: Dialog) => () => {
        close(closeName)()
        open(openName)()
    }

    return (
        <React.Fragment>
            <ImportImages
                open={importImages}
                close={swap(Dialog.importImages, Dialog.importProgress)}
                reimport={false}
            />
            <ImportProgressDialog
                open={importProgress}
                onClose={close(Dialog.importProgress)}
            />
        </React.Fragment>
    );
}

enum Dialog {
    importImages,
    importProgress,
    reimportImages
}

export interface DialogPropType {
    open: boolean
    onClose: () => void
}

export default PersistentDialogs;
