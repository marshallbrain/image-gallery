import React, {useState} from 'react/index';
import {
    Autocomplete,
    AutocompleteChangeDetails,
    AutocompleteChangeReason,
    Chip,
    SxProps,
    TextField,
    Theme
} from "@mui/material";
import {GetQuery} from "../../queries/getQueries";
import _ from "lodash";
import {useQuery} from "@components/hooks/sqlHooks";

const AsyncSelect = (props: PropTypes) => {

    const {
        values,
        optionsQuery,
        onChange,
        freeSolo,
        ...other
    } = props

    const [searchValue, setSearchValue] = useState("")

    const [options] = useQuery<ChipBase>(optionsQuery, [searchValue], {search: searchValue})

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
                const {inputValue} = params;
                const filtered = props.exclude ? _.without(options, ...props.exclude) : options

                const isExisting = filtered.some((option) =>
                    inputValue.toLowerCase() === option.name.toLowerCase()
                );
                if (freeSolo && inputValue !== '' && !isExisting) {
                    return [...filtered, {
                        tag_id: 0,
                        name: `Create "${inputValue}"`,
                        value: inputValue
                    }]
                }

                return filtered;
            }}
            renderOption={(props, option) => (
                <li {...props}>
                    <Chip
                        label={option.name}
                        color={(option.value) ? "success" : "default"}
                        clickable
                    />
                </li>
            )}
            renderInput={(params) => (
                <TextField {...params} label={"Input"}/>
            )}
            renderTags={(value, getTagProps) => {
                return value.map((option, index) => (
                    <Chip {...getTagProps({index})} label={option.name}/>
                ));
            }}
        />
    )
}

interface PropTypes {
    freeSolo?: boolean
    sx?: SxProps<Theme>
    disabled?: boolean

    values: ChipBase[]
    optionsQuery: GetQuery
    exclude?: ChipBase[]

    onChange: (
        event: React.SyntheticEvent,
        value: (string | ChipBase)[],
        reason: AutocompleteChangeReason,
        details: AutocompleteChangeDetails<ChipBase> | undefined
    ) => void
}

export interface ChipBase {
    name: string
    value?: string
}

export default AsyncSelect
