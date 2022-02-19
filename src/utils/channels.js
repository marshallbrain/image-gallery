let index = 0

const channels = {
    dialogs: {
        importImages: i(),
        startProgress: i(),
    },
    execute: {
        importImages: i(),
        exportImages: i(),
    },
    update: {
        progress: i(),
        finishProgress: i(),
        reloadSearch: i(),
        windowTitle: i(),
    },
    sql: {
        run: i(),
        get: i(),
        search: i(),
    }
}

function i() {
    return `${index++}`
}

export default channels
