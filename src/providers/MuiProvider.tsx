import {createTheme, ThemeProvider} from "@mui/material";
import {ReactElement} from "react";

const theme = createTheme({
    palette: {
        mode: "dark"
    }
});

const MuiProvider = ({children}: { children: ReactElement }) => {
    return <ThemeProvider theme={theme}>
        {children}
    </ThemeProvider>;
}

export default MuiProvider;