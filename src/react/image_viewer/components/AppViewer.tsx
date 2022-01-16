import React, {useEffect} from 'react';
import {channels} from "@utils/ipcCommands";
import {styled} from "@mui/material";

function AppViewer() {

    const [index, setIndex] = React.useState(-1)
    const [images, setImages] = React.useState<Image[]>([])
    const [info, setInfo] = React.useState<Image|null>(null)

    useEffect(() => {
        window.api.receive(channels.updateImageViewerList, (images, index) => {
            setImages(images)
            setIndex(index)
        })
        window.api.send(channels.onImageViewerOpen)
        return function cleanup() {
            window.api.removeAll(channels.openImportDialog)
        };
    }, [])

    useEffect(() => {
        setInfo(images[index])
    }, [index])

    return (
        <div>
            {(info) && <ImageDisplay
                key={info.image_id}
                src={`image://${info.image_id}.${info.extension}`}
                alt={info.title}
            />}
        </div>
    );
}

const ImageDisplay = styled("img")({
    "max-height": "100vh",
    "max-width": "100vw",
    margin: "auto",
    display: "block",
})

interface Image {
    image_id: number,
    extension: string
    title: string
}

export default AppViewer;
