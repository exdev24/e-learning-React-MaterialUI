import { blue, orange } from '@material-ui/core/colors';
import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';
import { fontFamily } from '../shared/constants';

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
    fontFamily,
    button: {
      textTransform: 'none'
    }
  }
});

export default responsiveFontSizes(theme);
