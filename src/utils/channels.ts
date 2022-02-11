let index = 0

const channels = {
    dialogs: {
        importImages: i(),
        startProgress: i()
    },
    execute: {
        importImages: i()
    },
    update: {
        progress: i(),
        finishProgress: i()
    },
}

function i() {
    return `${index++}`
}

export default channels

export type Channels = typeof channels
