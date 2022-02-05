import {Search} from "@components/gallery/ImageGallery";

interface types {
    savedStore: {
        get: (key: string) => any
        getRequest: (key: string) => void
        getResponse: (key: string, func: (data: any) => void) => any
        set: (key: string, value: any) => void
        setRequest: () => void
        setResponse: () => void
        delete: () => void
        deleteRequest: () => void
        deleteResponse: () => void
    }
    system: {
        registerListener: {
            log: (...data: any[]) => void
        },
    }
    db: {
        getImages: (
            query: string,
            callback: (...data: any[]) => void,
            args?: any|any[]|{[value: string]: any}
        ) => void
        search: (
            callback: (...data: any[]) => void,
            args: Search
        ) => void
    }
    send: (channel: string, ...data: any[]) => void
    receive: (channel: string, func: (...args: any[]) => void) => (...args: any[]) => void
    remove: (channel: string, listener: (...args: any[]) => void) => void
    removeAll: (channel: string) => void
}

export default types
