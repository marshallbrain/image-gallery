import React, {createContext, useState, useContext, useEffect} from 'react';
import {Slide, SlideProps, Snackbar} from "@mui/material";

const Context = createContext((value: string) => {})

export const SnackBarProvider = (props: PropTypes) => {

    const {children} = props

    const [queue, setQueue] = useState<string[]>([])
    const [open, setOpen] = useState(false)
    const [message, setMessage] = useState<string>("")

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

    const queueMessage = (message: string) => {
        setQueue([...queue, message])
    }

    return (
        <Context.Provider value={queueMessage}>
            <Snackbar
                open={open}
                message={message}
                autoHideDuration={4000}
                onClose={close}
                TransitionProps={{ onExited: () => {setMessage("")} }}
                TransitionComponent={Transition}
            />
            {children}
        </Context.Provider>
    )
}

export const useSnackbar = () => useContext(Context)


function Transition(props: Omit<SlideProps, 'direction'>) {
    return <Slide {...props} direction="right"  children={props.children}/>
}

interface PropTypes {
    children: React.ReactNode[]
}
