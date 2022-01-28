import {Drawer, styled, TextField} from '@mui/material';
import React, {useEffect} from 'react';
import {ImageData} from "./AppViewer";
import {channels} from "@utils/ipcCommands";

const MetadataEdit = (props: PropTypes) => {

    const {editOpen, drawerWidth, imageData} = props

    const [title, setTitle] = React.useState(imageData? imageData?.title : "Undefined");

    useEffect(() => {
        setTitle(imageData? imageData?.title : "Undefined")
    }, [imageData])

    return (
        <Drawer
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                },
            }}
            variant="persistent"
            anchor="right"
            open={editOpen}
        >
            <Pad>
                <TextField label="Title" variant="outlined" value={title}/>
            </Pad>
        </Drawer>
    )
}

const Pad = styled("div")({
    padding: 16,
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
})

interface PropTypes {
    editOpen: boolean,
    drawerWidth: number,
    imageData: ImageData|null,
}

export default MetadataEdit;
