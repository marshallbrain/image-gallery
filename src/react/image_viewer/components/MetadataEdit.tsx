import {Chip, Divider, Drawer, ListItem, Paper, Stack, styled, TextField} from '@mui/material';
import React, {KeyboardEvent, useEffect} from 'react';
import {ImageData} from "./AppViewer";
import {channels} from "@utils/ipcCommands";
import sqlQueries from "@utils/sqlQueries";
import {FixedSizeList, ListChildComponentProps} from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import TagSearch from "./TagSearch";
import TagList from "./TagList";

const MetadataEdit = (props: PropTypes) => {

    const {editOpen, drawerWidth, imageData} = props

    const [imageTags, setImageTags] = React.useState<Set<string>>(new Set())
    const [tagsOrdered, setTagsOrdered] = React.useState<string[]>([])

    let lastTagSearch = ""

    useEffect(() => {
        updateTags("")
        window.api.receive(channels.updateTagLists, () => {
            updateTags(lastTagSearch)
        })
    }, [])

    const updateTags = (search: string) => {
        lastTagSearch = search
        window.api.db.getImages(sqlQueries.getTags, (data: {name: string}[]) => {
            setTagsOrdered([
                ...data.flatMap((({name}) => name))
            ])
        }, {name: search})
    }

    useEffect(() => {
        if (imageData) {
            window.api.db.getImages(sqlQueries.getImageTags, (tag: {name: string}[]) => {
                setImageTags(new Set(tag.flatMap(({name}) => name)))
            }, imageData.image_id)
        }
    }, [imageData])

    const onTagSelected = (tag: string) => {
        window.api.db.getImages(sqlQueries.createTag, () => {
            window.api.db.getImages(sqlQueries.addImageTag, () => {
                setImageTags(new Set(imageTags.add(tag)))
            }, {image_id: imageData?.image_id, tag})
        }, tag)
    }

    const removeImageTag = (tag: string) => () => {
        window.api.db.getImages(sqlQueries.removeImageTag, (e) => {
            console.log(e)
            imageTags.delete(tag)
            setImageTags(new Set(imageTags))
        }, {image_id: imageData?.image_id, tag})
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
                    padding: 2
                }}
            >
                {imageTags.size > 0 &&
                    <TagList
                        tags={[...imageTags]}
                        removeTag={removeImageTag}
                    />
                }
                <TagSearch
                    onTagSelected={onTagSelected}
                    selectedTags={imageTags}
                    onTagSearch={updateTags}
                    tags={tagsOrdered}
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
