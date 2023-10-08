import SnackbarUtils from './useSnackbar';

const showSuccess = ({ message }) => {
  SnackbarUtils.success(message);
};

const showError = ({ message }) => {
  SnackbarUtils.error(message);
};

const showWarning = ({ message }) => {
  SnackbarUtils.warning(message);
};

const showInfo = ({ message }) => {
  SnackbarUtils.info(message);
};

export { showSuccess, showError, showWarning, showInfo };
