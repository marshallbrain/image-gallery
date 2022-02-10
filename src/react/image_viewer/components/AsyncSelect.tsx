import React from 'react';
import ChipSelector from "./ChipSelector";
import {GetQuery} from "../../queries/getQueries";
import {ChipBase} from "./TagSelector";
import {useGetQuery} from "@components/utilities";
import {AutocompleteChangeDetails, AutocompleteChangeReason} from "@mui/material";

const AsyncSelect = (props: PropTypes) => {

    const {valueQuery, valueArgs, optionsQuery} = props

    const [values, updateValues] = useGetQuery<ChipBase>(valueQuery, valueArgs, valueArgs)

    const onChangeValue = (
        event: React.SyntheticEvent,
        value: (string|ChipBase)[],
        reason: AutocompleteChangeReason,
        details: AutocompleteChangeDetails<ChipBase> | undefined
    ) => {
        const {
            onCreateTag,
            onSelectTag,
            onRemoveTag,
            onClear,
        } = props

        if (reason === "selectOption" && details?.option.value && onCreateTag)
            onCreateTag(details?.option).then(updateValues)
        else if (reason === "selectOption" && details && onSelectTag)
            onSelectTag(details?.option).then(updateValues)
        else if (reason === "removeOption" && details && onRemoveTag)
            onRemoveTag(details?.option).then(updateValues)
        else if (reason === "clear" && onClear)
            onClear().then(updateValues)
    }

    return (
        <ChipSelector
            freeSolo
            values={values}
            optionsQuery={optionsQuery}
            onChange={onChangeValue}
        />
    )
}

interface PropTypes {
    valueQuery: GetQuery
    valueArgs?: any[]
    optionsQuery: GetQuery

    onCreateTag?: (chip: ChipBase) => Promise<null>
    onSelectTag?: (chip: ChipBase) => Promise<null>
    onRemoveTag?: (chip: ChipBase) => Promise<null>
    onClear?: () => Promise<null>
}

export default AsyncSelect
