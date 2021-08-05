import React, {useEffect} from 'react';
import ImportImages from "./dialogs/import_images/ImportImages";
import {openImportDialogChannel} from "../../utils/ipcCommands";

function PersistentDialogs(props) {
    
    const [importImages, setImportImages] = React.useState(true);
    
    const handleOpen = (name) => () => {
        switch (name) {
            case "importImages": setImportImages(true)
        }
    };
    
    const handleClose = (name) => () => {
        switch (name) {
            case "importImages": setImportImages(false)
        }
    };
    
    useEffect(() => {
        window.api.receive(openImportDialogChannel, handleOpen("importImages"))
        return function cleanup() {
            window.api.removeAll(openImportDialogChannel)
        };
    })
    
    return (
        <React.Fragment>
            <ImportImages open={importImages} close={handleClose("importImages")} />
        </React.Fragment>
    );
}

export default PersistentDialogs;
