import React, {useEffect} from "react";
import {TextField} from "@material-ui/core";
import("./root.css")

export const ChangeThemeContext = React.createContext({
    toggleColorMode: () => {},
})

console.log(window.api.savedStore.get("test"))

function Root(props) {
    
    return (
        <div>
            Success
        </div>
    );
}

export default Root;
