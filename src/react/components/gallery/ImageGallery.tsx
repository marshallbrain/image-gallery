import React, {useEffect} from 'react';
import Integer from "Integer";
import {sqlImageSearch} from "@utils/sqlQueries";
import {channels} from "@utils/ipcCommands";
import {FixedSizeGrid as WindowGrid} from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import {Paper, styled} from "@material-ui/core";

function ImageGallery() {

    const [images, setImages] = React.useState<{ image_id: Integer.IntLike, title: string }[]>([])

    useEffect(() => {
        window.api.receive(channels.importImagesComplete, () => {
            console.log("Image import complete")
            getImages()
        })
        window.api.receive(channels.reimportImagesComplete, () => {
            console.log("Re-image import complete")
            getImages()
        })
        getImages()
        return function cleanup() {
            window.api.removeAll(channels.importImagesComplete)
            window.api.removeAll(channels.reimportImagesComplete)
        };
    }, [])

    const getImages = () => {
        window.api.db.getImages(sqlImageSearch, (data) => {
            setImages(data)
        })
    }

    const Cell = (column: number) => (cell: any) => {
        const id = cell.rowIndex*column+cell.columnIndex
        if (images.length > id) {
            const {image_id, title} = images[id]
            return (
                <ImageCell style={cell.style}>
                    <img
                        key={image_id.toString()}
                        src={`preview://${image_id}`}
                        alt={"thumbnail"}
                    />
                </ImageCell>
            )
        } else return (<div style={cell.style} />)

    }

    return (
        <Paper sx={{height: "100vh"}}>
            <AutoSizer>
                {({height, width}) => {
                    const colWidth = 261
                    const columnCount = Math.floor(width / (colWidth))
                    const rowCount = Math.ceil(images.length / columnCount)
                    return (<WindowGrid
                        columnCount={columnCount}
                        columnWidth={colWidth}
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
    backgroundColor: "dimgray",
    padding: 2
})

export default ImageGallery;

{/*<Paper>

            {images.map(({image_id}) => {
                return <img
                    key={image_id.toString()}
                    src={`preview://${image_id}`}
                    alt={"thumbnail"}
                />
            })}
        </Paper>*/}
