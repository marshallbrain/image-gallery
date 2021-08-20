import React, {useEffect} from 'react';
import ImportImages from "./dialogs/import_images/ImportImages";
import {channels} from "@utils/ipcCommands";

function PersistentDialogs() {
    
    const [importImages, setImportImages] = React.useState(false);
    const [reimportImages, setReimportImages] = React.useState(false);
    
    const handleOpen = (name: string) => () => {
        switch (name) {
            case "importImages": setImportImages(true); break
            case "reimportImages": setReimportImages(true); break
        }
    };
    
    const handleClose = (name: string) => () => {
        switch (name) {
            case "importImages": setImportImages(false); break
            case "reimportImages": setReimportImages(false); break
        }
    };
    
    useEffect(() => {
        window.api.receive(channels.openImportDialog, handleOpen("importImages"))
        window.api.receive(channels.openReimportDialog, handleOpen("reimportImages"))
        return function cleanup() {
            window.api.removeAll(channels.openImportDialog)
            window.api.removeAll(channels.openReimportDialog)
        };
    }, [])
    
    return (
        <React.Fragment>
            <ImportImages open={importImages} close={handleClose("importImages")} reimport={false} />
            <ImportImages open={reimportImages} close={handleClose("reimportImages")} reimport={true} />
        </React.Fragment>
    );
}

export default PersistentDialogs;
