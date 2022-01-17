import { Drawer } from '@mui/material';
import React from 'react';

const MetadataEdit = (props: PropTypes) => {

    const {editOpen, drawerWidth} = props

    return (
        <Drawer
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                },
            }}
            variant="persistent"
            anchor="right"
            open={editOpen}
        >
        </Drawer>
    );
};

interface PropTypes {
    editOpen: boolean,
    drawerWidth: number,
}

export default MetadataEdit;
