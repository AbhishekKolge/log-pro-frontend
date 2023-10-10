import {
  TextField,
  Container,
  Typography,
  Button,
  Box,
  Link,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useFormik } from 'formik';

import { showSuccess, showError } from '../snackbar/snackbarAction';

import { useForgotPasswordMutation } from '../features/auth/authApiSlice';

const forgotPasswordValidationSchema = Yup.object({
  email: Yup.string().trim().email('Email is not valid').required('Required'),
});

const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  const [
    forgotPassword,
    { isLoading: forgotPasswordIsLoading, isSuccess: forgotPasswordIsSuccess },
  ] = useForgotPasswordMutation();

  const forgotPasswordFormik = useFormik({
    initialValues: {
      email: '',
    },
    enableReinitialize: true,
    validationSchema: forgotPasswordValidationSchema,
    onSubmit: (values) => {
      forgotPassword(values)
        .unwrap()
        .then(() => {
          forgotPasswordFormik.resetForm();
          showSuccess({ message: 'Reset code sent successfully' });
          navigate('/auth/reset-password', {
            state: {
              email: values.email,
            },
          });
        })
        .catch((error) => {
          if (error.status === 409) {
            forgotPasswordFormik.resetForm();
            navigate('/auth/reset-password', {
              state: {
                email: values.email,
              },
            });
          }
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
      <form noValidate onSubmit={forgotPasswordFormik.handleSubmit}>
        <Box alignContent='center' sx={{ display: 'grid', gap: '1rem' }}>
          <Typography
            component='h1'
            variant='h5'
            align='center'
            gutterBottom={true}
          >
            Reset Your Password
          </Typography>
          <Typography variant='body2'>
            Enter your email address and we will send you a password reset code.
          </Typography>

          <TextField
            required
            fullWidth
            label='Email Address'
            name='email'
            value={forgotPasswordFormik.values.email}
            onBlur={forgotPasswordFormik.handleBlur}
            onChange={forgotPasswordFormik.handleChange}
            helperText={
              !!forgotPasswordFormik.touched.email &&
              !!forgotPasswordFormik.errors.email &&
              forgotPasswordFormik.errors.email
            }
            error={
              !!forgotPasswordFormik.touched.email &&
              !!forgotPasswordFormik.errors.email
            }
          />

          <Button
            size='large'
            variant='contained'
            fullWidth
            disabled={forgotPasswordIsLoading || forgotPasswordIsSuccess}
            type='submit'
          >
            Get Reset Code
          </Button>
          <Link href='/auth/login' variant='body2' align='center'>
            Go back to sign in
          </Link>
        </Box>
      </form>
    </Container>
  );
};

export default ForgotPasswordPage;
