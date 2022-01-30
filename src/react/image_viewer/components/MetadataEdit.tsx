import {Chip, Divider, Drawer, ListItem, Paper, Stack, styled, TextField} from '@mui/material';
import React, {KeyboardEvent, useEffect} from 'react';
import {ImageData} from "./AppViewer";
import {channels} from "@utils/ipcCommands";
import sqlQueries from "@utils/sqlQueries";
import {FixedSizeList, ListChildComponentProps} from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

const MetadataEdit = (props: PropTypes) => {

    const {editOpen, drawerWidth, imageData} = props

    const [title, setTitle] = React.useState(imageData? imageData?.title : "Undefined");
    const [imageTags, setImageTags] = React.useState<Set<string>>(new Set())
    const [tagsOrdered, setTagsOrdered] = React.useState<string[]>([])
    const [tags, setTags] = React.useState<{ [index: string]: {} }>({})
    const [tagSearch, setTagSearch] = React.useState("")

    useEffect(() => {
        updateTags()
        window.api.receive(channels.updateTagLists, () => {
            updateTags()
        })
    }, [])

    useEffect(() => {
        setTitle(imageData? imageData?.title : "Undefined")
    }, [imageData])

    useEffect(() => {
        updateTags()
    }, [tagSearch])

    const updateTags = () => {
        window.api.db.getImages(sqlQueries.getTags, (data: {name: string}[]) => {
            setTagsOrdered([
                ...((tagSearch == "" || (data.length && tagSearch == data[0].name))? []: [""]),
                ...data.flatMap((({name}) => name))
            ])
        }, {name: tagSearch})
    }

    const onSearchTags = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTagSearch(event.target.value);
    }

    const selectTag = (tag: string) => () => {
        if (tagSearch == "") return
        window.api.db.getImages(sqlQueries.createTag, () => {}, tag)
    }

    // <Chip label={tagSearch} color={"success"} onClick={selectTag(tagSearch)}/>
    const renderTags = ({ index, style }: ListChildComponentProps) => (
        <ListItem style={style} key={index} component="div" disablePadding>
            {(tagsOrdered[index] === "")?
                <Chip
                    label={tagSearch}
                    color={"success"}
                    onClick={selectTag(tagSearch)}/>:
                <Chip
                    label={tagsOrdered[index]}
                    onClick={selectTag(tagsOrdered[index])}
                />
            }
        </ListItem>
    )

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
                <Paper
                    sx={{
                        p: 1,
                        pb: 0
                    }}
                >
                    <TextField
                        label="Search Tags"
                        variant="standard"
                        value={tagSearch}
                        onChange={onSearchTags}
                        onKeyDown={(e: KeyboardEvent) => {
                            if (e.key === "Enter") {
                                e.preventDefault()
                                selectTag(tagSearch)()
                            }
                        }}
                    />
                    <View>
                        <AutoSizer>
                            {({height, width}) => (
                                <FixedSizeList
                                    height={height}
                                    width={width}
                                    itemSize={42}
                                    itemCount={tagsOrdered.length}
                                    overscanCount={5}
                                    style={{
                                    }}
                                >
                                    {renderTags}
                                </FixedSizeList>
                            )}
                        </AutoSizer>
                    </View>
                </Paper>
            </Stack>
        </Drawer>
    )
}

interface PropTypes {
    editOpen: boolean,
    drawerWidth: number,
    imageData: ImageData|null,
}

const View = styled("div")({
    minHeight: 300,
})

export default MetadataEdit;
