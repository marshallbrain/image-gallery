import React from 'react';
import {Paper, styled} from "@mui/material";
import AutoSizer from "react-virtualized-auto-sizer";
import {FixedSizeGrid as WindowGrid} from "react-window";
import {channels} from "@utils/ipcCommands";

function ImageGrid(props: PropTypes) {

    const {images} = props

    const Cell = (column: number) => (cell: any) => {
        const id = cell.rowIndex*column+cell.columnIndex
        if (images.length > id) {
            const {image_id, title} = images[id]
            return (
                <ImageCell
                    style={cell.style}
                    onClick={() => {
                        window.api.send(channels.openImageViewer, images, id)
                    }}
                >
                    <img
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
                    const colWidth = 261
                    const columnCount = Math.floor(width / (colWidth))
                    const rowCount = Math.ceil(images.length / columnCount)
                    return (<WindowGrid
                        columnCount={columnCount}
                        columnWidth={Math.floor(width / columnCount)}
                        height={height}
                        rowCount={rowCount}
                        rowHeight={261}
                        width={width}
                    >
                        {Cell(columnCount)}
                    </WindowGrid>)
                }}
            </AutoSizer>
        </Paper>
    );

}

const ImageCell = styled("div")({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundClip: "content-box",
    backgroundColor: "#1E1E1E",
    padding: 2
})

interface PropTypes {
    images: { image_id: Number, title: string }[]
}

export default ImageGrid;
