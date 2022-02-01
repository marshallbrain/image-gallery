import {
    Autocomplete,
    Chip,
    createFilterOptions,
    Divider,
    Drawer,
    ListItem,
    Paper,
    Stack,
    styled,
    TextField
} from '@mui/material';
import React, {KeyboardEvent, useEffect} from 'react';
import {ImageData} from "./AppViewer";
import {channels} from "@utils/ipcCommands";
import sqlQueries from "@utils/sqlQueries";
import {FixedSizeList, ListChildComponentProps} from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import TagSearch from "./TagSearch";
import TagList from "./TagList";
import TagSelector, {Tag} from "./TagSelector";
import {RunResult} from "better-sqlite3";

const MetadataEdit = (props: PropTypes) => {

    const {editOpen, drawerWidth, imageData} = props

    const [imageTags, setImageTags] = React.useState<Tag[]>([])
    const [tags, setTags] = React.useState<Tag[]>([])

    useEffect(() => {
        updateTags()
    }, [])

    useEffect(() => {
        updateImageTags()
    }, [imageData])

    const updateTags = () => {
        window.api.db.getImages(sqlQueries.getTags, (data: Tag[]) => {
            setTags(data)
        })
    }

    const updateImageTags = () => {
        window.api.db.getImages(sqlQueries.getImageTags, (tags: Tag[]) => {
            setImageTags(tags)
        }, imageData?.image_id)
    }

    const onModifyTags = (
        reason: "create" | "select" | "remove" | "clear"
    ) => (tag?: Tag) => {
        switch (reason) {
            case "create":
                window.api.db.getImages(sqlQueries.createTag, ({lastInsertRowid}: RunResult) => {
                    window.api.db.getImages(
                        sqlQueries.addImageTag, () => {
                            updateImageTags()
                        }, [imageData?.image_id, lastInsertRowid])
                    updateTags()
                }, tag?.value)
                break
            case "select":
                window.api.db.getImages(sqlQueries.addImageTag, () => {
                    updateImageTags()
                }, [imageData?.image_id, tag?.tag_id])
                break
            case "remove":
                window.api.db.getImages(sqlQueries.removeImageTag, () => {
                    updateImageTags()
                }, [imageData?.image_id, tag?.tag_id])
                break
            case "clear":
                window.api.db.getImages(sqlQueries.clearImageTag, () => {
                    updateImageTags()
                }, [imageData?.image_id])
                break
        }
    }

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
                    p: 2,
                    pt: 4,
                }}
            >
                <TagSelector
                    tags={tags}
                    selectedTags={imageTags}
                    onCreateTag={onModifyTags("create")}
                    onSelectTag={onModifyTags("select")}
                    onRemoveTag={onModifyTags("remove")}
                    onClear={onModifyTags("clear")}
                />
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
