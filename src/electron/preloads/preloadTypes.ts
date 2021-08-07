interface types {
    savedStore: {
        get: (key: string) => void
        getRequest: (key: string) => void
        getResponse: (key: string, func: (data: any) => void) => void
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
    send: (channel: string, ...data: any[]) => void
    receive: (channel: string, func: (...args: any[]) => void) => void
    removeAll: (channel: string) => void
}

export default types
