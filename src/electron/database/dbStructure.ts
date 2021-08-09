export type ColumnConstraints =
    "primary key" |
    "not null" |
    "unique"

export type DBStructure = {
    images: {
        name: string,
        strut: string
    }
}

const cols = {
    images: {
        image_id: "image_id",
        title: "title",
        original_metadata: "original_metadata"
    }
}

export const columns = cols

const dbStrut: DBStructure = {
    images: {
        name: "images",
        strut: "(" +
            `${cols.images.image_id} integer primary key,` +
            `${cols.images.title} text,` +
            `${cols.images.original_metadata} text` +
            ")"
    }
}

export interface PastDBStrut {
    database: DBStructure,
    columnMapping: {
        [key: string]: string[]
    }
}

export const pastDBStrut: {[key: number]: PastDBStrut} = {
    1: {
        database: {
            images: {
                name: "images",
                strut: "(" +
                    `image_id integer primary key,` +
                    `title text not null,` +
                    `original_metadata text not null,` +
                    ")"
            }
        },
        columnMapping: {
            images: [
                cols.images.image_id,
                cols.images.title,
                cols.images.original_metadata
            ]
        }
    }
}

export default dbStrut
