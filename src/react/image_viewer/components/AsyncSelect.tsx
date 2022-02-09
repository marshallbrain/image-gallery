import React, {useEffect, useState} from 'react';
import {Autocomplete, Chip, TextField} from "@mui/material";
import {useGetQuery} from "@components/utilities";
import getQueries from "../../queries/getQueries";

const AsyncSelect = (props: PropTypes) => {


    const [searchValue, setSearchValue] = useState("")
    const [options] = useGetQuery<ChipBase>(
        getQueries.tag.getTags,
        [searchValue],
        {search: searchValue}
    )

    console.log(options)

    return (
        <Autocomplete
            options={options}
            getOptionLabel={option => option.name}
            isOptionEqualToValue={(option, value) => option.name === value.name}
            onInputChange={(event, value, reason) => {
                setSearchValue(value)
            }}
            filterOptions={(x) => x}
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
}

interface ChipBase {
    name: string
    value?: string
}

export default AsyncSelect
