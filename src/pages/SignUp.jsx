import {
  TextField,
  Container,
  Typography,
  Button,
  Link,
  Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import YupPassword from 'yup-password';
import { useFormik } from 'formik';

import { showSuccess, showError } from '../snackbar/snackbarAction';

import { useRegisterMutation } from '../features/auth/authApiSlice';

YupPassword(Yup);

const signUpValidationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .max(20, 'Too long')
    .min(3, 'Too short')
    .required('Required'),
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

const SignUpPage = () => {
  const navigate = useNavigate();

  const [
    register,
    { isLoading: registerIsLoading, isSuccess: registerIsSuccess },
  ] = useRegisterMutation();

  const signUpFormik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
    },
    enableReinitialize: true,
    validationSchema: signUpValidationSchema,
    onSubmit: (values) => {
      register(values)
        .unwrap()
        .then(() => {
          signUpFormik.resetForm();
          showSuccess({ message: 'Registered successfully' });
          navigate('/auth/verify', {
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
      <form noValidate onSubmit={signUpFormik.handleSubmit}>
        <Box alignContent='center' sx={{ display: 'grid', gap: '1rem' }}>
          <Typography
            component='h1'
            variant='h5'
            align='center'
            gutterBottom={true}
          >
            Sign up to LogPro
          </Typography>
          <TextField
            required
            fullWidth
            label='Name'
            name='name'
            value={signUpFormik.values.name}
            onBlur={signUpFormik.handleBlur}
            onChange={signUpFormik.handleChange}
            helperText={
              !!signUpFormik.touched.name &&
              !!signUpFormik.errors.name &&
              signUpFormik.errors.name
            }
            error={!!signUpFormik.touched.name && !!signUpFormik.errors.name}
          />
          <TextField
            required
            fullWidth
            label='Email Address'
            name='email'
            value={signUpFormik.values.email}
            onBlur={signUpFormik.handleBlur}
            onChange={signUpFormik.handleChange}
            helperText={
              !!signUpFormik.touched.email &&
              !!signUpFormik.errors.email &&
              signUpFormik.errors.email
            }
            error={!!signUpFormik.touched.email && !!signUpFormik.errors.email}
          />
          <TextField
            required
            fullWidth
            label='Password'
            type='password'
            name='password'
            value={signUpFormik.values.password}
            onBlur={signUpFormik.handleBlur}
            onChange={signUpFormik.handleChange}
            helperText={
              !!signUpFormik.touched.password &&
              !!signUpFormik.errors.password &&
              signUpFormik.errors.password
            }
            error={
              !!signUpFormik.touched.password && !!signUpFormik.errors.password
            }
          />
          <Button
            size='large'
            variant='contained'
            fullWidth
            disabled={registerIsLoading || registerIsSuccess}
            type='submit'
          >
            sign up
          </Button>
          <Link href='/auth/login' variant='body2' align='center'>
            Already have an account? Sign In
          </Link>
          <Link href='/auth/forgot-password' variant='body2' align='center'>
            Forgot password?
          </Link>
        </Box>
      </form>
    </Container>
  );
};

export default SignUpPage;
