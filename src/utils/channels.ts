let i = 0

const channels = {
    dialogs: {
        importImages: i++
    },
    execute: {
        importImages: i++
    }
}

export default channels

export type Channels = typeof channels
