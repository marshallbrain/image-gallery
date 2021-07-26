import React, {useEffect} from "react";
import {TextField} from "@material-ui/core";
import("./root.css")

export const ChangeThemeContext = React.createContext({
    toggleColorMode: () => {},
})

function Root(props) {
    
    return (
        <div>
            !!!!!!!!!!!!!!!!!!!!!!
            <TextField id="outlined-basic" label="Outlined" variant="outlined" />
        </div>
    );
}

export default Root;
