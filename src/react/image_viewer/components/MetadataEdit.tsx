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
        window.api.db.getImages(sqlQueries.getTags, ([data]) => {
            console.log(data)
        }, {name: tagSearch})
    }, [])

    useEffect(() => {
        setTitle(imageData? imageData?.title : "Undefined")
    }, [imageData])

    const onSearchTags = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTagSearch(event.target.value);
    }

    const selectTag = (tag: string) => () => {
        console.log(tag)
    }

    const renderTags = ({ index, style }: ListChildComponentProps) => (
        <ListItem style={style} key={index} component="div" disablePadding>
            {(index == 0 && tagSearch && tagsOrdered[index] !== tagSearch) ?
                <Chip label={tagSearch} color={"success"} onClick={selectTag(tagSearch)}/>:
                <Chip
                    label={tagsOrdered[Math.max(index-1,0)]}
                    onClick={selectTag(tagsOrdered[Math.max(index-1,0)])}
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
                    <div
                        style={{
                            minHeight: 300
                        }}
                    >
                        <AutoSizer>
                            {({height, width}) => (
                                <FixedSizeList
                                    height={height}
                                    width={width}
                                    itemSize={42}
                                    itemCount={+(tagSearch !== "") + tagsOrdered.length}
                                    overscanCount={5}
                                >
                                    {renderTags}
                                </FixedSizeList>
                            )}
                        </AutoSizer>
                    </div>
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

export default MetadataEdit;
