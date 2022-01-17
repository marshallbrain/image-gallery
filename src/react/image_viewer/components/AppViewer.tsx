import React, {useEffect} from 'react/index';
import {channels} from "@utils/ipcCommands";
import {SpeedDial, SpeedDialAction, SpeedDialIcon, styled} from "@mui/material";
import SettingsIcon from '@mui/icons-material/Settings';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import EditAttributesIcon from '@mui/icons-material/EditAttributes';
import {KeyboardEvent, useState} from "react";
import MetadataEdit from "./MetadataEdit";

const drawerWidth = 240;

function AppViewer() {

    const [index, setIndex] = React.useState(-1)
    const [images, setImages] = React.useState<Image[]>([])
    const [info, setInfo] = React.useState<Image|null>(null)
    const [editOpen, setEditOpen] = useState(false)

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

    const keyPressEvent = (e: KeyboardEvent) => {
        e.preventDefault()
        // console.log(e.key)
        if (e.key === "ArrowRight" && index+1 < images.length) {
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
        <View onKeyDown={keyPressEvent} tabIndex={0}>
            <ImageContainer open={editOpen}>
                {(info) && <ImageDisplay
                    key={info.image_id}
                    src={`image://${info.image_id}.${info.extension}`}
                    alt={info.title}
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
            <MetadataEdit editOpen={editOpen} drawerWidth={drawerWidth}/>
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
    "&:focus": {
        outline: "none",
    },
})

interface Image {
    image_id: number,
    extension: string
    title: string
}

export default AppViewer;
