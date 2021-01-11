const defaultTheme = (theme) => theme ? theme : ({
    palette: {
        primary: {
            main: "#A0C52A",
            contrastText: "#fff",
        },
        secondary: {
            main: "#868785",
            contrastText: "#000",
        },
        error: {
            main: "#FF0000"
        },
        tonalOffset: 0.2
    },
    typography: {
        useNextVariants: true,
        fontSize: 14,
        fontFamily: [
            "Roboto",
            "sans-serif"
        ].join(","),
        h5: {
            textTransform: "uppercase",
            letterSpacing: "0.05em"
        },
        subtitle1: {
            letterSpacing: "0.05em"
        }
    },
    overrides: {
        MuiFilledInput: {
            root: {
                backgroundColor: "rgba(253, 216, 0, 0.03)",
                "&:hover": {
                    backgroundColor: "rgba(253, 216, 0, 0.06)"
                },
                "&$focused": {
                    backgroundColor: "rgba(253, 216, 0, 0.09)"
                },
                "&$disabled": {
                    backgroundColor: "rgba(0, 0, 0, 0.03)"
                }
            },
        }
    }
});

export default defaultTheme;


