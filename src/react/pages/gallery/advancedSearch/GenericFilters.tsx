import React, {useContext, useEffect, useState} from 'react/index';
import {FormControlLabel, FormGroup, Switch, TextField} from "@mui/material";
import {toAny, useDefault} from "../../../utilities";
import {SearchPropsType} from "../../App";
import {SearchPropTemp} from "./AdvancedSearch";

const AdvancedSearch = (props: PropTypes) => {

    const {searchProp, setSearchProp} = useContext(SearchPropTemp)

    const [title, setTitle] = useState(useDefault(searchProp.generic?.title, ""))
    const [author, setAuthor] = useState(useDefault(searchProp.generic?.author, ""))
    const [bookmark, setBookmark] = useState(useDefault(searchProp.generic?.bookmark, false))

    useEffect(() => {
        setSearchProp({
            generic: {
                title,
                author,
                bookmark
            }
        })
    }, [title, author, bookmark])

    const changeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value)
    }

    const changeAuthor = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAuthor(event.target.value)
    }

    const toggleBookmark = (event: React.ChangeEvent<HTMLInputElement>) => {
        setBookmark(event.target.checked);
    }

    return (
        <React.Fragment>
            <TextField
                value={title}
                label="Search Title"
                variant="outlined"
                onChange={changeTitle}
                fullWidth
            />
            <TextField
                value={author}
                label="Search Author"
                variant="outlined"
                onChange={changeAuthor}
                fullWidth
            />
            <FormGroup>
                <FormControlLabel
                    control={<Switch
                        checked={bookmark}
                        onChange={toggleBookmark}
                    />}
                    label="Show bookmarked images"/>
            </FormGroup>
        </React.Fragment>
    )
}

interface PropTypes {
}

export interface GenericSearchType {
    title?: string
}

export const genericSearchMap = (search: SearchPropsType["generic"]): toAny<SearchPropsType>["generic"] => {
    console.log(search)
    return {
        title: search?.title,
        author: search?.author,
        bookmark: search?.bookmark,
    }
}

export default AdvancedSearch
