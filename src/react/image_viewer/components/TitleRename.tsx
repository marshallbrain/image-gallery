import React from 'react';
import {Dialog} from "@mui/material";

const TitleRename = (props: PropTypes) => {

    const {open, toggleTR} = props

    return (
        <Dialog open={open}>
        </Dialog>
    )
}

interface PropTypes {
    open: boolean
    toggleTR: () => void
}

export default TitleRename
