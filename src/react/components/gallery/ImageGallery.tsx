import React, {useEffect} from 'react';
import sqlQueries from "@utils/sqlQueries";
import {channels} from "@utils/ipcCommands";
import ImageGrid from "@components/gallery/ImageGrid";
import ImageSearch from "@components/gallery/ImageSearch";
import {Grid} from "@mui/material";
import {Image} from "@components/App";

function ImageGallery(props: PropTypes) {

    const {onImageSelected} = props

    const [images, setImages] = React.useState<Image[]>([])

    useEffect(() => {
        getImages()
        const imageImportCompleteKey = window.api.receive(channels.imageImportComplete, () => {
            getImages()
        })
        return function cleanup() {
            window.api.remove(channels.imageImportComplete, imageImportCompleteKey)
        }
    }, [])

    const getImages = () => {
        window.api.db.getImages(sqlQueries.imageSearch, (data) => {
            setImages(data)
        })
    }

    return (
        <Grid container direction="column" sx={{height: "100vh"}} >
            <Grid item xs={1}>
                <ImageSearch />
            </Grid>
            <Grid item xs>
                <ImageGrid images={images} onImageSelected={onImageSelected}/>
            </Grid>
        </Grid>

    )

}

interface PropTypes {
    onImageSelected: (index: number, imageList: Image[]) => void
}

export default ImageGallery;
