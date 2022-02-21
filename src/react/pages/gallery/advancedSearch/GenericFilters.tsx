import React, {useContext, useEffect, useState} from 'react/index';
import {FormControlLabel, FormGroup, Switch, TextField} from "@mui/material";
import {toAny, useDefault} from "../../../utilities";
import {SearchPropsType} from "../../App";
import {SearchPropTemp} from "./AdvancedSearch";

const AdvancedSearch = (props: PropTypes) => {

    const {searchProp, setSearchProp} = useContext(SearchPropTemp)

    const [title, setTitle] = useState(useDefault(searchProp.generic?.title, ""))
    const [bookmark, setBookmark] = useState(useDefault(searchProp.generic?.bookmark, false))

    useEffect(() => {
        setSearchProp({
            generic: {
                title,
                bookmark
            }
        })
    }, [title, bookmark])

    const changeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value)
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

export const genericSearchMap = (search: SearchPropsType["generic"]): toAny<SearchPropsType>["generic"] => ({
    title: search?.title,
    bookmark: search?.bookmark
})

export default AdvancedSearch
