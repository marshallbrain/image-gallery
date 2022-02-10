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
import TagSelector, {ChipBase} from "./TagSelector";
import {RunResult} from "better-sqlite3";
import {setQuery, useGetQuery} from "@components/utilities";
import getQueries from "../../queries/getQueries";
import AsyncSelect from "./AsyncSelect";

const MetadataEdit = (props: PropTypes) => {

    const {editOpen, drawerWidth, imageData} = props

    const [imageTags, setImageTags] = React.useState<ChipBase[]>([])
    const [imageCollections, setImageCollections] = React.useState<ChipBase[]>([])
    const [collections, setCollections] = React.useState<ChipBase[]>([])

    /*const [tags, updateTags] = useGetQuery<ChipBase>(
        getQueries.tag.getTags,
        [],
        []
    )

    useEffect(() => {
        updateTags()
        updateCollections()
    }, [])

    useEffect(() => {
        updateImageTags()
        updateImageCollections()
    }, [imageData])

    const updateImageTags = () => {
        window.api.db.getImages(sqlQueries.getImageTags, (tags: ChipBase[]) => {
            setImageTags(tags)
        }, imageData?.image_id)
    }

    const updateCollections = () => {
        window.api.db.getImages(sqlQueries.getCollections, (data: ChipBase[]) => {
            setCollections(data)
        })
    }

    const updateImageCollections = () => {
        window.api.db.getImages(sqlQueries.getImageCollections, (collections: ChipBase[]) => {
            setImageCollections(collections)
        }, imageData?.image_id)*!/
    }

    const onModifyTags = (
        reason: "select" | "remove" | "clear"
    ) => (tag?: { tag_id?: string, value?: string }) => {
        switch (reason) {
            case "select":
                if (tag?.value) {
                    window.api.db.getImages(sqlQueries.createTag, ({lastInsertRowid}: RunResult) => {
                        if (lastInsertRowid) {
                            window.api.db.getImages(
                                sqlQueries.addImageTag, () => {
                                    updateImageTags()
                                }, [imageData?.image_id, lastInsertRowid])
                            updateTags()
                        } else {
                            window.api.db.getImages(
                                sqlQueries.addImageTagName, () => {
                                    updateImageTags()
                                }, [imageData?.image_id, tag.value])
                        }
                    }, tag?.value)
                } else {
                    window.api.db.getImages(sqlQueries.addImageTag, () => {
                        updateImageTags()
                    }, [imageData?.image_id, tag?.tag_id])
                }
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

    const onModifyCollections = (
        reason: "create" | "select" | "remove" | "clear"
    ) => (collection?: { collection_id?: string, value?: string }) => {
        switch (reason) {
            case "select":
                if (collection?.value) {
                    window.api.db.getImages(sqlQueries.createCollection, ({lastInsertRowid}: RunResult) => {
                        window.api.db.getImages(
                            sqlQueries.addImageCollection, () => {
                                updateImageCollections()
                            }, [imageData?.image_id, lastInsertRowid])
                        updateCollections()
                    }, collection?.value)
                } else {
                    window.api.db.getImages(sqlQueries.addImageCollection, () => {
                        updateImageCollections()
                    }, [imageData?.image_id, collection?.collection_id])
                }
                break
            case "remove":
                window.api.db.getImages(sqlQueries.removeImageCollection, () => {
                    updateImageCollections()
                }, [imageData?.image_id, collection?.collection_id])
                break
            case "clear":
                window.api.db.getImages(sqlQueries.clearImageCollection, () => {
                    updateImageCollections()
                }, [imageData?.image_id])
                break
        }
    }*/

    const updateImageTags = (
        reason: "create" | "select" | "remove" | "clear"
    ) => (tag?: { tag_id?: string, value?: string }) => {
        switch (reason) {
            case "select": {
                setQuery(getQueries.tag.addImageTag, [imageData?.image_id, tag?.tag_id])
            }
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
                <AsyncSelect
                    optionsQuery={getQueries.tag.getTags}
                    valueQuery={getQueries.tag.getImageTags}
                    valueArgs={[imageData?.image_id]}
                    onSelectTag={updateImageTags("select")}
                />
            </Stack>
        </Drawer>
    )
}

interface PropTypes {
    editOpen: boolean,
    drawerWidth: number,
    imageData: ImageData | null,
}

export default MetadataEdit;
