import React from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Stack,
    styled,
    TextField,
    Typography
} from "@mui/material";
import {Filters} from "./Filters";
import {Transforms} from "./Transforms";
import channels from "@utils/channels";
import {sendChannel} from "@components/hooks/channelHooks";

function ImportImages(props: PropTypes) {

    const {close, reimport} = props

    const [openDelete, setOpenDelete] = React.useState(false)
    const [mappers, setMappers] = React.useState<Mapper[]>([])
    const [mapper, setMapper] = React.useState(-1)
    const [name, setName] = React.useState(defaultMap.name)
    const [filters, setFilters] = React.useState<Filter[]>(defaultMap.filters)
    const [transforms, setTransforms] = React.useState<Transform[]>(defaultMap.transforms)
    const [files, setFiles] = React.useState<ImageFile[]>([])

    React.useEffect(() => {
        const data = window.api.savedStore.get("json mappings")
        if (data.length > 0) {
            setMappers(data)
            setMapper(0)
            setData(data[0])
        }
    }, [])
    React.useEffect(() => {
        if (name.length == 0) return
        const filtersClean = filters.filter(value => value.value != "" && value.path != "")
        const transformsClean = transforms.filter(value => value.prop != "" && value.metadata != "")
        const map: Mapper = {name: name.trim(), filters: filtersClean, transforms: transformsClean}
        if ((mapper == -1 || mappers.length == 0)) {
            mappers.push(map)
        } else if (mappers.length > 0) {
            mappers[mapper] = map
        }

        const newMaps = mappers.sort((a, b) => a.name.localeCompare(b.name))
        setMapper(newMaps.findIndex((e) => e === map))

        setMappers([...newMaps])
        if (mappers.length !== 0) {
            window.api.savedStore.set("json mappings", mappers)
        }
    }, [name, filters, transforms]);

    const handleOpenDelete = () => {
        setOpenDelete(true)
    }
    const handleCloseDelete = () => {
        setOpenDelete(false)
    }
    const deleteMapping = () => {
        mappers.splice(mappers.findIndex((e) => e.name === name), 1)
        setMappers([...mappers])
        window.api.savedStore.set("json mappings", mappers)
        if (mappers.length > 0) {
            setMapper(0);
            setData(mappers[0])
        } else {
            setMapper(-1);
            setData({
                name: "",
                filters: [{"path": "", "value": ""}],
                transforms: [{"prop": "", "metadata": ""}],
            })
        }

    }
    const handleSetMapper = (event: SelectChangeEvent) => {
        const index = Number(event.target.value)
        setMapper(index);
        if (index === -1) {
            setData({
                name: "",
                filters: [{"path": "", "value": ""}],
                transforms: [{"prop": "", "metadata": ""}],
            })
        } else {
            setData(mappers[index])
        }
    }
    const setData = (data: Mapper) => {
        setName(data.name)
        setFilters(data.filters)
        setTransforms(data.transforms)
    }
    const handleName = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    }
    const handleFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
        const rawFiles = event.target.files as FileList
        const files: ImageFile[] = []
        for (let i = 0; i < rawFiles.length; i++) {
            const f = rawFiles[i]
            files.push({name: f.name, path: f.path, type: f.type})
        }
        setFiles(files)
    }
    const importImages = () => {
        sendChannel(channels.execute.importImages, [files, mappers])
        close()
    }

    return (
        <React.Fragment>
            <DialogTitle>
                Import Images
            </DialogTitle>
            <DialogContent>
                <FormControl
                    variant="outlined"
                    fullWidth
                    sx={{mt: 2}}
                >
                    <InputLabel>Mappings</InputLabel>
                    <Select
                        label="Retrievers"
                        value={String(mapper)}
                        onChange={handleSetMapper}
                    >
                        {mappers.map((entry, index) => (
                            <MenuItem key={entry.name + index} value={index}>{entry.name}</MenuItem>
                        ))}
                        <MenuItem value={-1}>New Retriever</MenuItem>
                    </Select>
                </FormControl>
                <Divider sx={{marginTop: 2, marginBottom: 2}}/>
                <div>
                    <Stack spacing={2}>
                        <TextField
                            error={name.length === 0}
                            label="Mapper name"
                            required
                            variant="outlined"
                            value={name}
                            onChange={handleName}
                        />
                        <Filters filters={filters} setFilters={setFilters}/>
                        <Transforms transforms={transforms} setTransforms={setTransforms}/>
                    </Stack>
                </div>
                {!reimport &&
                    <Stack direction={"row"} spacing={2} sx={{mt: 2}} alignItems={"center"}>
                        <label htmlFor="contained-button-file">
                            <Input
                                accept="image/*"
                                id="contained-button-file"
                                multiple type="file"
                                onChange={handleFiles}
                            />
                            <Button variant="contained" component="span">
                                Upload
                            </Button>
                        </label>
                        <Typography sx={{textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap"}}>
                            Images selected: {files ? files.length : 0}
                        </Typography>
                    </Stack>}
                <Divider sx={{marginTop: 2, marginBottom: 2}}/>
                <Button variant="contained" color={"error"} onClick={handleOpenDelete}>
                    Delete Mapping
                </Button>
                <Dialog
                    open={openDelete}
                    onClose={handleCloseDelete}
                >
                    <DialogTitle>
                        Delete Mapping
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete the mapping titled "{name}"? This action can not be undone.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {
                            deleteMapping();
                            handleCloseDelete()
                        }}>Delete</Button>
                        <Button onClick={handleCloseDelete} autoFocus>Cancel</Button>
                    </DialogActions>
                </Dialog>
            </DialogContent>
            <DialogActions>
                <Button onClick={close}>Cancel</Button>
                <Button onClick={importImages}>Import</Button>
            </DialogActions>
        </React.Fragment>
    )
}

const Input = styled('input')({
    display: 'none',
    imageText: {}
});

interface PropTypes {
    close: () => void
    reimport: boolean
}

export interface ImageFile {
    name: string
    path: string
    type: string
}

export interface Mapper {
    name: string
    filters: Filter[]
    transforms: Transform[]
}

export interface Filter {
    path: string
    value: string
}

export interface Transform {
    prop: string
    metadata: string
}

const defaultMap: Mapper = {
    name: "",
    filters: [{"path": "", "value": ""}],
    transforms: [{"prop": "", "metadata": ""}],
}

export default ImportImages;
