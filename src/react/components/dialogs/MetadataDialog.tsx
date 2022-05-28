import React from 'react';
import {
    AutocompleteChangeDetails,
    AutocompleteChangeReason,
    Button, Checkbox,
    DialogActions,
    DialogContent,
    DialogTitle, FormControl, FormControlLabel, FormGroup, InputLabel, MenuItem, Select, Stack,
} from "@mui/material";
import ControlSelector from "@components/selectors/ControlSelector";
import getQueries from "../../queries/getQueries";
import {getQuery, runQuery, useQuery} from "@components/hooks/sqlHooks";
import {ChipBase} from "@components/selectors/ChipSelector";
import {useEffect, useState} from "react";
import runQueries from "../../queries/runQueries";

const MetadataDialog = (props: PropTypes) => {

    const {onClose} = props

    const [tagMetadata, setTags] = useState<{
        oldTags: any[]
        newTags: any[]
    }>({
        oldTags: [],
        newTags: [],
    })

    const [collectionMetadata, setCollections] = useState<{
        oldCollections: any[]
        newCollections: any[]
    }>({
        oldCollections: [],
        newCollections: [],
    })

    useEffect(() => {
        getQuery(getQueries.tag.getCommonTags).then((tags) => {
            setTags({
                oldTags: tags,
                newTags: tags
            })
        })
        getQuery(getQueries.collections.getCommonCollections).then((collections) => {
            setCollections({
                oldCollections: collections,
                newCollections: collections
            })
        })
    }, [])

    const setNewTags = (tags: ChipBase[] | undefined) => {
        setTags({
            ...tagMetadata,
            newTags: tags || []
        })
    }

    const setNewCollections = (collections: ChipBase[] | undefined) => {
        setCollections({
            ...collectionMetadata,
            newCollections: collections || []
        })
    }

    const confirm = () => {
        const addTags: any[] = tagMetadata.newTags
        const removeTags: any[] = []
        const addCollections: any[] = collectionMetadata.newCollections
        const removeCollections: any[] = []

        tagMetadata.oldTags.forEach((value) => {
            const index = addTags.indexOf(value)
            console.log(index)
            if (index > -1) {
                addTags.splice(index, 1)
            } else {
                removeTags.push(value)
            }
        })

        collectionMetadata.oldCollections.forEach((value) => {
            const index = addCollections.indexOf(value)
            console.log(index)
            if (index > -1) {
                addCollections.splice(index, 1)
            } else {
                removeCollections.push(value)
            }
        })

        addTags.forEach((value) => {
            console.log("adding tag with id ", value.tag_id, " and name ", value.name)
            runQuery(runQueries.tag.selectedAddImageTag, [value.tag_id]).then()
        })

        removeTags.forEach((value) => {
            console.log("removing tag with id ", value.tag_id, " and name ", value.name)
            runQuery(runQueries.tag.selectedRemoveImageTag, [value.tag_id]).then()
        })

        addCollections.forEach((value) => {
            console.log("adding collection with id ", value.collection_id, " and name ", value.name)
            runQuery(runQueries.collections.selectedAddImageTag, [value.collection_id]).then()
        })

        removeCollections.forEach((value) => {
            console.log("removing collection with id ", value.collection_id, " and name ", value.name)
            runQuery(runQueries.collections.selectedRemoveImageTag, [value.collection_id]).then()
        })

        onClose()
    }

    return (
        <React.Fragment>
            <DialogTitle>Export Images</DialogTitle>
            <DialogContent>
                <Stack
                    direction="column"
                    justifyContent="center"
                    alignItems="stretch"
                    spacing={2}
                    sx={{pt: 2}}
                >
                    <ControlSelector
                        values={tagMetadata.newTags}
                        optionsQuery={getQueries.tag.getTags}
                        onChange={setNewTags}
                        sx={{
                            flexGrow: 1
                        }}
                    />
                    <ControlSelector
                        values={collectionMetadata.newCollections}
                        optionsQuery={getQueries.collections.getCollections}
                        onChange={setNewCollections}
                        sx={{
                            flexGrow: 1
                        }}
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={confirm}>Confirm</Button>
            </DialogActions>
        </React.Fragment>
    )
}

interface PropTypes {
    onClose: () => void
}

export default MetadataDialog
