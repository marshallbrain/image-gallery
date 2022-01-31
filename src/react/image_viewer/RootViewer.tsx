import React from 'react';
import {createTheme, CssBaseline, ThemeOptions} from "@mui/material";
import {ThemeProvider} from "@emotion/react";
import AppViewer from "./components/AppViewer";

function RootViewer() {

    const [themeOptions] = React.useState<ThemeOptions>(
        {
            palette: {
                mode: 'dark',
            },
            components: {
                MuiCssBaseline: {
                    styleOverrides: {
                        "::-webkit-scrollbar": {
                            display: "none"
                        },
                    }
                },
            },
        }
    )

    const theme = React.useMemo(
        () => {
            return createTheme(themeOptions as ThemeOptions)
        },
        [themeOptions],
    );

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline enableColorScheme />
            <AppViewer/>
        </ThemeProvider>
    );
}

export default RootViewer;
