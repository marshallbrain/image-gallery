import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography
} from "@material-ui/core";
import KeyboardArrowDownRoundedIcon from "@material-ui/icons/KeyboardArrowDownRounded";
import CloseRoundedIcon from "@material-ui/icons/CloseRounded";
import React from "react";

export function Transforms(props) {
    
    const metadataEntries = [
        "Title",
        "Tags",
        "Author",
        "Site",
        "Source"
    ]
    const {transforms, setTransforms} = props
    
    const updateTransforms = (index, type, value) => {
        transforms[index][type] = value
        setTransforms([...transforms])
    }
    const addTransforms = () => {
        transforms.push({"prop": "", "metadata": ""})
        setTransforms([...transforms])
    }
    const removeTransforms = (index) => {
        transforms.splice(index, 1)
        setTransforms([...transforms])
    }
    
    return (
        <Accordion>
            <AccordionSummary expandIcon={<KeyboardArrowDownRoundedIcon/>}>
                <Typography>Metadata Mapping</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Stack spacing={2}>
                    {transforms.map(({prop, metadata}, index) => {
                        return (
                            <Stack
                                direction={"row"}
                                spacing={1}
                                justifyContent="flex-start"
                                alignItems="center"
                                key={index}
                            >
                                <TextField
                                    label="Property"
                                    value={prop}
                                    onChange={(event) => {
                                        updateTransforms(index, "prop", event.target.value)
                                    }}
                                    sx={{mr: 1}}
                                />
                                <FormControl sx={{minWidth: 226}}>
                                    <InputLabel>Metadata entry</InputLabel>
                                    <Select
                                        label="Metadata entry"
                                        value={metadata}
                                        onChange={(event) => {
                                            updateTransforms(index, "metadata", event.target.value)
                                        }}
                                    >
                                        {metadataEntries.map((name) => {
                                            return (<MenuItem
                                                value={name.toLowerCase()}
                                                key={name.toLowerCase()}
                                            >
                                                <span>{name}</span>
                                            </MenuItem>)
                                        })}
                                    </Select>
                                </FormControl>
                                <IconButton onClick={() => {
                                    removeTransforms(index)
                                }}>
                                    <CloseRoundedIcon/>
                                </IconButton>
                            </Stack>
                        )
                    })}
                </Stack>
                <Button
                    variant="contained"
                    onClick={addTransforms}
                    sx={{mt: 2}}
                >
                    Add filter
                </Button>
            </AccordionDetails>
        </Accordion>
    )
    
}
