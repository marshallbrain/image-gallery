import React, {useState} from 'react';
import {Box, Checkbox, Paper, styled} from "@mui/material";
import AutoSizer from "react-virtualized-auto-sizer";
import {FixedSizeGrid as WindowGrid} from "react-window";
import {channels} from "@utils/ipcCommands";
import {Image} from "@components/App";
import CheckBoxFilled from "@components/icons/CheckBoxFilled";

function ImageGrid(props: PropTypes) {

    const {images, onImageSelected} = props

    const Cell = (column: number) => (cell: any) => {

        const id = cell.rowIndex*column+cell.columnIndex

        if (images.length > id) {
            const {image_id, title} = images[id]

            return (
                <ImageCell
                    style={cell.style}
                    onClick={() => {
                        onImageSelected(id, images)
                    }}
                >
                    <Box
                        sx={{
                            position: "absolute",
                            left: 0,
                            top: 0,
                            width: "inherit",
                            height: "inherit",
                            opacity: 0,
                            "&:hover":{
                                opacity: 1
                            },
                        }}
                    >
                        <Checkbox
                            color={"info"}
                            checkedIcon={<CheckBoxFilled/>}
                            onClick={(event) => {
                                event.stopPropagation()
                            }}
                            onChange={() => {
                                console.log(id)
                            }}
                            sx={{
                                position: "absolute",
                                left: 0,
                                top: 0,
                                "& .MuiSvgIcon-root": { fontSize: 32 }
                            }}
                        />
                    </Box>
                    <Img
                        key={image_id.toString()}
                        src={`preview://${image_id}`}
                        alt={title}
                    />
                </ImageCell>
            )
        } else return (<div style={cell.style} />)

    }

    return (
        <Paper sx={{height: "-webkit-fill-available", marginX: 1, marginBottom: 1}} elevation={0}>
            <AutoSizer>
                {({height, width}) => {
                    const columnCount = 5
                    const rowCount = Math.ceil(images.length / columnCount)
                    const widthOffset = (Math.floor(width / columnCount) * rowCount > height)? 16: 0
                    const colWidth = Math.floor((width-widthOffset) / columnCount)
                    return (<WindowGrid
                        columnCount={columnCount}
                        columnWidth={colWidth}
                        height={height}
                        rowCount={rowCount}
                        rowHeight={colWidth}
                        width={width}
                    >
                        {Cell(columnCount)}
                    </WindowGrid>)
                }}
            </AutoSizer>
        </Paper>
    );

}

const Img = styled("img")({
    maxWidth: "100%",
    maxHeight: "100%",
})

const ImageCell = styled("div")({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundClip: "content-box",
    backgroundColor: "#1E1E1E",
    padding: 4,
    cursor: "not-allowed"
})

interface PropTypes {
    images: Image[]
    onImageSelected: (index: number, imageList: Image[]) => void
}

export default ImageGrid;
