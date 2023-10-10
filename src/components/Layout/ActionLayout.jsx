import { useEffect, useState } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, CircularProgress } from '@mui/material';

import ScrollToTop from '../../scrollToTop';
import { checkLoginStatus } from '../../features/auth/authAction';
import { useFirstRender } from '../../hooks/optimization';

const ActionLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const loginStatus = useSelector((state) => state.auth.isLoggedIn);
  const [isAuthScreen, setIsAuthScreen] = useState(null);
  const { firstRender } = useFirstRender();

  useEffect(() => {
    firstRender && dispatch(checkLoginStatus());
  }, [dispatch, firstRender]);

  useEffect(() => {
    if (loginStatus && isAuthScreen) {
      navigate('/dashboard', { replace: true });
    }
    if (loginStatus === false && isAuthScreen === false) {
      navigate('/auth/login', { replace: true });
    }
  }, [loginStatus, dispatch, navigate, isAuthScreen]);

  useEffect(() => {
    setIsAuthScreen(
      location.pathname === '/auth/sign-up' ||
        location.pathname === '/auth/login' ||
        location.pathname === '/auth/forgot-password' ||
        location.pathname === '/auth/reset-password' ||
        location.pathname === '/auth/verify' ||
        location.pathname === '/'
    );
  }, [location]);

  return (
    <>
      <ScrollToTop />
      {(loginStatus === false && isAuthScreen) ||
      (loginStatus && isAuthScreen === false) ? (
        <Box sx={{ minHeight: '100vh' }}>
          <Outlet />
        </Box>
      ) : (
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress color='primary' size={60} />
        </Box>
      )}
    </>
  );
};

export default ActionLayout;
