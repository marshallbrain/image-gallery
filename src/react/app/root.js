import React, {useEffect} from "react";
import {ThemeProvider} from "@emotion/react";
import {createTheme, CssBaseline} from "@material-ui/core";
import App from "../components/App";
import("./root.css")

export const ChangeThemeContext = React.createContext({
    toggleColorMode: () => {},
})

function Root(props) {
    
    const [themeOptions, setThemeOptions] = React.useState(
        {
            palette: {
                mode: 'light',
            }
        }
    )
    
    const colorMode = React.useMemo(
        () => ({
            toggleColorMode: () => {
                return setThemeOptions((prevMode) => ({
                    ...prevMode,
                    palette: {
                        mode: prevMode.palette.mode === 'light' ? 'dark' : 'light'
                    }
                }));
            },
        }),
        [],
    );
    
    const theme = React.useMemo(
        () => {
            return createTheme(themeOptions)
        },
        [themeOptions],
    );
    
    return (
            <ChangeThemeContext.Provider value={colorMode}>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <App/>
                </ThemeProvider>
            </ChangeThemeContext.Provider>
    );
}

export default Root;
