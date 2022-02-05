import React, {useContext, useEffect, useState} from 'react';
import sqlQueries from "@utils/sqlQueries";
import {channels} from "@utils/ipcCommands";
import ImageGrid from "@components/gallery/ImageGrid";
import ImageSearch from "@components/gallery/ImageSearch";
import {Grid} from "@mui/material";
import {Image, SearchPropsState, SearchPropsType} from "@components/App";
import {genericSearchMap, GenericSearchType} from "@components/gallery/advancedSearch/GenericFilters";
import {tagSearchMap, TagSearchType} from "@components/gallery/advancedSearch/TagFilters";
import {collectionSearchMap, CollectionSearchType} from "@components/gallery/advancedSearch/CollectionFilters";
import {toAny} from "@components/utilities";

function ImageGallery(props: PropTypes) {

    const {onImageSelected} = props

    const {searchProp} = useContext(SearchPropsState);

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
    }, [searchProp])

    const getImages = () => {
        window.api.db.search((data) => {
            setImages(data)
        }, searchMap(searchProp))
    }

    const searchMap = (search: SearchPropsType): toAny<SearchPropsType> => ({
        generic: genericSearchMap(search["generic"]),
        tag: tagSearchMap(search["tag"]),
        collection: collectionSearchMap(search["collection"])
    })

    return (
        <Grid container direction="column" sx={{height: "100vh"}} >
            <Grid item xs={1}>
                <ImageSearch/>
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
