import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    primary: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
    },
    secondary: {
      main: '#fef3c7',
    },
    error: {
      main: '#dc2626',
    },
    background: {
      default: '#fefce8',
      paper: '#fffbeb',
    },
    text: {
      primary: '#1c1917',
      secondary: '#44403c',
      disabled: '#78716c',
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Inter", "Segoe UI", system-ui, sans-serif',
  },
})
