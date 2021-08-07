import React from "react";
import {ThemeProvider} from "@emotion/react";
import {createTheme, CssBaseline, ThemeOptions} from "@material-ui/core";
import App from "../components/App";
import "./root.css"

declare global {
    interface Window { api: any; }
}

export const ChangeThemeContext = React.createContext({
    toggleColorMode: () => {},
})

window.api.system.registerListener.log((...data: any[]) => {
    console.log(...data)
})

function Root() {
    
    const [themeOptions, setThemeOptions] = React.useState<Theme>(
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
            return createTheme(themeOptions as ThemeOptions)
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

interface Theme{
    palette: {
        mode: string,
    }
}
