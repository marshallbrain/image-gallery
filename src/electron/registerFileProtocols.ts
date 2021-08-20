import pathModule from "path";
import {app, protocol} from "electron";

export default () => {
    protocol.registerFileProtocol('preview', (request, callback) => {
        const path = pathModule.join(app.getAppPath(), `../dev-resources/images/raw/`)
        const pathname = decodeURI(request.url.replace('preview://', path) + ".jpg");
        callback(pathname);
    });
}
