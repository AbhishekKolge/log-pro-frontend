import { authActions } from './authSlice';
import { checkTimeIsExpired, calculateRemainingTime } from '../../utils/time';

import {
  saveAuthToLocal,
  getAuthFromLocal,
  removeAuthFromLocal,
} from '../../utils/storage';

import { showSuccess, showInfo } from '../../snackbar/snackbarAction';

const logoutHandler = (config) => {
  return (dispatch) => {
    removeAuthFromLocal();
    dispatch(authActions.logout());
    !config?.isSession && showInfo({ message: 'Logged out' });
  };
};

const checkLoginStatus = () => {
  return (dispatch) => {
    const authDetails = getAuthFromLocal();

    if (authDetails) {
      const accessExpired = checkTimeIsExpired(
        authDetails.accessExpirationTime
      );

      if (accessExpired) {
        removeAuthFromLocal();
        dispatch(authActions.logout());
        showInfo({ message: 'Session Expired' });
        return;
      }

      dispatch(authActions.login(authDetails));
      const autoLogoutTime = calculateRemainingTime(
        authDetails.accessExpirationTime
      );
      setTimeout(() => {
        removeAuthFromLocal();
        dispatch(authActions.logout());
        showInfo({ message: 'Session Expired' });
      }, autoLogoutTime);
      return;
    }

    removeAuthFromLocal();
    dispatch(authActions.logout());
  };
};

const loginHandler = ({ name, profileImage }) => {
  return (dispatch) => {
    const accessExpirationTime =
      Date.now() + +import.meta.env.VITE_ACCESS_EXPIRATION_TIME;

    saveAuthToLocal({
      accessExpirationTime,
      name,
      profileImage,
    });
    dispatch(
      authActions.login({
        accessExpirationTime,
        name,
        profileImage,
      })
    );

    showSuccess({ message: 'Logged in successfully' });

    const autoLogoutTime = calculateRemainingTime(accessExpirationTime);
    setTimeout(() => {
      removeAuthFromLocal();
      dispatch(authActions.logout());
      showInfo({ message: 'Session Expired' });
    }, autoLogoutTime);
  };
};

const updateUserInfoHandler = ({ name, profileImage }) => {
  return (dispatch) => {
    const authDetails = getAuthFromLocal();

    authDetails.name = name;
    authDetails.profileImage = profileImage;

    saveAuthToLocal(authDetails);

    dispatch(
      authActions.updateUserInfo({
        name,
        profileImage,
      })
    );
  };
};

export { checkLoginStatus, loginHandler, logoutHandler, updateUserInfoHandler };
