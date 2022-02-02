import React, {useEffect} from 'react/index';
import {channels} from "@utils/ipcCommands";
import {SpeedDial, SpeedDialAction, SpeedDialIcon, styled} from "@mui/material";
import SettingsIcon from '@mui/icons-material/Settings';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import EditAttributesIcon from '@mui/icons-material/EditAttributes';
import CloseIcon from '@mui/icons-material/Close';
import {KeyboardEvent, useState} from "react";
import MetadataEdit from "./MetadataEdit";
import sqlQueries from "@utils/sqlQueries";
import {Image} from "@components/App";

const drawerWidth = 240;

function AppViewer(props: PropTypes) {

    const {index, imageList, onIndexChange, onClose} = props

    const [image, setImage] = React.useState<Image|null>(null)
    const [imageData, setImageData] = React.useState<ImageData|null>(null)
    const [editOpen, setEditOpen] = useState(false)
    const [imageFull, setImageFull] = useState(false)

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

        if (e.key === "ArrowRight" && index+1 < imageList.length) {
            onIndexChange(index+1)
        }
        if (e.key === "ArrowLeft" && index > 0) {
            onIndexChange(index-1)
        }
    }

    const toggleEditMetadata = () => {
        setEditOpen(!editOpen)
    }

    const toggleImageFull = () => {
        setImageFull(!imageFull)
        console.log(imageFull)
    }

    return (
        <View>
            <ImageContainer tabIndex={0} open={editOpen} onKeyDown={keyPressEvent}>
                {(image) && <ImageDisplay
                    key={image.image_id}
                    src={`image://${image.image_id}.${image.extension}`}
                    landscape={(imageData)? (imageData.image_width > imageData.image_height): true}
                    fullscreen={imageFull}
                    onClick={toggleImageFull}
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
                    <SpeedDialAction
                        key={"Close"}
                        icon={<CloseIcon />}
                        tooltipTitle={"Close"}
                        onClick={onClose}
                    />
                </Options>
            </ImageContainer>
            <MetadataEdit editOpen={editOpen} drawerWidth={drawerWidth} imageData={imageData}/>
        </View>
    );
}

const ImageDisplay = styled("img", {
    shouldForwardProp: (prop) =>
        prop !== 'landscape' &&
        prop !== 'fullscreen'
})<{
    landscape: boolean
    fullscreen: boolean
}>(
    ({theme, landscape, fullscreen}) => (
        (fullscreen)? {
            height: (landscape)? "100vh": "100%",
            width: (landscape)? "auto": "100%",
            alignSelf: "flex-start"
        }: {
            "max-height": "100vh",
            "max-width": "100%",
        }
    )
)

const ImageContainer = styled("div", {
    shouldForwardProp: (prop) => prop !== 'open'
})<{
    open: boolean
}>(
    ({theme, open}) => ({
        "min-height": "100vh",
        display: "flex",
        flexDirection: "column",
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

interface PropTypes {
    index: number
    imageList: Image[]
    onIndexChange: (index: number) => void
    onClose: () => void
}

export interface ImageData {
    image_id: number,
    title: string,
    image_width: number,
    image_height: number,
}

export default AppViewer;
