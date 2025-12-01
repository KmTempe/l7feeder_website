import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#64ffda', // Teal/Cyan accent from reference
      light: '#9effff',
      dark: '#14cba8',
      contrastText: '#0a192f',
    },
    secondary: {
      main: '#ccd6f6', // Light gray/blue for text
      light: '#ffffff',
      dark: '#8892b0',
    },
    background: {
      default: '#0a192f', // Deep dark blue background
      paper: '#112240', // Slightly lighter for cards
    },
    text: {
      primary: '#ccd6f6',
      secondary: '#8892b0',
    },
    divider: 'rgba(100, 255, 218, 0.1)',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Segoe UI", sans-serif',
    h1: {
      fontSize: 'clamp(3rem, 7vw, 5.5rem)',
      fontWeight: 700,
      color: '#ccd6f6',
      lineHeight: 1.1,
    },
    h2: {
      fontSize: 'clamp(2rem, 5vw, 3.5rem)',
      fontWeight: 700,
      color: '#ccd6f6',
      lineHeight: 1.2,
    },
    h3: {
      fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
      fontWeight: 600,
      color: '#ccd6f6',
    },
    h4: {
      fontSize: 'clamp(1.25rem, 2.5vw, 2rem)',
      fontWeight: 600,
      color: '#ccd6f6',
    },
    body1: {
      fontSize: '1.1rem',
      lineHeight: 1.7,
      color: '#8892b0',
    },
    body2: {
      fontSize: '0.95rem',
      lineHeight: 1.6,
      color: '#8892b0',
    },
    button: {
      fontFamily: '"Fira Code", monospace',
      fontSize: '0.9rem',
    },
  },
  shape: {
    borderRadius: 4,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 4,
          padding: '12px 24px',
          transition: 'all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1)',
        },
        outlined: {
          border: '1px solid #64ffda',
          color: '#64ffda',
          backgroundColor: 'transparent',
          '&:hover': {
            backgroundColor: 'rgba(100, 255, 218, 0.1)',
            border: '1px solid #64ffda',
          },
        },
        contained: {
          backgroundColor: '#64ffda',
          color: '#0a192f',
          '&:hover': {
            backgroundColor: '#14cba8',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#112240',
          backgroundImage: 'none',
          boxShadow: '0 10px 30px -15px rgba(2, 12, 27, 0.7)',
          transition: 'all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1)',
          '&:hover': {
            transform: 'translateY(-5px)',
          },
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: '24px',
          paddingRight: '24px',
          '@media (min-width: 600px)': {
            paddingLeft: '48px',
            paddingRight: '48px',
          },
        },
      },
    },
  },
});
