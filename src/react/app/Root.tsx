import React from "react";
import {ThemeProvider} from "@emotion/react";
import App from "../pages/App";
import "./root.css"
import preloadTypes from "@electron/preloads/preloadTypes";
import {createTheme, CssBaseline, ThemeOptions} from "@mui/material";

declare global {
    interface Window { api: preloadTypes }
}

export const ChangeThemeContext = React.createContext({
    toggleColorMode: () => {},
})

window.api.system.registerListener.log((...data: any[]) => {
    console.log(...data)
})

function Root() {

    const [themeOptions, setThemeOptions] = React.useState<ThemeOptions>(
        {
            palette: {
                mode: 'dark',
            },
            components: {
                MuiCssBaseline: {
                    styleOverrides: {
                        "::-webkit-scrollbar-track": {
                        },

                        "::-webkit-scrollbar-thumb": {
                        }
                    },
                },
            },
        }
    )

    const colorMode = React.useMemo(
        () => ({
            toggleColorMode: () => {

                return setThemeOptions((prevMode) => ({
                    ...prevMode,
                    palette: {// @ts-ignore
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
                <CssBaseline enableColorScheme />
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
