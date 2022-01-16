import React, {useEffect} from 'react/index';
import {channels} from "@utils/ipcCommands";
import {SpeedDial, SpeedDialAction, SpeedDialIcon, styled} from "@mui/material";
import SettingsIcon from '@mui/icons-material/Settings';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

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
    }, [])

    useEffect(() => {
        setInfo(images[index])
    }, [index])

    return (
        <div>
            <ImageContainer>
                {(info) && <ImageDisplay
                    key={info.image_id}
                    src={`image://${info.image_id}.${info.extension}`}
                    alt={info.title}
                />}
            </ImageContainer>
        </div>
    );
}

const ImageDisplay = styled("img")({
    "max-height": "100vh",
    "max-width": "100vw",
})

const ImageContainer = styled("div")({
    "min-height": "100vh",
    display: "flex",
    "justify-content": "center",
    "align-items": "center",
})

interface Image {
    image_id: number,
    extension: string
    title: string
}

export default AppViewer;
