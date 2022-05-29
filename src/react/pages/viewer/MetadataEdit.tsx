import {Drawer, Stack, TextField} from '@mui/material';
import React, {useEffect, useState} from 'react/index';
import {ImageData} from "./ImageViewer";
import getQueries from "../../queries/getQueries";
import AsyncSelect from "@components/selectors/AsyncSelect";
import runQueries from "../../queries/runQueries";
import {getQuery, runQuery, useQuery} from "@components/hooks/sqlHooks";

const MetadataEdit = (props: PropTypes) => {

    const {editOpen, drawerWidth, imageData} = props

    const [author] = useQuery<{author: string}>(getQueries.image.getAuthor, [imageData], [imageData?.image_id])

    const updateImageTags = (
        reason: "create" | "select" | "remove" | "clear"
    ) => (tag?: { tag_id?: string, value?: string }): Promise<any> => {
        switch (reason) {
            case "create":
                return runQuery(runQueries.tag.createTag, [tag?.value]).then((value) => {
                    return runQuery(runQueries.tag.addImageTag, [imageData?.image_id, value])
                })
            case "select":
                return runQuery(runQueries.tag.addImageTag, [imageData?.image_id, tag?.tag_id])
            case "remove":
                return runQuery(runQueries.tag.removeImageTag, [imageData?.image_id, tag?.tag_id])
            case "clear":
                return runQuery(runQueries.tag.clearImageTag, [imageData?.image_id])
        }
    }

    const updateImageCollection = (
        reason: "create" | "select" | "remove" | "clear"
    ) => (tag?: { collection_id?: string, value?: string }): Promise<any> => {
        switch (reason) {
            case "create":
                return runQuery(runQueries.collections.createCollection,
                    [tag?.value]).then((value) => {
                    return runQuery(runQueries.collections.addImageCollection, [imageData?.image_id, value])
                })
            case "select":
                return runQuery(runQueries.collections.addImageCollection,
                    [imageData?.image_id, tag?.collection_id])
            case "remove":
                return runQuery(runQueries.collections.removeImageCollection,
                    [imageData?.image_id, tag?.collection_id])
            case "clear":
                return runQuery(runQueries.collections.clearImageCollection, [imageData?.image_id])
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
                <TextField
                    label="Author"
                    value={(author.length > 0)? author[0].author: "placeholder"}
                    InputProps={{
                        readOnly: true,
                    }}
                />
                <AsyncSelect
                    optionsQuery={getQueries.tag.getTags}
                    valueQuery={getQueries.tag.getImageTags}
                    valueArgs={[imageData?.image_id]}
                    onSelectTag={updateImageTags("select")}
                    onCreateTag={updateImageTags("create")}
                    onRemoveTag={updateImageTags("remove")}
                    onClear={updateImageTags("clear")}
                />

                <AsyncSelect
                    optionsQuery={getQueries.collections.getCollections}
                    valueQuery={getQueries.collections.getImageCollections}
                    valueArgs={[imageData?.image_id]}
                    onSelectTag={updateImageCollection("select")}
                    onCreateTag={updateImageCollection("create")}
                    onRemoveTag={updateImageCollection("remove")}
                    onClear={updateImageCollection("clear")}
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
