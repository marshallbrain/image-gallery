import React from 'react';
import ChipSelector from "./ChipSelector";
import {GetQuery} from "../../queries/getQueries";
import {ChipBase} from "./TagSelector";
import {AutocompleteChangeDetails, AutocompleteChangeReason, SxProps, Theme} from "@mui/material";

const ControlSelector = (props: PropTypes) => {

    const {values, optionsQuery, ...other} = props

    const onChangeValue = (
        event: React.SyntheticEvent,
        value: (string|ChipBase)[],
        reason: AutocompleteChangeReason,
        details: AutocompleteChangeDetails<ChipBase> | undefined
    ) => {
        const {
            onChange
        } = props

        if (onChange)
            onChange((value.length > 0)? value as ChipBase[]: undefined)
    }

    return (
        <ChipSelector
            {...other}
            values={values || []}
            optionsQuery={optionsQuery}
            onChange={onChangeValue}
        />
    )
}

interface PropTypes {
    sx?: SxProps<Theme>

    values: ChipBase[]|undefined
    optionsQuery: GetQuery

    onChange: (chip: ChipBase[]|undefined) => void
}

export default ControlSelector
