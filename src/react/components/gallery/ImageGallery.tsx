import React, {useEffect} from 'react';
import {Paper} from "@material-ui/core";
import Integer from "Integer";
import {sqlImageSearch} from "@utils/sqlQueries";
import {channels} from "@utils/ipcCommands";

function ImageGallery() {

    const [images, setImages] = React.useState<{image_id: Integer.IntLike, title: string}[]>([])

    useEffect(() => {
        window.api.receive(channels.importImagesComplete, () => {
            getImages()
        })
        getImages()
        return function cleanup() {
            window.api.removeAll(channels.importImagesComplete)
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
