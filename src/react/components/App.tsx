import React, {useState} from 'react';
import PersistentDialogs from "./PersistentDialogs";
import ImageGallery from "@components/gallery/ImageGallery";
import AppViewer from "../image_viewer/components/AppViewer";
import {Tag} from "../image_viewer/components/TagSelector";

function App() {

    const [imageIndex, setImageIndex] = React.useState(-1)
    const [imageList, setImageList] = React.useState<Image[]>([])
    const [searchProp, setSearchProp] = useState<SearchPropsType>({main: {}, generic: {}, tag:{}})

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

export interface SearchPropsType {
    main: {
        title?: string
        incTags?: Tag[]
    }
    generic: {
    }
    tag: {
    }
}

export const SearchPropsState = React.createContext<{
    searchProp: SearchPropsType
    setSearchProp: (value: SearchPropsType) => void
}>(
    {
        searchProp: {main: {}, generic: {}, tag:{}},
        setSearchProp: (v) => {}
    }
)

export interface Image {
    image_id: number
    title?: string
    extension: string
}

export default App;
