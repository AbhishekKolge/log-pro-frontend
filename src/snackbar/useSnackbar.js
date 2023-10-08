import { useSnackbar, closeSnackbar } from 'notistack';

import { SNACKBAR_DURATION } from '../utils/defaults';

let useSnackbarRef;
export const SnackbarUtilsConfigurator = () => {
  useSnackbarRef = useSnackbar();
  return null;
};

export default {
  success(msg) {
    this.toast(msg, 'success');
  },
  warning(msg) {
    this.toast(msg, 'warning');
  },
  info(msg) {
    this.toast(msg, 'info');
  },
  error(msg) {
    this.toast(msg, 'error');
  },
  toast(msg, variant = 'default') {
    useSnackbarRef.enqueueSnackbar(msg, {
      variant,
      autoHideDuration: SNACKBAR_DURATION,
    });
  },
  savingToast(msg = 'Saving your data please wait', variant = 'info') {
    useSnackbarRef.enqueueSnackbar(msg, {
      variant,
      persist: true,
    });
  },
  hideToast() {
    closeSnackbar(useSnackbarRef.current);
  },
};
