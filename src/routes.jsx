import { createBrowserRouter, Navigate } from 'react-router-dom';

import ActionLayout from './components/Layout/ActionLayout';
import PrimaryLayout from './components/Layout/PrimaryLayout';
import LoginPage from './pages/Login';
import SignUpPage from './pages/SignUp';
import ForgotPasswordPage from './pages/ForgotPassword';
import ResetPasswordPage from './pages/ResetPassword';
import VerifyPage from './pages/Verify';
import DashboardPage from './pages/Dashboard';
import LogsPage from './pages/Logs';
import ProfilePage from './pages/Profile';

const router = createBrowserRouter([
  {
    element: <ActionLayout />,
    children: [
      {
        path: '',
        children: [
          {
            index: true,
            element: <Navigate to='auth' replace={true} />,
          },
          {
            path: 'auth',
            children: [
              {
                index: true,
                element: <Navigate to='login' replace={true} />,
              },
              {
                path: 'login',
                element: <LoginPage />,
              },
              {
                path: 'sign-up',
                element: <SignUpPage />,
              },
              {
                path: 'forgot-password',
                element: <ForgotPasswordPage />,
              },
              {
                path: 'reset-password',
                element: <ResetPasswordPage />,
              },
              {
                path: 'verify',
                element: <VerifyPage />,
              },
            ],
          },
        ],
      },
      {
        element: <PrimaryLayout />,
        children: [
          {
            path: 'dashboard',
            element: <DashboardPage />,
          },
          {
            path: 'logs',
            element: <LogsPage />,
          },
          {
            path: 'profile',
            element: <ProfilePage />,
          },
        ],
      },

      {
        path: '*',
        element: <Navigate to='/' replace={true} />,
      },
    ],
  },
]);

export default router;
