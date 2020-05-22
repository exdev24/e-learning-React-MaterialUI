import { blue, orange } from '@material-ui/core/colors';
import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      light: orange[300],
      main: orange[600],
      dark: orange[800],
      contrastText: '#ffffff'
    },
    secondary: blue
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"'
    ].join(','),

    h1: {
      fontWeight: 500
    },
    h2: {
      fontWeight: 500
    },
    h3: {
      fontWeight: 500
    },
    h4: {
      fontWeight: 500
    },
    h5: {
      fontWeight: 500
    },
    button: {
      textTransform: 'none'
    }
  }
});

export default responsiveFontSizes(theme);
