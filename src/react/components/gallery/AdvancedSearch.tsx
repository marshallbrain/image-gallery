import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    ToggleButton,
    ToggleButtonGroup, Typography
} from '@mui/material';
import React, {useMemo, useState} from 'react';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CollectionsIcon from '@mui/icons-material/Collections';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

const AdvancedSearch = (props: PropTypes) => {

    const {open} = props

    const [group, setGroup] = useState("generic")

    const changeGroup = (
        event: React.MouseEvent<HTMLElement>,
        newGroup: string | null,
    ) => {
        if (newGroup !== null) {
            setGroup(newGroup)
        }
    }

    return (
        <Dialog
            open={open}
            fullWidth
            maxWidth={"sm"}
        >
            <DialogTitle>
                Advanced Search Options
            </DialogTitle>
            <DialogContent
                sx={{
                    display: "flex",
                    flexDirection: "column"
                }}
            >
                <ToggleButtonGroup
                    exclusive
                    value={group}
                    onChange={changeGroup}
                    sx={{
                        alignSelf: "center"
                    }}
                >
                    <ToggleButton value="generic">
                        <FilterAltIcon fontSize={"large"} />
                    </ToggleButton>
                    <ToggleButton value="tag">
                        <LocalOfferIcon fontSize={"large"} />
                    </ToggleButton>
                    <ToggleButton value="collection">
                        <CollectionsIcon fontSize={"large"} />
                    </ToggleButton>
                </ToggleButtonGroup>
            </DialogContent>
            <DialogActions>
                <Button>Close</Button>
                <Button>Search</Button>
            </DialogActions>
        </Dialog>
    )
}

interface PropTypes {
    open: boolean
}

export default AdvancedSearch
