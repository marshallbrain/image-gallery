import React, {useEffect} from 'react/index';
import {channels} from "@utils/ipcCommands";
import {SpeedDial, SpeedDialAction, SpeedDialIcon, styled} from "@mui/material";
import SettingsIcon from '@mui/icons-material/Settings';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import EditAttributesIcon from '@mui/icons-material/EditAttributes';
import {KeyboardEvent, useState} from "react";
import MetadataEdit from "./MetadataEdit";
import sqlQueries from "@utils/sqlQueries";

const drawerWidth = 240;

function AppViewer() {

    const [index, setIndex] = React.useState(-1)
    const [imageList, setImageList] = React.useState<Image[]>([])
    const [image, setImage] = React.useState<Image|null>(null)
    const [imageData, setImageData] = React.useState<ImageData|null>(null)
    const [editOpen, setEditOpen] = useState(false)

    useEffect(() => {
        const updateImageListKey = window.api.receive(channels.updateImageViewerList, (images, index) => {
            setImageList(images)
            setIndex(index)
        })
        window.api.send(channels.onImageViewerOpen)
        return function cleanup() {
            window.api.remove(channels.updateImageViewerList, updateImageListKey)
        };
    }, [])

    useEffect(() => {
        setImage(imageList[index])
        if(imageList[index] != undefined) {
            window.api.db.getImages(sqlQueries.getImageData, ([data]: ImageData[]) => {
                setImageData(data)
            }, imageList[index].image_id)
        }
    }, [index])

    const keyPressEvent = (e: KeyboardEvent) => {
        e.preventDefault()
        // console.log(e.key)
        if (e.key === "ArrowRight" && index+1 < imageList.length) {
            setIndex(index+1)
        }
        if (e.key === "ArrowLeft" && index > 0) {
            setIndex(index-1)
        }
    }

    const toggleEditMetadata = () => {
        setEditOpen(!editOpen)
    }

    return (
        <View>
            <ImageContainer tabIndex={0} open={editOpen} onKeyDown={keyPressEvent}>
                {(image) && <ImageDisplay
                    key={image.image_id}
                    src={`image://${image.image_id}.${image.extension}`}
                />}
                <Options
                    ariaLabel=""
                    sx={{ position: 'fixed', bottom: 16, right: 16 }}
                    icon={<SpeedDialIcon icon={<MoreHorizIcon />} openIcon={<BookmarkBorderIcon />} />}
                    open={editOpen}
                >
                    <SpeedDialAction
                        key={"Edit Metadata"}
                        icon={<EditAttributesIcon />}
                        tooltipTitle={"Edit Tags"}
                        onClick={toggleEditMetadata}
                    />
                    <SpeedDialAction
                        key={"Setting"}
                        icon={<SettingsIcon />}
                        tooltipTitle={"Setting"}
                    />
                </Options>
            </ImageContainer>
            <MetadataEdit editOpen={editOpen} drawerWidth={drawerWidth} imageData={imageData}/>
        </View>
    );
}

const ImageDisplay = styled("img")({
    "max-height": "100vh",
    "max-width": "100%",
})

const ImageContainer = styled("div", {
    shouldForwardProp: (prop) => prop !== 'open'
})<{
    open: boolean
}>(
    ({theme, open}) => ({
        "min-height": "100vh",
        display: "flex",
        "justify-content": "center",
        "align-items": "center",
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginRight: 0,
        "&:focus": {
            outline: "none",
        },
        ...(open && {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginRight: drawerWidth,
        }),
    })
)

const Options = styled(SpeedDial, {
    shouldForwardProp: (prop) => prop !== 'open'
})<{
    open: boolean
}>(
    ({theme, open}) => ({
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginRight: 0,
        ...(open && {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginRight: drawerWidth,
        }),
    })
)

const View = styled("div")({
})

interface Image {
    image_id: number,
    extension: string
}

export interface ImageData {
    title: string
}

export default AppViewer;
