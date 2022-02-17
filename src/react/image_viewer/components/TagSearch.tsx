import React, {KeyboardEvent, useEffect} from 'react';
import {Chip, ListItem, Paper, styled, TextField} from "@mui/material";
import AutoSizer from "react-virtualized-auto-sizer";
import {FixedSizeList, ListChildComponentProps} from "react-window";

const TagSearch = (props: PropTypes) => {

    const {
        tags,
        selectedTags,
        onTagSelected,
        onTagSearch,
    } = props

    const [search, setSearch] = React.useState("")
    const [filterTags, setFilterTags] = React.useState<string[]>([])

    useEffect(() => {
        setFilterTags(
            ((search == "" || (tags.length && search === tags[0])) ? [] : [""]).concat(
                tags.filter(value => !selectedTags.has(value))
            )
        )
    }, [tags, selectedTags])

    const onSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value)
        onTagSearch(event.target.value);
    }

    const selectTag = (tag: string) => () => {
        if (tag == "") return
        onTagSelected(tag)
    }

    const renderTags = ({index, style}: ListChildComponentProps) => (
        <ListItem style={style} key={index} component="div" disablePadding>
            {(filterTags[index] === "") ?
                <Chip
                    label={search}
                    color={"success"}
                    onClick={selectTag(search)}/> :
                <Chip
                    label={filterTags[index]}
                    onClick={selectTag(filterTags[index])}
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
                    value={search}
                    onChange={onSearch}
                    onKeyDown={(e: KeyboardEvent) => {
                        if (e.key === "Enter") {
                            e.preventDefault()
                            selectTag(search)()
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
                                itemCount={filterTags.length}
                                overscanCount={5}
                                style={{}}
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
    minHeight: 208,
})

interface PropTypes {
    tags: string[]
    selectedTags: Set<string>
    onTagSelected: (tag: string) => void
    onTagSearch: (tag: string) => void
}

export default TagSearch;
