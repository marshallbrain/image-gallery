import React from 'react';
import {
    Autocomplete,
    AutocompleteChangeDetails,
    AutocompleteChangeReason,
    Chip,
    createFilterOptions,
    TextField
} from "@mui/material";

const TagSelector = (props: PropTypes) => {

    const {
        tags,
        selectedTags,
        onSelectTag,
        onRemoveTag,
        onClear
    } = props

    const onChange = (
        event: React.SyntheticEvent,
        newValue: (string | Tag)[],
        reason: AutocompleteChangeReason,
        details: AutocompleteChangeDetails<Tag> | undefined
    ) => {
        switch (reason) {
            case "selectOption":
                onSelectTag(details?.option as Tag)
                break
            case "removeOption":
                onRemoveTag(details?.option as Tag)
                break
            case "clear":
                onClear()
                break
        }
    }

    return (
        <Autocomplete
            value={selectedTags}
            options={tags}
            onChange={onChange}
            clearOnBlur
            disableCloseOnSelect
            filterSelectedOptions
            freeSolo
            handleHomeEndKeys
            multiple
            selectOnFocus
            getOptionLabel={option => option.name}
            isOptionEqualToValue={(option, value) => option.name === value.name}
            filterOptions={(options, params) => {
                const filtered = filter(options, params);
                const { inputValue } = params;

                const isExisting = options.some((option) => inputValue === option.name);
                if (inputValue !== '' && !isExisting) {
                    return [{
                        tag_id: 0,
                        name: `Create "${inputValue}"`,
                        value: inputValue
                    }, ...filtered]
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
                <TextField {...params} label="Image Tags" />
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
    tags: Tag[]
    selectedTags: Tag[]
    onSelectTag: (tag: Tag) => void
    onRemoveTag: (tag: Tag) => void
    onClear: () => void
}

export interface Tag {
    name: string
    value?: string
}

export default TagSelector;
