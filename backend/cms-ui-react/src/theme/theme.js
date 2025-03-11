import { defaultTheme } from 'react-admin';

/**
 * Custom theme for LorePin CMS
 * 
 * This theme extends the default React Admin theme with LorePin branding colors.
 * Based on the color palette from the CMS UI Mockups document.
 */
const theme = {
  ...defaultTheme,
  palette: {
    primary: {
      main: '#2A4365', // Dark Blue - Headers, primary buttons
      light: '#4299E1', // Blue - Secondary actions, highlights
      dark: '#1A365D', // Darker blue for hover states
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#F6AD55', // Orange - Important notifications, calls to action
      light: '#FBD38D', // Light orange
      dark: '#DD6B20', // Dark orange for hover states
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#48BB78', // Green - Positive actions, approvals
      light: '#9AE6B4',
      dark: '#2F855A',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#ECC94B', // Yellow - Cautions, warnings
      light: '#FAF089',
      dark: '#D69E2E',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#F56565', // Red - Destructive actions, rejections
      light: '#FEB2B2',
      dark: '#C53030',
      contrastText: '#FFFFFF',
    },
    grey: {
      50: '#F7FAFC', // Light Gray - Page backgrounds
      100: '#EDF2F7',
      200: '#E2E8F0',
      300: '#CBD5E0',
      400: '#A0AEC0',
      500: '#718096', // Gray - Secondary text, borders
      600: '#4A5568',
      700: '#2D3748',
      800: '#1A202C',
      900: '#171923',
    },
    background: {
      default: '#F7FAFC', // Light Gray - Page backgrounds
      paper: '#FFFFFF', // White - Card backgrounds
    },
    text: {
      primary: '#2D3748',
      secondary: '#718096',
      disabled: '#A0AEC0',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.125rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '0.875rem',
    },
    body1: {
      fontSize: '0.875rem',
    },
    body2: {
      fontSize: '0.75rem',
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
          fontWeight: 600,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#2A4365',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          backgroundColor: '#F7FAFC',
          borderBottom: '1px solid #E2E8F0',
        },
        title: {
          fontWeight: 600,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          backgroundColor: '#F7FAFC',
        },
      },
    },
  },
};

export default theme; 