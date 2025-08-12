import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#00ff9d', // Neon green accent (for buttons)
        },
        secondary: {
            main: '#1f1f1f', // Card background
        },
        background: {
            default: '#121212',
            paper: '#1a1a1a', // Slightly lighter than default
        },
        text: {
            primary: '#ffffff',
            secondary: '#cfcfcf',
        },
    },
    typography: {
        fontFamily: `'Poppins', 'Roboto', 'sans-serif'`,
        h5: {
            fontWeight: 600,
        },
        body1: {
            fontSize: '0.95rem',
        },
        button: {
            textTransform: 'none',
            fontWeight: 600,
        },
    },
    shape: {
        borderRadius: 20,
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundColor: '#1f1f1f',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    padding: '10px 20px',
                },
            },
        },
        MuiInputBase: {
            styleOverrides: {
                root: {
                    backgroundColor: '#2a2a2a',
                    borderRadius: 12,
                },
                input: {
                    color: '#fff',
                },
            },
        },
    },
});

export default theme;
