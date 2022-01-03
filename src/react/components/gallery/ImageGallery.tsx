import React, {useEffect} from 'react';
import {Paper} from "@material-ui/core";
import {importImagesCompleteChannel} from "@electron/ipcCommands";
import Integer from "Integer";

function ImageGallery() {

    const [images, setImages] = React.useState<{id: Integer.IntLike, title: string, author: string}[]>([])

    useEffect(() => {
        window.api.receive(importImagesCompleteChannel, () => {
            getImages()
        })
        getImages()
        return function cleanup() {
            window.api.removeAll(importImagesCompleteChannel)
        };
    }, [])

    const getImages = () => {
        window.api.db.getImages({}, () => {})
    }

    return (
        <div>
            <Paper>
            </Paper>
        </div>
    );
}

export default ImageGallery;
