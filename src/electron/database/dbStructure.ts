import {DBDataType} from "@electron/database/database";

type ColumnConstraints =
    "primary key" |
    "not null" |
    "unique"

export type DBStructure = {
    images: {
        name: string
        columns: {
            name: string
            dataType: DBDataType
            constraints?: ColumnConstraints[] | ColumnConstraints
        }[]
    }
}

const columnNames = {
    images: {
        image_id: "image_id",
        title: "title",
        json: "json"
    }
}

const dbStrut: DBStructure = {
    images: {
        name: "images",
        columns: [
            {
                name: columnNames.images.image_id,
                dataType: "integer",
                constraints: "primary key"
            },
            {
                name: columnNames.images.title,
                dataType: "text"
            },
            {
                name: columnNames.images.json,
                dataType: "text"
            }
        ]
    },
}

export interface ColumnMapping {
    [key: string]: {
            [key: string]: string
        }
}

export const pastDBStrut: {[key: number]: {database: DBStructure, columnMapping: ColumnMapping}} = {
    1: {
        database: {
            images: {
                name: "images",
                columns: [
                    {
                        name: "image_id",
                        dataType: "integer",
                        constraints: "primary key"
                    },
                    {
                        name: "title",
                        dataType: "text",
                        constraints: "not null"
                    },
                    {
                        name: "json",
                        dataType: "text",
                        constraints: "not null"
                    }
                ]
            }
        },
        columnMapping: {
            images: {
                image_id: columnNames.images.image_id,
                title: columnNames.images.title,
                json: columnNames.images.json
            }
        }
    }
}

export default dbStrut
