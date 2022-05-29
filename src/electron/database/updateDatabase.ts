import {db} from "@electron/database/database";
import {appData} from "@utils/utilities";
import dayjs from "dayjs";

const currentDBVersion = 4

export default () => {
    const userVersion = db.pragma("user_version", {simple: true}) as number
    if (userVersion != currentDBVersion) {
        if (userVersion == 0) {
            createTables()
        } else if (userVersion < currentDBVersion) {
            db.backup(appData(`database-${dayjs().format("YY-MM-DD_HH-mm-ss")}.db.bak`)).then(() => {
                db.pragma("foreign_keys = off")
                updateDB(userVersion)
                db.pragma("foreign_keys = on")
            })
        } else throw "Unknown database version"
    }

    createTemp()

}

const createTables = db.transaction(() => {
    for (const table of Object.values(tableDef)) {
        db.prepare("create table if not exists " + table.name + " (" +
            table.def
            + ");"
        ).run()
    }
    db.pragma(`user_version = ${currentDBVersion}`)
})

const createTemp = db.transaction(() => {
    for (const temp of Object.values(tempTableDef)) {
        db.prepare("create temp table " + temp.name + " (" +
            temp.def
            + ");"
        ).run()
    }
})

const updateDB = db.transaction((version: number) => {
    createTables()

    for (let i = version; i < currentDBVersion; i++) {
        switch (i) {
            case 1: {
                moveTable(tableDef.tags)
                moveTable(tableDef.collections)
                break
            }
            case 2: {
                moveTable(
                    tableDef.images,
                    "image_id, title, image_width, image_height, date_added, extension, " +
                    "original_metadata, original_exif",
                    "image_id, title, image_width, image_height, date_added, extension, " +
                    "original_metadata, original_exif"
                )
                break
            }
        }
    }

    db.pragma(`user_version = ${currentDBVersion}`)
})

function moveTable(table: { name: string, def: string }, newColumns?: string, oldColumns?: string) {
    db.prepare("create table new_" + table.name + " (" +
        table.def
        + ");").run()

    db.prepare("" +
        "INSERT INTO new_" + table.name +
        (newColumns ? `(${newColumns})` : "")
        + " SELECT " +
        (oldColumns || "*")
        + " FROM " + table.name +
        ";"
    ).run()

    db.prepare("drop table " + table.name + ";").run()
    db.prepare("alter table new_" + table.name + " rename to " + table.name + ";").run()
}

const tableDef = {
    images: {
        name: "images",
        def: "" +
            "image_id integer primary key,\n" +
            "title text not null,\n" +
            "bookmark integer not null default 0 check (bookmark IN (0, 1)),\n" +
            "author text,\n" +

            "image_width integer not null,\n" +
            "image_height integer not null,\n" +
            "date_added integer not null,\n" +
            "extension text not null,\n" +
            "original_metadata text not null,\n" +
            "original_exif text not null"
    },
    tags: {
        name: "tags",
        def: "" +
            "tag_id integer primary key,\n" +
            "name text not null unique collate nocase"
    },
    imagesTags: {
        name: "images_tags",
        def: "" +
            "image_id integer not null,\n" +
            "tag_id integer not null,\n" +
            "primary key (image_id, tag_id),\n" +
            "foreign key (image_id)\n" +
            "references images (image_id)\n" +
            "on update cascade\n" +
            "on delete cascade,\n" +
            "foreign key (tag_id)\n" +
            "references tags (tag_id)\n" +
            "on update cascade\n" +
            "on delete cascade"
    },
    collections: {
        name: "collections",
        def: "" +
            "collection_id integer primary key,\n" +
            "name text not null unique collate nocase"
    },
    imageCollection: {
        name: "images_collections",
        def: "" +
            "image_id integer not null,\n" +
            "collection_id integer not null,\n" +
            "primary key (image_id, collection_id),\n" +
            "foreign key (image_id)\n" +
            "references images (image_id)\n" +
            "on update cascade\n" +
            "on delete cascade,\n" +
            "foreign key (collection_id)\n" +
            "references collections (collection_id)\n" +
            "on update cascade\n" +
            "on delete cascade"
    }
}

const tempTableDef = {
    search: {
        name: "search",
        def: "" +
            "id integer primary key,\n" +
            "image_id integer not null unique,\n" +
            "title text not null,\n" +
            "extension text not null"
    },
    select: {
        name: "selected",
        def: "" +
            "id integer primary key,\n" +
            "image_id integer not null unique"
    }
}
