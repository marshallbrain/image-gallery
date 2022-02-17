import {useEffect} from "react";

export const useChannel = (
    channel: string,
    callback: (response: any[]) => void
) => {
    useEffect(() => {
        const listener = window.api.channel.trigger(channel, callback)

        return function cleanup() {
            window.api.channel.remove(channel, listener)
        }
    }, [])
}
export const sendChannel = (
    channel: string,
    args: any[] | { [p: string]: any }
) => {
    window.api.channel.send(channel, args)
}
