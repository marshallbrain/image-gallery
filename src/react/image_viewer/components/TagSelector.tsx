import React, {KeyboardEvent, useEffect} from 'react';
import {Chip, ListItem, Paper, styled, TextField} from "@mui/material";
import AutoSizer from "react-virtualized-auto-sizer";
import {FixedSizeList, ListChildComponentProps} from "react-window";
import {channels} from "@utils/ipcCommands";
import sqlQueries from "@utils/sqlQueries";
import {RunResult} from "better-sqlite3";

const TagSelector = (props: PropTypes) => {

    const {onTagSelected, selectedTags} = props

    const [tagSearch, setTagSearch] = React.useState("")
    const [tagsOrdered, setTagsOrdered] = React.useState<string[]>([])
    const [tags, setTags] = React.useState<{ [index: string]: {} }>({})

    useEffect(() => {
        updateTags()
        window.api.receive(channels.updateTagLists, () => {
            updateTags()
        })
    }, [])

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

    const selectTag = (tag: string) => () => {
        if (tag == "") return
        window.api.db.getImages(sqlQueries.createTag, (e) => {
            onTagSelected(tag)
        }, tag)
    }

    const onSearchTags = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTagSearch(event.target.value);
    }

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
        <React.Fragment>
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
                <TagList>
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
                </TagList>
            </Paper>
        </React.Fragment>
    );
};

const TagList = styled("div")({
    minHeight: 300,
})

interface PropTypes {
    onTagSelected: (tag: string) => void
    selectedTags: Set<string>
}

export default TagSelector;
