import {DBDataType} from "@electron/database/database";

export type ColumnConstraints =
    "primary key" |
    "not null" |
    "unique"

export type DBStructure = {
    images: {
        name: string
        columns: {
            name: string
            dataType: DBDataType
            constraints?: ColumnConstraints[]
        }[]
    }
}

const columnNames = {
    images: {
        image_id: "image_id",
        title: "title",
        original_metadata: "original_metadata"
    }
}

const dbStrut: DBStructure = {
    images: {
        name: "images",
        columns: [
            {
                name: columnNames.images.image_id,
                dataType: "integer",
                constraints: ["primary key"]
            },
            {
                name: columnNames.images.title,
                dataType: "text"
            },
            {
                name: columnNames.images.original_metadata,
                dataType: "text"
            }
        ]
    },
}

export interface PastDBStrut {
    database: DBStructure,
    columnMapping: {
        [key: string]: string[]
    }
}

export const pastDBStrut: { [key: number]: PastDBStrut } = {
    1: {
        database: {
            images: {
                name: "images",
                columns: [
                    {
                        name: "image_id",
                        dataType: "integer",
                        constraints: ["primary key"]
                    },
                    {
                        name: "title",
                        dataType: "text",
                        constraints: ["not null"]
                    },
                    {
                        name: "original_metadata",
                        dataType: "text",
                        constraints: ["not null"]
                    }
                ]
            }
        },
        columnMapping: {
            images: [
                columnNames.images.image_id,
                columnNames.images.title,
                columnNames.images.original_metadata
            ]
        }
    }
}

export default dbStrut
