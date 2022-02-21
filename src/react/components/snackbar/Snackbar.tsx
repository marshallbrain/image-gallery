import React, {createContext, useState, useContext, useEffect} from 'react';
import {Alert, AlertColor, Slide, SlideProps, Snackbar} from "@mui/material";

const Context = createContext((message: string, type: AlertColor) => {})

export const SnackBarProvider = (props: PropTypes) => {

    const {children} = props

    const [queue, setQueue] = useState<Message[]>([])
    const [open, setOpen] = useState(false)
    const [message, setMessage] = useState<Message | undefined>(undefined)

    useEffect(() => {
        if (queue.length > 0 && !message) {
            setMessage(queue[0])
            setQueue(queue.slice(1))
            setOpen(true)
        }
        if (queue.length > 0 && message) {
            setOpen(false)
        }
    }, [queue, message])

    const close = (event: React.SyntheticEvent<any> | Event, reason: string) => {
        if (reason === "timeout") {
            setOpen(false)
        }
    }

    const queueMessage = (message: string, type: AlertColor) => {
        setQueue([...queue, {value: message, type}])
    }

    return (
        <Context.Provider value={queueMessage}>
            <Snackbar
                open={open}
                autoHideDuration={4000}
                onClose={close}
                TransitionProps={{ onExited: () => {setMessage(undefined)} }}
                TransitionComponent={Transition}
            >
                <Alert severity={message?.type} variant={"filled"} sx={{ width: '100%' }}>
                    {message?.value}
                </Alert>
            </Snackbar>
            {children}
        </Context.Provider>
    )
}

export const useSnackbar = () => useContext(Context)

interface Message {
    value: string
    type: AlertColor
}

function Transition(props: Omit<SlideProps, 'direction'>) {
    return <Slide {...props} direction="right"  children={props.children}/>
}

interface PropTypes {
    children: React.ReactNode[]
}
