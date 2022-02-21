import React, {useRef} from 'react/index';
import {Box, Checkbox, styled} from "@mui/material";
import AutoSizer from "react-virtualized-auto-sizer";
import {FixedSizeGrid as WindowGrid} from "react-window";
import {Image} from "../App";
import CheckBoxFilled from "@components/icons/CheckBoxFilled";
import {runQuery} from "@components/hooks/sqlHooks";
import runQueries from "../../queries/runQueries";

const headerOffset = 0

function ImageGrid(props: PropTypes) {

    const {
        images,
        onImageSelected,
        selected,
        selectImages
    } = props

    const multiSelect = useRef({last: 1, shift: false})

    const Cell = (column: number) => (cell: any) => {

        const id = cell.rowIndex * column + cell.columnIndex

        if (images.length > id) {
            const {image_id, title} = images[id]

            return (
                <ImageCell
                    style={{
                        ...cell.style,
                        top: cell.style.top
                    }}
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
                            opacity: (selected.has(image_id)) ? 1 : 0,
                            "&:hover": {
                                opacity: 1
                            },
                        }}
                    >
                        <Checkbox
                            key={image_id.toString()}
                            checked={selected.has(image_id)}
                            color={"info"}
                            checkedIcon={<CheckBoxFilled/>}
                            onClick={(event) => {
                                multiSelect.current = {...multiSelect.current, shift: event.shiftKey}
                                event.stopPropagation()
                            }}
                            onChange={() => {
                                selectImages(id+1, multiSelect.current)
                                multiSelect.current = {...multiSelect.current, last: id+1}
                            }}
                            sx={{
                                position: "absolute",
                                left: 0,
                                top: 0,
                                "& .MuiSvgIcon-root": {fontSize: 32}
                            }}
                        />
                    </Box>
                    <Img
                        src={`preview://${image_id}`}
                        alt={title}
                        loading={"lazy"}
                    />
                </ImageCell>
            )
        } else return (<div style={cell.style}/>)

    }

    return (
        <Box sx={{height: "-webkit-fill-available", marginX: 1}}>
            <AutoSizer>
                {({height, width}) => {
                    const columnCount = 5
                    const rowCount = Math.ceil(images.length / columnCount)
                    const widthOffset = (Math.floor(width / columnCount) * rowCount > height) ? 16 : 0
                    const colWidth = Math.floor((width - widthOffset) / columnCount)
                    return (
                        <WindowGrid
                            columnCount={columnCount}
                            columnWidth={colWidth}
                            height={height}
                            rowCount={rowCount}
                            rowHeight={colWidth}
                            width={width}
                        >
                            {Cell(columnCount)}
                        </WindowGrid>
                    )
                }}
            </AutoSizer>
        </Box>
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
    selected: Set<number>
    selectImages: (id: number, multi: {last: number, shift: boolean}) => void
}

export default ImageGrid;
