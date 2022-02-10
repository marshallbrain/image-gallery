import React, {useEffect, useState} from 'react';
import {Autocomplete, AutocompleteChangeDetails, AutocompleteChangeReason, Chip, TextField} from "@mui/material";
import {useGetQuery} from "@components/utilities";
import getQueries, {GetQuery} from "../../queries/getQueries";
import _ from "lodash";

const AsyncSelect = (props: PropTypes) => {

    const {valueQuery, valueArgs, optionsQuery} = props

    const [searchValue, setSearchValue] = useState("")

    const [values, updateValues] = useGetQuery<ChipBase>(valueQuery, valueArgs, valueArgs)
    const [options] = useGetQuery<ChipBase>(optionsQuery, [searchValue], {search: searchValue})

    const onChangeValue = (
        event: React.SyntheticEvent,
        value: (string|ChipBase)[],
        reason: AutocompleteChangeReason,
        details: AutocompleteChangeDetails<ChipBase> | undefined
    ) => {
        const {
            onChange,
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
        else if (onChange)
            onChange(value as ChipBase[])
    }

    return (
        <Autocomplete
            multiple
            filterSelectedOptions
            disableCloseOnSelect
            freeSolo
            autoHighlight
            value={values}
            options={options}
            onChange={onChangeValue}
            getOptionLabel={option => option.name}
            isOptionEqualToValue={(option, value) => option.name === value.name}
            onInputChange={(event, value, reason) => {
                setSearchValue(value)
            }}
            filterOptions={(options, params) => {
                const { inputValue } = params;

                const isExisting = options.some((option) =>
                    inputValue.toLowerCase() === option.name.toLowerCase()
                );
                if (inputValue !== '' && !isExisting) {
                    return [...options, {
                        tag_id: 0,
                        name: `Create "${inputValue}"`,
                        value: inputValue
                    }]
                }

                return options;
            }}
            renderOption={(props, option) => (
                <li {...props}>
                    <Chip
                        label={option.name}
                        color={(option.value)? "success": "default"}
                        clickable
                    />
                </li>
            )}
            renderInput={(params) => (
                <TextField {...params} label={"Input"} />
            )}
            renderTags={(value, getTagProps) => {
                return value.map((option, index) => (
                    <Chip {...getTagProps({ index })} label={option.name} />
                ));
            }}
        />
    )
}

interface PropTypes {
    valueQuery: GetQuery
    valueArgs?: any[]
    optionsQuery: GetQuery

    onChange?: (chip: ChipBase[] | undefined) => void
    onCreateTag?: (chip: ChipBase) => Promise<null>
    onSelectTag?: (chip: ChipBase) => Promise<null>
    onRemoveTag?: (chip: ChipBase) => Promise<null>
    onClear?: () => Promise<null>
}

interface ChipBase {
    name: string
    value?: string
}

export default AsyncSelect
