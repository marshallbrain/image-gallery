import React from 'react';
import PersistentDialogs from "./PersistentDialogs";
import ImageGallery from "@components/gallery/ImageGallery";
import AppViewer from "../image_viewer/components/AppViewer";

function App() {

    const [imageIndex, setImageIndex] = React.useState(-1)
    const [imageList, setImageList] = React.useState<Image[]>([])

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
                <ImageGallery onImageSelected={selectImage}/>
            }
        </React.Fragment>
    );
}

export interface Image {
    image_id: number
    title?: string
    extension: string
}

export default App;
