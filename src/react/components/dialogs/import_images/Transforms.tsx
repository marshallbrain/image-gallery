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
import {Metadata, Transform} from "./ImportImages";

export function Transforms(props: PropTypes) {

    const {transforms, setTransforms} = props

    const updateTransforms = (index: number, type: "prop" | "metadata", value: Metadata | string) => {
        if (type === "prop") {
            transforms[index].prop = value
        } else {
            transforms[index].metadata = value as Metadata
        }
        setTransforms([...transforms])
    }
    const addTransforms = () => {
        transforms.push({"prop": "", "metadata": Metadata.Empty})
        setTransforms([...transforms])
    }
    const removeTransforms = (index: number) => {
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
                    {transforms.map(({prop, metadata}: Transform, index: number) => {
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
                                        {Object.values(Metadata)
                                            .filter((value) => value != Metadata.Empty)
                                            .map(value => {
                                                return (
                                                    <MenuItem value={value} key={value}>
                                                        <span>{value}</span>
                                                    </MenuItem>
                                                )
                                            })
                                        }
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

interface PropTypes {
    transforms: Transform[]
    setTransforms: (transforms: Transform[]) => void
}
