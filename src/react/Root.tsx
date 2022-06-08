import React from "react";
import {Button} from "@mui/material";
import SendIcon from '@mui/icons-material/Send';

function Root() {

    return (
        <div>
            <Button variant="contained" endIcon={<SendIcon />}>
                Send
            </Button>
        </div>
    );
}

export default Root;
