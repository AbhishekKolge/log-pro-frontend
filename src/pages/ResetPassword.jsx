import { TextField, Container, Typography, Button, Box } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useFormik } from 'formik';

import { showSuccess, showError } from '../snackbar/snackbarAction';

import { useResetPasswordMutation } from '../features/auth/authApiSlice';

const resetPasswordValidationSchema = Yup.object({
  email: Yup.string().trim().email('Email is not valid').required('Required'),
  token: Yup.string().trim().required('Required'),
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

const ResetPasswordPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [
    resetPassword,
    { isLoading: resetPasswordIsLoading, isSuccess: resetPasswordIsSuccess },
  ] = useResetPasswordMutation();

  const resetPasswordFormik = useFormik({
    initialValues: {
      email: location.state?.email || '',
      token: '',
      password: '',
    },
    enableReinitialize: true,
    validationSchema: resetPasswordValidationSchema,
    onSubmit: (values) => {
      resetPassword(values)
        .unwrap()
        .then(() => {
          resetPasswordFormik.resetForm();
          showSuccess({ message: 'Password reset successfully' });
          navigate('/auth/login', {
            state: {
              email: values.email,
            },
          });
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
      <form noValidate onSubmit={resetPasswordFormik.handleSubmit}>
        <Box alignContent='center' sx={{ display: 'grid', gap: '1rem' }}>
          <Typography
            component='h1'
            variant='h5'
            align='center'
            gutterBottom={true}
          >
            Reset Your Password
          </Typography>
          <TextField
            required
            fullWidth
            label='Email Address'
            name='email'
            value={resetPasswordFormik.values.email}
            onBlur={resetPasswordFormik.handleBlur}
            onChange={resetPasswordFormik.handleChange}
            helperText={
              !!resetPasswordFormik.touched.email &&
              !!resetPasswordFormik.errors.email &&
              resetPasswordFormik.errors.email
            }
            error={
              !!resetPasswordFormik.touched.email &&
              !!resetPasswordFormik.errors.email
            }
          />
          <TextField
            required
            fullWidth
            label='Code'
            name='token'
            value={resetPasswordFormik.values.token}
            onBlur={resetPasswordFormik.handleBlur}
            onChange={resetPasswordFormik.handleChange}
            helperText={
              !!resetPasswordFormik.touched.token &&
              !!resetPasswordFormik.errors.token &&
              resetPasswordFormik.errors.token
            }
            error={
              !!resetPasswordFormik.touched.token &&
              !!resetPasswordFormik.errors.token
            }
          />
          <TextField
            required
            fullWidth
            label='Password'
            type='password'
            name='password'
            value={resetPasswordFormik.values.password}
            onBlur={resetPasswordFormik.handleBlur}
            onChange={resetPasswordFormik.handleChange}
            helperText={
              !!resetPasswordFormik.touched.password &&
              !!resetPasswordFormik.errors.password &&
              resetPasswordFormik.errors.password
            }
            error={
              !!resetPasswordFormik.touched.password &&
              !!resetPasswordFormik.errors.password
            }
          />
          <Button
            size='large'
            variant='contained'
            fullWidth
            disabled={resetPasswordIsLoading || resetPasswordIsSuccess}
            type='submit'
          >
            reset password
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default ResetPasswordPage;
