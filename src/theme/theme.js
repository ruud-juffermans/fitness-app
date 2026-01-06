import palette from "./palette";

const dark = {
    text: "white",
    colors: {
        base: {
            0: palette.dark[0],
            100: palette.dark[100],
            200: palette.dark[200],
            300: palette.dark[300],
            400: palette.dark[400],
            500: palette.dark[500],
            600: palette.dark[600],
            700: palette.dark[700],
            800: palette.dark[800],
            900: palette.dark[900],
        },
        contrast: {
            0: palette.light[0],
            100: palette.light[300],
            200: palette.light[600],
            300: palette.light[900],
            400: palette.light[1200],
            500: palette.light[1500],
            600: palette.light[1200],
            700: palette.light[1400],
            800: palette.light[1600],
            900: palette.light[1800],
        },
        accent: {
            0: palette.red[900],
            100: palette.red[800],
            200: palette.red[600],
            300: palette.red[400],
        }
    },
    components: {
        input: {
            height: 42,
            borderRadius: 0,
            borderWidth: 1,
            paddingHorizontal: 12,
            backgroundColor: palette.dark[200],
            borderColor: palette.dark[400],
            textColor: palette.light[300],
            placeholderColor: palette.dark[900],
        },
        button: {
            borderRadius: 0,
            borderWidth: 2,
            backgroundColor: palette.dark[500],
            borderColor: palette.dark[500],
            textColor: palette.light[300],
        },
        header: {
            backgroundColor: palette.dark[200],
            tintColor: palette.light[100],
            bottomSheet: palette.dark[200]
        },
        tabBar: {
            backgroundColor: palette.dark[200],
            borderColor: palette.dark[500],
            tintInactive: palette.dark[900],
            tintActive: palette.light[100],
        },
        panel: {
            borderRadius: 0,
            borderWidth: 2,
            padding: 4,
            backgroundColor: palette.dark[200],
            borderColor: palette.dark[500],
        },
        logControls: {
            height: 32,
            borderRadius: 0,
            borderWidth: 2,
            spacing: 4,
            backgroundColor: palette.dark[200],
            borderColor: palette.dark[300],
            color: "white"
        },
        toast: {
            borderRadius: 4,
            padding: 6,
            backgroundColor: palette.dark[200],
        }
    },

};

export default { dark };