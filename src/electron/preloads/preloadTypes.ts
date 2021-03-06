import {IpcRendererEvent} from "electron"
import {RunResult, SqliteError} from "@components/hooks/sqlHooks";

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
        getQuery: (
            query: string,
            callback: (data: any[]) => void,
            args: any[]|{[p: string]: any},
            pluck: boolean
        ) => void,
        runQuery: (
            query: string,
            callback: (data: RunResult|SqliteError) => void,
            args?: any[]|{[p: string]: any}
        ) => void,
        getImages: (
            query: string,
            callback: (...data: any[]) => void,
            args?: any|any[]|{[value: string]: any}
        ) => void
        search: (
            callback: (...data: any[]) => void,
            args: any
        ) => void
    }
    channel: {
        trigger: (channel: string, callback: (response: any[]) => void) =>
            (event: IpcRendererEvent, response: any[]) => void
        send: (channel: string, args: any[]|{[p: string]: any}) => void
        remove: (channel: string, listener: (event: IpcRendererEvent, response: any[]) => void) => void
    }
    request: (channel: string, callback: (data: any) => void, ...data: any[]) => void
    send: (channel: string, ...data: any[]) => void
    receive: (channel: string, func: (...args: any[]) => void) => (...args: any[]) => any
    once: (channel: string, func: (...args: any[]) => void) => (...args: any[]) => void
    remove: (channel: string, listener: (...args: any[]) => void) => void
    removeAll: (channel: string) => void
}

export default types
