const defaultTheme = (theme) => theme ? theme : ({
    palette: {
        primary: {
            main: "#009543"
        },
        secondary: {
            main: "#868785"
        },
        error: {
            main: "#FF0000"
        },
        tonalOffset: 0.2
    },
    typography: {
        useNextVariants: true
    }
});

export default defaultTheme;
