import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#00A3E0',
      light: '#4FC3F7',
      dark: '#0277BD',
    },
    secondary: {
      main: '#0288D1',
      light: '#4FC3F7',
      dark: '#01579B',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#1a202c',
      secondary: '#4a5568',
    },
  },
  typography: {
    fontFamily: '"Quicksand", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      fontSize: '2rem',
    },
    h5: {
      fontWeight: 700,
      fontSize: '1.5rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
      fontWeight: 400,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 20px rgba(0, 163, 224, 0.08)',
          transition: 'box-shadow 0.3s ease',
          border: '1px solid rgba(0, 163, 224, 0.1)',
          '&:hover': {
            boxShadow: '0 8px 32px rgba(0, 163, 224, 0.15)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 12,
          padding: '8px 20px',
          fontSize: '0.875rem',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 163, 224, 0.2)',
          },
        },
        contained: {
          color: '#ffffff',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            fontSize: '0.875rem',
            color: '#1a202c',
            '& fieldset': {
              borderColor: 'rgba(0, 163, 224, 0.2)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(0, 163, 224, 0.4)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#00A3E0',
              borderWidth: '2px',
            },
          },
          '& .MuiInputLabel-root': {
            fontSize: '0.875rem',
            fontWeight: 500,
            color: '#4a5568',
          },
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            padding: '4px 8px',
          },
        },
        inputRoot: {
          fontSize: '0.875rem',
          color: '#1a202c',
        },
        option: {
          fontSize: '0.875rem',
          color: '#1a202c',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #00A3E0 0%, #0288D1 100%)',
          boxShadow: '0 4px 20px rgba(0, 163, 224, 0.15)',
          '& .MuiTypography-root': {
            color: '#ffffff',
          },
          '& .MuiButton-root': {
            color: '#ffffff',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
  },
});