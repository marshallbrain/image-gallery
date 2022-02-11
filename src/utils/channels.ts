let index = 0

const channels = {
    dialogs: {
        importImages: i()
    },
    execute: {
        importImages: i()
    }
}

function i() {
    return `${index++}`
}

export default channels

export type Channels = typeof channels
