import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    IconButton,
    Stack,
    TextField,
    Typography
} from "@material-ui/core";
import KeyboardArrowDownRoundedIcon from "@material-ui/icons/KeyboardArrowDownRounded";
import CloseRoundedIcon from "@material-ui/icons/CloseRounded";
import React from "react";
import {Filter} from "./ImportImages";

export function Filters(props: PropTypes) {
    
    const {filters, setFilters} = props
    
    const updateFilters = (index: number, type: "path" | "value", value: string) => {
        filters[index][type] = value
        setFilters([...filters])
    }
    const addFilter = () => {
        filters.push({"path": "", "value": ""})
        setFilters([...filters])
    }
    const removeFilter = (index: number) => {
        filters.splice(index, 1)
        setFilters([...filters])
    }
    
    return (
        <Accordion>
            <AccordionSummary expandIcon={<KeyboardArrowDownRoundedIcon/>}>
                <Typography>Filters</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Stack spacing={2}>
                    {filters.map(({path, value}, index) => {
                        return (
                            <Stack
                                direction={"row"}
                                spacing={1}
                                justifyContent="flex-start"
                                alignItems="center"
                                key={index}
                            >
                                <TextField
                                    label="Path"
                                    value={path}
                                    onChange={(event) => {
                                        updateFilters(index, "path", event.target.value)
                                    }}
                                    sx={{mr: 1}}
                                />
                                <TextField
                                    label="Value"
                                    value={value}
                                    onChange={(event) => {
                                        updateFilters(index, "value", event.target.value)
                                    }}
                                />
                                <IconButton onClick={() => {
                                    removeFilter(index)
                                }}>
                                    <CloseRoundedIcon/>
                                </IconButton>
                            </Stack>
                        )
                    })}
                </Stack>
                <Button
                    variant="contained"
                    onClick={addFilter}
                    sx={{mt: 2}}
                >
                    Add filter
                </Button>
            </AccordionDetails>
        </Accordion>
    )
}

interface PropTypes {
    filters: Filter[]
    setFilters: (filters: Filter[]) => void
}
