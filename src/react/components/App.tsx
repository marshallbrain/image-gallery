import React, {useEffect, useState} from 'react';
import PersistentDialogs from "./PersistentDialogs";
import ImageGallery from "@components/gallery/ImageGallery";
import AppViewer from "../image_viewer/components/AppViewer";
import {ChipBase} from "../image_viewer/components/TagSelector";

function App() {

    const [imageIndex, setImageIndex] = React.useState(-1)
    const [imageList, setImageList] = React.useState<Image[]>([])
    const [searchProp, setSearchProp] = useState<SearchPropsType>({
        generic: {}, tag:{}, collection: {}
    })

    const selectImage = (index: number, list: Image[]) => {
        console.log((imageList.length > 0 && imageIndex > -1))
        setImageIndex(index)
        setImageList(list)
    }

    const closeImage = () => {
        setImageIndex(-1)
        setImageList([])
    }

    return (
        <React.Fragment>
            <PersistentDialogs />
            {(imageList.length > 0 && imageIndex > -1)?
                <AppViewer
                    index={imageIndex}
                    imageList={imageList}
                    onIndexChange={setImageIndex}
                    onClose={closeImage}
                />:
                <SearchPropsState.Provider value={{searchProp, setSearchProp}}>
                    <ImageGallery onImageSelected={selectImage}/>
                </SearchPropsState.Provider>
            }
        </React.Fragment>
    );
}

export const SearchPropsState = React.createContext<{
    searchProp: SearchPropsType
    setSearchProp: (value: SearchPropsType) => void
}>(
    {
        searchProp: {},
        setSearchProp: (v) => {}
    }
)

export interface Tag extends ChipBase {
    tag_id?: number
}

export interface Col extends ChipBase {
    collection_id?: number
}

export interface Image {
    image_id: number
    title?: string
    extension: string
}

export interface SearchPropsType {
    generic?: {
        title?: string
    }
    tag?: {
        incTags?: Tag[]
        excTags?: Tag[]
        tagLess?: boolean
    }
    collection?: {
        incCols?: Col[]
        excCols?: Col[]
        colLess?: boolean
    }
}

export default App;
