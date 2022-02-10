import React from 'react';
import ChipSelector from "./ChipSelector";
import {GetQuery} from "../../queries/getQueries";
import {ChipBase} from "./TagSelector";
import {AutocompleteChangeDetails, AutocompleteChangeReason} from "@mui/material";

const ControlSelector = (props: PropTypes) => {

    const {values, optionsQuery} = props

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
            onChange(value as ChipBase[])
    }

    return (
        <ChipSelector
            values={values}
            optionsQuery={optionsQuery}
            onChange={onChangeValue}
        />
    )
}

interface PropTypes {
    values: ChipBase[]
    optionsQuery: GetQuery

    onChange?: (chip: ChipBase[] | undefined) => void
}

export default ControlSelector
