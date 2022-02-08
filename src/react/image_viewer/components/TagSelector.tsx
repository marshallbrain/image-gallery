import React from 'react';
import {
    Autocomplete,
    AutocompleteChangeDetails,
    AutocompleteChangeReason,
    Chip,
    createFilterOptions, SxProps,
    TextField, Theme
} from "@mui/material";
import {orDefault} from "@components/utilities";
import _ from "lodash";

const TagSelector = <T extends ChipBase>(props: PropTypes<T>) => {

    const {
        onCreateTag,
        onSelectTag,
        onRemoveTag,
        onClear,
        freeSolo,
        sx,
        disabled,
    } = props

    const onChangeValue = (
        event: React.SyntheticEvent,
        newValue: (string | T)[],
        reason: AutocompleteChangeReason,
        details: AutocompleteChangeDetails<T> | undefined
    ) => {
        if (reason === "createOption" && onCreateTag)
            onCreateTag({name: "", value: details?.option as unknown as string})
        else if (reason === "selectOption" && onSelectTag)
            onSelectTag(details?.option as T)
        else if (reason === "removeOption" && onRemoveTag)
            onRemoveTag(details?.option as T)
        else if (reason === "clear" && onClear)
            onClear()
        else {
            props.onChange((newValue.length > 0)? newValue as T[]: undefined)
        }

    }

    return (
        <Autocomplete
            {...{freeSolo, sx, disabled}}
            value={orDefault(props.selectedChips, [])}
            options={props.chips}
            onChange={onChangeValue}
            limitTags={props.limitTags}
            clearOnBlur
            disableCloseOnSelect
            filterSelectedOptions
            handleHomeEndKeys
            multiple
            selectOnFocus
            getOptionLabel={option => option.name}
            isOptionEqualToValue={(option, value) => option.name === value.name}
            filterOptions={(options, params) => {
                const without = props.excludeChips? _.without(options, ...props.excludeChips): options
                const filtered = filter(without, params);
                const { inputValue } = params;

                if (freeSolo) {
                    const isExisting = options.some((option) => inputValue === option.name);
                    if (inputValue !== '' && !isExisting) {
                        return [...filtered, {
                            tag_id: 0,
                            name: `Create "${inputValue}"`,
                            value: inputValue
                        }]
                    }
                }

                return filtered;
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
                <TextField {...params} label={props.label} />
            )}
            renderTags={(value, getTagProps) => {
                return value.map((option, index) => (
                    <Chip {...getTagProps({ index })} label={option.name} />
                ));
            }}
        />
    );
};

const filter = createFilterOptions<any & ChipBase>({ignoreCase: true, stringify: option => option.name});

interface PropTypes<T extends ChipBase> {
    freeSolo?: boolean
    disabled?: boolean

    label: string
    limitTags?: number
    chips: T[]
    selectedChips?: T[]
    excludeChips?: T[]

    onChange: (chip: T[] | undefined) => void
    onCreateTag?: (chip: ChipBase) => void
    onSelectTag?: (chip: T) => void
    onRemoveTag?: (chip: T) => void
    onClear?: () => void

    sx?: SxProps<Theme>
}

export interface ChipBase {
    name: string
    value?: string
}

export default TagSelector;
