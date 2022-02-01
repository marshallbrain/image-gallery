import React from 'react';
import {Paper, styled} from "@mui/material";
import AutoSizer from "react-virtualized-auto-sizer";
import {FixedSizeGrid as WindowGrid} from "react-window";
import {channels} from "@utils/ipcCommands";
import {Image} from "@components/App";

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
    padding: 4
})

interface PropTypes {
    images: Image[]
    onImageSelected: (index: number, imageList: Image[]) => void
}

export default ImageGrid;
