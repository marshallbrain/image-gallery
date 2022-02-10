import React, {useEffect, useState} from 'react';
import {
    Autocomplete,
    AutocompleteChangeDetails,
    AutocompleteChangeReason,
    Chip,
    SxProps,
    TextField, Theme
} from "@mui/material";
import {useGetQuery} from "@components/utilities";
import getQueries, {GetQuery} from "../../queries/getQueries";
import _ from "lodash";

const AsyncSelect = (props: PropTypes) => {

    const {
        values,
        optionsQuery,
        onChange,
        freeSolo,
        ...other
    } = props

    const [searchValue, setSearchValue] = useState("")

    const [options] = useGetQuery<ChipBase>(optionsQuery, [searchValue], {search: searchValue})

    return (
        <Autocomplete
            {...other}
            multiple
            filterSelectedOptions
            disableCloseOnSelect
            autoHighlight
            value={values}
            options={options}
            onChange={onChange}
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
                if (freeSolo && inputValue !== '' && !isExisting) {
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
    freeSolo?: boolean
    sx?: SxProps<Theme>

    values: ChipBase[]
    optionsQuery: GetQuery
    onChange: (
        event: React.SyntheticEvent,
        value: (string | ChipBase)[],
        reason: AutocompleteChangeReason,
        details: AutocompleteChangeDetails<ChipBase> | undefined
    ) => void
}

interface ChipBase {
    name: string
    value?: string
}

export default AsyncSelect
