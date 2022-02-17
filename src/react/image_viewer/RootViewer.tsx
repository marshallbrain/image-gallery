import React from 'react';
import {createTheme, CssBaseline, ThemeOptions} from "@mui/material";
import {ThemeProvider} from "@emotion/react";

function RootViewer() {

    const [themeOptions] = React.useState<ThemeOptions>(
        {
            palette: {
                mode: 'dark',
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
            <CssBaseline enableColorScheme/>
            {/*<ImageViewer/>*/}
        </ThemeProvider>
    );
}

export default RootViewer;
