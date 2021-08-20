// export const currentDBVersion = 3
//
// const cols = {
//     images: {
//         image_id: "image_id",
//         title: "title",
//         author: "author",
//         original_metadata: "original_metadata"
//     }
// }
//
// const dbStrut: DBStructure = {
//     images: {
//         name: "images",
//         strut: "(" +
//             "image_id integer primary key," +
//             "title text," +
//             "author text," +
//             "original_metadata text" +
//             ")"
//     }
// }
//
// export const pastDBStrut: {[key: number]: PastDBStrut} = {
//     1: {
//         database: {
//             images: {
//                 name: "images",
//                 strut: "(" +
//                     "image_id integer primary key," +
//                     "title text not null," +
//                     "original_metadata text not null," +
//                     ")"
//             }
//         },
//         columnMapping: {
//             images: [
//                 cols.images.image_id,
//                 cols.images.title,
//                 cols.images.original_metadata
//             ]
//         }
//     },
//     2: {
//         database: {
//             images: {
//                 name: "images",
//                 strut: "(" +
//                     `image_id integer primary key,` +
//                     `title text,` +
//                     `original_metadata text` +
//                     ")"
//             }
//         },
//         columnMapping: {
//             images: [
//                 cols.images.image_id,
//                 cols.images.title,
//                 cols.images.original_metadata
//             ]
//         }
//     }
// }
//
// export interface PastDBStrut {
//     database: DBStructure,
//     columnMapping: {
//         [key: string]: string[]
//     }
// }
//
// export type ColumnConstraints =
//     "primary key" |
//     "not null" |
//     "unique"
//
// export type DBStructure = {
//     images: {
//         name: string,
//         strut: string
//     }
// }
//
// export const columns = cols
//
// export default dbStrut
