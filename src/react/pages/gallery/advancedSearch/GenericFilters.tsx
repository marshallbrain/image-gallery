import React, {useContext, useEffect, useState} from 'react/index';
import {TextField} from "@mui/material";
import {toAny, useDefault} from "../../../utilities";
import {SearchPropsType} from "../../App";
import {SearchPropTemp} from "./AdvancedSearch";

const AdvancedSearch = (props: PropTypes) => {

    const {searchProp, setSearchProp} = useContext(SearchPropTemp)

    const [title, setTitle] = useState(useDefault(searchProp.generic?.title, ""))

    useEffect(() => {
        setSearchProp({
            generic: {
                title
            }
        })
    }, [title])

    const changeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value)
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
        </React.Fragment>
    )
}

interface PropTypes {
}

export interface GenericSearchType {
    title?: string
}

export const genericSearchMap = (search: SearchPropsType["generic"]): toAny<SearchPropsType>["generic"] => ({
    title: search?.title
})

export default AdvancedSearch
