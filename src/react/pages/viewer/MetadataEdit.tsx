import {Drawer, Stack} from '@mui/material';
import React from 'react/index';
import {ImageData} from "./ImageViewer";
import {ChipBase} from "../../image_viewer/components/TagSelector";
import getQueries from "../../queries/getQueries";
import AsyncSelect from "@components/selectors/AsyncSelect";
import runQueries from "../../queries/runQueries";
import {runQuery} from "@components/hooks/sqlHooks";

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