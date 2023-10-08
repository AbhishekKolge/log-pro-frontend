import { authActions } from './authSlice';
import { checkTimeIsExpired, calculateRemainingTime } from '../../utils/time';

import {
  saveAuthToLocal,
  getAuthFromLocal,
  removeAuthFromLocal,
} from '../../utils/storage';

const logoutHandler = () => {
  return (dispatch) => {
    removeAuthFromLocal();
    dispatch(authActions.logout());
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
        return;
      }

      dispatch(authActions.login(authDetails));
      const autoLogoutTime = calculateRemainingTime(
        authDetails.accessExpirationTime
      );
      setTimeout(() => {
        removeAuthFromLocal();
        dispatch(authActions.logout());
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

    const autoLogoutTime = calculateRemainingTime(accessExpirationTime);
    setTimeout(() => {
      removeAuthFromLocal();
      dispatch(authActions.logout());
    }, autoLogoutTime);
  };
};

export { checkLoginStatus, loginHandler, logoutHandler };
