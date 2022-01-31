import React from 'react';
import {Chip, Paper} from "@mui/material";
import {ImageData} from "./AppViewer";

const ImageTags = (props: PropTypes) => {

    const {tags, removeTag} = props

    return (
        <React.Fragment>
            <Paper
                sx={{
                    display: 'flex',
                    flexDirection: "row",
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    p: 0.5,
                    m: 0,
                }}
                component="ul"
            >
                {tags.map((data) => (
                        <Chip
                            key={data}
                            label={data}
                            onDelete={removeTag(data)}
                            sx={{
                                m: 0.5
                            }}
                        />
                    ))}
            </Paper>
        </React.Fragment>
    );
};

interface PropTypes {
    tags: string[]
    removeTag: (tag: string) => () => void
}

export default ImageTags;
