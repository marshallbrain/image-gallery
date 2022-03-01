import React, {KeyboardEvent, useEffect, useReducer, useRef, useState} from 'react/index';
import channels from "@utils/channels";
import {SpeedDial, SpeedDialAction, SpeedDialIcon, styled} from "@mui/material";
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import EditAttributesIcon from '@mui/icons-material/EditAttributes';
import CloseIcon from '@mui/icons-material/Close';
import MetadataEdit from "./MetadataEdit";
import {Image} from "../App";
import TitleRename from "@components/TitleRename";
import EditIcon from '@mui/icons-material/Edit';
import getQueries from "../../queries/getQueries";
import {runQuery, useQuery} from "@components/hooks/sqlHooks";
import {sendChannel} from "@components/hooks/channelHooks";
import runQueries from "../../queries/runQueries";
import {useSnackbar} from "@components/snackbar/Snackbar";

const drawerWidth = 450;

function ImageViewer(props: PropTypes) {

    const {index, imageList, onIndexChange, onClose} = props

    const queueMessage = useSnackbar()
    const [image, setImage] = useState<Image | null>(null)
    const [open, dispatch] = useReducer(toggleReducer, toggleBase)

    const [[imageData], updateData] = useQuery<ImageData>(getQueries.image.getImageData, [index], [imageList[index].image_id])

    const imageRef = useRef<HTMLDivElement>(null)

    const toggle = (type: ToggleKey) => () => {
        dispatch(type)
    }

    useEffect(() => {
        imageRef.current?.focus()
    }, [])

    useEffect(() => {
        setImage(imageList[index])
        sendChannel(channels.update.windowTitle, [imageList[index].title])
    }, [index])

    const keyPressEvent = (e: KeyboardEvent) => {
        if (e.key === "ArrowRight" && index + 1 < imageList.length) {
            e.preventDefault()
            onIndexChange(index + 1)
        }
        if (e.key === "ArrowLeft" && index > 0) {
            e.preventDefault()
            onIndexChange(index - 1)
        }
        if (e.key === " ") {
            toggleBookmark()
        }
    }

    const toggleBookmark = () => {
        if (imageData.bookmark) {
            runQuery(runQueries.image.unBookmark, {imageId: imageData.image_id}).then(() => {
                updateData()
                queueMessage("Unbookmarked image", "info")
            })
        } else {
            runQuery(runQueries.image.bookmark, {imageId: imageData.image_id}).then(() => {
                updateData()
                queueMessage("Bookmarked image", "info")
            })
        }
    }

    return (
        <View>
            <ImageContainer
                tabIndex={1}
                ref={imageRef}
                onKeyDown={keyPressEvent}
                open={open.metadata}
                landscape={(imageData) ? (imageData.image_width > imageData.image_height) : false}
            >
                {(image) && <ImageDisplay
                    key={image.image_id}
                    src={`image://${image.image_id}.${image.extension}`}
                    landscape={(imageData) ? (imageData.image_width > imageData.image_height) : false}
                    fullscreen={open.full}
                    onClick={() => {
                        sendChannel(channels.settings.toggleVisualZoom, [!open.full])
                        toggle("full")()
                    }}
                />}
                <Options
                    ariaLabel="speed-dial"
                    sx={{position: 'fixed', bottom: 16, right: 16}}
                    icon={
                        <SpeedDialIcon
                            icon={<MoreHorizIcon/>}
                            openIcon={(imageData && imageData.bookmark)?
                                <BookmarkIcon/>:
                                <BookmarkBorderIcon/>
                            }
                        />
                    }
                    onClose={((event, reason) => {
                        if (reason === "toggle") toggleBookmark()
                    })}
                    open={open.metadata}
                    FabProps={{tabIndex: -1}}
                >
                    <SpeedDialAction
                        key={"editMetadata"}
                        icon={<EditAttributesIcon/>}
                        tooltipTitle={"Edit metadata"}
                        onClick={toggle("metadata")}
                    />
                    <SpeedDialAction
                        key={"editTitle"}
                        icon={<EditIcon/>}
                        tooltipTitle={"Edit title"}
                        onClick={toggle("titleRename")}
                    />
                    <SpeedDialAction
                        key={"close"}
                        icon={<CloseIcon/>}
                        tooltipTitle={"Close"}
                        onClick={onClose}
                    />
                </Options>
            </ImageContainer>
            {imageData &&
                <MetadataEdit editOpen={open.metadata} drawerWidth={drawerWidth} imageData={imageData}/>
            }
            <TitleRename
                open={open.titleRename}
                toggleTR={toggle("titleRename")}
                title={imageData?.title}
                imageId={imageData?.image_id}
            />
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
        (fullscreen) ? {
            height: (landscape) ? "100vh" : "100%",
            width: (landscape) ? "auto" : "100%",
            padding: 0,
            alignSelf: "flex-start",
            margin: "auto",
        } : {
            maxHeight: "100vh",
            maxWidth: "100%",
        }
    )
)

const ImageContainer = styled("div", {
    shouldForwardProp: (prop) =>
        prop !== 'open' &&
        prop !== 'landscape'
})<{
    open: boolean
    landscape: boolean
}>(
    ({theme, open, landscape}) => ({
        minHeight: "100vh",
        maxHeight: "100vh",
        minWidth: "100%",
        overflowY: "auto",
        display: "flex",
        flexDirection: (landscape) ? "column" : "row",
        justifyContent: "center",
        alignItems: "center",
        transition: theme.transitions.create('padding', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        paddingRight: 0,
        "&:focus": {
            outline: "none",
        },
        ...(open && {
            transition: theme.transitions.create('padding', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            paddingRight: drawerWidth,
        }),
        "::-webkit-scrollbar": {
            // width: 0,
            // height: 0,
            display: "none"
        },
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
    "::-webkit-scrollbar": {
        // width: 0,
        // height: 0,
        display: "none"
    },
})

const toggleBase = {
    metadata: false,
    full: false,
    titleRename: false
}

type Toggle = typeof toggleBase
type ToggleKey = keyof Toggle

function toggleReducer(state: Toggle, action: ToggleKey): Toggle {
    switch (action) {
        case "metadata": return {...state, metadata: !state.metadata}
        case "full": return {...state, full: !state.full}
        case "titleRename": return {...state, titleRename: !state.titleRename}
    }
}

interface PropTypes {
    index: number
    imageList: Image[]
    onIndexChange: (index: number) => void
    onClose: () => void
}

export interface ImageData {
    image_id: number,
    title: string,
    bookmark: number,
    image_width: number,
    image_height: number,
}

export default ImageViewer;
