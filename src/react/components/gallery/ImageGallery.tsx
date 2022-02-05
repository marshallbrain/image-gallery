import React, {useEffect, useState} from 'react';
import sqlQueries from "@utils/sqlQueries";
import {channels} from "@utils/ipcCommands";
import ImageGrid from "@components/gallery/ImageGrid";
import ImageSearch from "@components/gallery/ImageSearch";
import {Grid} from "@mui/material";
import {Image} from "@components/App";
import {GenericSearchType} from "@components/gallery/advancedSearch/GenericFilters";
import {TagSearchType} from "@components/gallery/advancedSearch/TagFilters";

function ImageGallery(props: PropTypes) {

    const {onImageSelected} = props

    const [search, setSearch] = useState<Search>({})
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

    useEffect(() => {
        getImages()
    }, [search])

    const getImages = () => {
        window.api.db.search((data) => {
            setImages(data)
        }, search)
    }

    const updateSearch = (value: object) => {
        setSearch(value)
    }

    return (
        <Grid container direction="column" sx={{height: "100vh"}} >
            <Grid item xs={1}>
                <ImageSearch updateSearch={updateSearch} />
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

export interface Search extends GenericSearchType, TagSearchType {
}

export default ImageGallery;
