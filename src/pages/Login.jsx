import {
  TextField,
  Container,
  Typography,
  Button,
  Link,
  Box,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import YupPassword from 'yup-password';
import { useFormik } from 'formik';

import { showSuccess, showError } from '../snackbar/snackbarAction';

import { useLoginMutation } from '../features/auth/authApiSlice';
import { loginHandler } from '../features/auth/authAction';

YupPassword(Yup);

const loginValidationSchema = Yup.object({
  email: Yup.string().trim().email('Email is not valid').required('Required'),
  password: Yup.string()
    .trim()
    .password()
    .min(8, 'Must be minimum 8 characters')
    .minLowercase(1, 'Must include 1 lowercase letter')
    .minUppercase(1, 'Must include 1 uppercase letter')
    .minSymbols(1, 'Must include 1 special letter')
    .minNumbers(1, 'Must include 1 number letter')
    .required('Required'),
});

const LoginPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading: loginIsLoading, isSuccess: loginIsSuccess }] =
    useLoginMutation();

  const loginFormik = useFormik({
    initialValues: {
      email: location.state?.email || '',
      password: '',
    },
    enableReinitialize: true,
    validationSchema: loginValidationSchema,
    onSubmit: (values) => {
      login(values)
        .unwrap()
        .then((data) => {
          loginFormik.resetForm();
          dispatch(loginHandler(data));
          showSuccess({ message: 'Logged in successfully' });
          navigate('/dashboard', { replace: true });
        })
        .catch((error) => {
          if (error.data?.msg) {
            showError({ message: error.data.msg });
          } else {
            showError({ message: 'Something went wrong!, please try again' });
          }
        });
    },
  });

  return (
    <Container
      component='main'
      maxWidth='xs'
      sx={{ minHeight: '100vh', display: 'grid', alignItems: 'center' }}
    >
      <form noValidate onSubmit={loginFormik.handleSubmit}>
        <Box alignContent='center' sx={{ display: 'grid', gap: '1rem' }}>
          <Typography
            component='h1'
            variant='h5'
            align='center'
            gutterBottom={true}
          >
            Sign in to LogPro
          </Typography>
          <TextField
            required
            fullWidth
            label='Email Address'
            name='email'
            value={loginFormik.values.email}
            onBlur={loginFormik.handleBlur}
            onChange={loginFormik.handleChange}
            helperText={
              !!loginFormik.touched.email &&
              !!loginFormik.errors.email &&
              loginFormik.errors.email
            }
            error={!!loginFormik.touched.email && !!loginFormik.errors.email}
          />
          <TextField
            required
            fullWidth
            label='Password'
            type='password'
            name='password'
            value={loginFormik.values.password}
            onBlur={loginFormik.handleBlur}
            onChange={loginFormik.handleChange}
            helperText={
              !!loginFormik.touched.password &&
              !!loginFormik.errors.password &&
              loginFormik.errors.password
            }
            error={
              !!loginFormik.touched.password && !!loginFormik.errors.password
            }
          />
          <Button
            size='large'
            variant='contained'
            fullWidth
            disabled={loginIsLoading || loginIsSuccess}
            type='submit'
          >
            sign in
          </Button>
          <Link href='/auth/sign-up' variant='body2' align='center'>
            {"Don't have an account? Sign Up"}
          </Link>
          <Link href='/auth/forgot-password' variant='body2' align='center'>
            Forgot password?
          </Link>

          <Link href='/auth/verify' variant='body2' align='center'>
            Verify email
          </Link>
        </Box>
      </form>
    </Container>
  );
};

export default LoginPage;
