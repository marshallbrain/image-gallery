import React from 'react';
import {TextField} from "@mui/material";

const AdvancedSearch = (props: PropTypes) => {

    const {
        title,
        changeTitle
    } = props

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
    title: string
    changeTitle: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export default AdvancedSearch
