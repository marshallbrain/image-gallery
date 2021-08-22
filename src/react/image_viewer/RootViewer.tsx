import React from 'react';
import {createTheme, CssBaseline, ThemeOptions} from "@material-ui/core";
import {ThemeProvider} from "@emotion/react";
import AppViewer from "./AppViewer";

function RootViewer() {

    const [themeOptions] = React.useState<Theme>(
        {
            palette: {
                mode: 'dark',
            }
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
            <CssBaseline />
            <AppViewer/>
        </ThemeProvider>
    );
}

interface Theme{
    palette: {
        mode: string,
    }
}

export default RootViewer;
