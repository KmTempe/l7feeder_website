import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00d9ff',
      light: '#4dffff',
      dark: '#00a7cc',
    },
    secondary: {
      main: '#00ff88',
      light: '#5dffb1',
      dark: '#00cc6e',
    },
    background: {
      default: '#0a1628',
      paper: '#0f1f35',
    },
    text: {
      primary: '#e8f0f7',
      secondary: '#9db4cc',
    },
    divider: 'rgba(0, 217, 255, 0.12)',
  },
  typography: {
    fontFamily: '"Roboto", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: {
      fontSize: 'clamp(2.5rem, 5vw, 4rem)',
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: 'clamp(2rem, 4vw, 3rem)',
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
      fontWeight: 700,
    },
    h4: {
      fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
      fontWeight: 600,
    },
    h5: {
      fontSize: 'clamp(1.25rem, 2vw, 1.75rem)',
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    body1: {
      fontSize: '1.05rem',
      lineHeight: 1.7,
    },
    overline: {
      letterSpacing: '0.15em',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          padding: '0.75rem 1.5rem',
        },
        contained: {
          background: 'linear-gradient(135deg, #00d9ff 0%, #00ff88 100%)',
          color: '#0a1628',
          '&:hover': {
            background: 'linear-gradient(135deg, #00e5ff 0%, #00ff99 100%)',
          },
        },
        outlined: {
          borderColor: '#00d9ff',
          color: '#00d9ff',
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
            borderColor: '#00e5ff',
            background: 'rgba(0, 217, 255, 0.08)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'rgba(15, 31, 53, 0.6)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 217, 255, 0.2)',
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: 'rgba(0, 217, 255, 0.5)',
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 40px rgba(0, 217, 255, 0.2)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 600,
          backgroundColor: 'rgba(0, 217, 255, 0.1)',
          color: '#00d9ff',
          border: '1px solid rgba(0, 217, 255, 0.3)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(15, 31, 53, 0.8)',
            '& fieldset': {
              borderColor: 'rgba(0, 217, 255, 0.3)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(0, 217, 255, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#00d9ff',
            },
          },
        },
      },
    },
  },
});
