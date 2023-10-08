import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { SnackbarProvider } from 'notistack';
import { disableReactDevTools } from '@fvilers/disable-react-devtools';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { SnackbarUtilsConfigurator } from './snackbar/useSnackbar';
import store from './app/store';
import { SNACKBAR_DURATION } from './utils/defaults';
import App from './App.jsx';

import './index.css';

if (import.meta.env.VITE_NODE_ENV !== 'dev') {
  disableReactDevTools();
}

const defaultTheme = createTheme();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        <SnackbarProvider
          autoHideDuration={SNACKBAR_DURATION}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          maxSnack={3}
        >
          <SnackbarUtilsConfigurator />
          <App />
        </SnackbarProvider>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
