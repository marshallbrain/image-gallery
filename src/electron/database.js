import sqlite3 from "sqlite3";
import pathModule from "path";
import {app} from "electron";

const db = new sqlite3.Database(pathModule.join(app.getAppPath(), "../dev-resources/database.db"))

/*

Image Database
--------------
ID
Title
Author
Group
Category
Collections
Tags
Rating
Content Rating
Source Website
Date Added
Date Modified
Date Image Modified
Size
Width
Height
Description
Other (Source Url)

Author

Group

Category

Collections

Tags

 */
