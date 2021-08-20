import React, {useEffect} from 'react';
import {Paper} from "@material-ui/core";
import {importImagesCompleteChannel} from "@electron/ipcCommands";
import Integer from "Integer";
import {sqlImageSearch} from "@utils/sqlQueries";

function ImageGallery() {

    const [images, setImages] = React.useState<{image_id: Integer.IntLike, title: string}[]>([])

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
        window.api.db.getImages(sqlImageSearch, (data) => {
            setImages(data)
        })
    }

    return (
        <div>
            <Paper>
                {images.map(({image_id}) => {
                    return <img
                        key={image_id.toString()}
                        src={`preview://${image_id}`}
                        alt={"thumbnail"}
                    />
                })}
            </Paper>
        </div>
    );
}

export default ImageGallery;
