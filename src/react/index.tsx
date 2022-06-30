import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {Button} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

ReactDOM.render(
    <Root/>,
    document.getElementById("root")
);

function Root() {

    return (
        <div>
            <Button variant="contained" endIcon={<SendIcon />}>
                Send
            </Button>
        </div>
    );
}
