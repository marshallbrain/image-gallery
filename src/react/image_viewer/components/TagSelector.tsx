import React from 'react';
import {
    Autocomplete,
    AutocompleteChangeDetails,
    AutocompleteChangeReason,
    Chip,
    createFilterOptions, SxProps,
    TextField, Theme
} from "@mui/material";

const TagSelector = (props: PropTypes) => {

    const {
        onCreateTag,
        onSelectTag,
        onRemoveTag,
        onClear,
        freeSolo,
        sx,
    } = props

    const onChangeValue = (
        event: React.SyntheticEvent,
        newValue: (string | Tag)[],
        reason: AutocompleteChangeReason,
        details: AutocompleteChangeDetails<Tag> | undefined
    ) => {
        if (reason === "createOption" && onCreateTag)
            onCreateTag({name: "", value: details?.option as unknown as string})
        else if (reason === "selectOption" && onSelectTag)
            onSelectTag(details?.option as Tag)
        else if (reason === "removeOption" && onRemoveTag)
            onRemoveTag(details?.option as Tag)
        else if (reason === "clear" && onClear)
            onClear()
        else {
            props.onChange(newValue as Tag[])
        }

    }

    return (
        <Autocomplete
            {...{freeSolo, sx}}
            value={props.selectedTags}
            options={props.tags}
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
                const filtered = filter(options, params);
                const { inputValue } = params;

                if (freeSolo) {
                    const isExisting = options.some((option) => inputValue === option.name);
                    if (inputValue !== '' && !isExisting) {
                        return [{
                            tag_id: 0,
                            name: `Create "${inputValue}"`,
                            value: inputValue
                        }, ...filtered]
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

const filter = createFilterOptions<Tag>({ignoreCase: true, stringify: option => option.name});

interface PropTypes {
    freeSolo?: boolean

    label: string
    limitTags?: number
    tags: Tag[]
    selectedTags: Tag[]

    onChange: (tag: Tag[]) => void
    onCreateTag?: (tag: Tag) => void
    onSelectTag?: (tag: Tag) => void
    onRemoveTag?: (tag: Tag) => void
    onClear?: () => void

    sx?: SxProps<Theme>
}

export interface Tag {
    name: string
    value?: string
}

export default TagSelector;
