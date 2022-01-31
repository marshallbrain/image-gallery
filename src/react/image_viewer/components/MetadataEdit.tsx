import {Chip, Divider, Drawer, ListItem, Paper, Stack, styled, TextField} from '@mui/material';
import React, {KeyboardEvent, useEffect} from 'react';
import {ImageData} from "./AppViewer";
import {channels} from "@utils/ipcCommands";
import sqlQueries from "@utils/sqlQueries";
import {FixedSizeList, ListChildComponentProps} from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import TagSelector from "./TagSelector";

const MetadataEdit = (props: PropTypes) => {

    const {editOpen, drawerWidth, imageData} = props

    const [title, setTitle] = React.useState(imageData? imageData?.title : "Undefined");
    const [imageTags, setImageTags] = React.useState<Set<string>>(new Set())

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
            <Stack
                direction="column"
                justifyContent="center"
                alignItems="stretch"
                spacing={2}
                sx={{
                    padding: 2
                }}
            >
                <TagSelector/>
            </Stack>
        </Drawer>
    )
}

interface PropTypes {
    editOpen: boolean,
    drawerWidth: number,
    imageData: ImageData|null,
}

export default MetadataEdit;
