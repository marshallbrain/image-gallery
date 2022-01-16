import React, {useEffect} from 'react';
import {sqlImageSearch} from "@utils/sqlQueries";
import {channels} from "@utils/ipcCommands";
import ImageGrid from "@components/gallery/ImageGrid";
import ImageSearch from "@components/gallery/ImageSearch";
import {Grid} from "@mui/material";

function ImageGallery() {

    const [images, setImages] = React.useState<{ image_id: Number, title: string }[]>([])

    useEffect(() => {
        window.api.receive(channels.importImagesComplete, () => {
            console.log("Image import complete")
            getImages()
        })
        window.api.receive(channels.reimportImagesComplete, () => {
            console.log("Re-image import complete")
            getImages()
        })
        getImages()
        return function cleanup() {
            window.api.removeAll(channels.importImagesComplete)
            window.api.removeAll(channels.reimportImagesComplete)
        };
    }, [])

    const getImages = () => {
        window.api.db.getImages(sqlImageSearch, (data) => {
            setImages(data)
        })
    }

    return (
        <Grid container direction="column" sx={{height: "100vh"}} >
            <Grid item xs={1}>
                <ImageSearch />
            </Grid>
            <Grid item xs>
                <ImageGrid images={images} />
            </Grid>
        </Grid>

    )

}

export default ImageGallery;
