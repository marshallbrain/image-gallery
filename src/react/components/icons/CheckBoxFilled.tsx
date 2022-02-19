import {createSvgIcon} from "@mui/material";
import React from "react";

export default createSvgIcon(
    [
        <path key={1} d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2z"/>,
        <path key={2} d="M17.99 9l-1.41-1.42-6.59 6.59-2.58-2.57-1.42 1.41 4 3.99z" fill={"black"}/>
    ],
    'CheckBox Filled',
)
