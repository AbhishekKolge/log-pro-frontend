import {
  TextField,
  Container,
  Typography,
  Button,
  Link,
  Box,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useFormik } from 'formik';

import { showSuccess, showError } from '../snackbar/snackbarAction';

import { useVerifyMutation } from '../features/auth/authApiSlice';

const verifyValidationSchema = Yup.object({
  email: Yup.string().trim().email('Email is not valid').required('Required'),
  token: Yup.string().trim().required('Required'),
});

const VerifyPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [verify, { isLoading: verifyIsLoading, isSuccess: verifyIsSuccess }] =
    useVerifyMutation();

  const verifyFormik = useFormik({
    initialValues: {
      email: location.state?.email || '',
      token: '',
    },
    enableReinitialize: true,
    validationSchema: verifyValidationSchema,
    onSubmit: (values) => {
      verify(values)
        .unwrap()
        .then(() => {
          verifyFormik.resetForm();
          showSuccess({ message: 'Verified successfully' });
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
      <form noValidate onSubmit={verifyFormik.handleSubmit}>
        <Box alignContent='center' sx={{ display: 'grid', gap: '1rem' }}>
          <Typography
            component='h1'
            variant='h5'
            align='center'
            gutterBottom={true}
          >
            Verify your account
          </Typography>
          <TextField
            required
            fullWidth
            label='Email Address'
            name='email'
            value={verifyFormik.values.email}
            onBlur={verifyFormik.handleBlur}
            onChange={verifyFormik.handleChange}
            helperText={
              !!verifyFormik.touched.email &&
              !!verifyFormik.errors.email &&
              verifyFormik.errors.email
            }
            error={!!verifyFormik.touched.email && !!verifyFormik.errors.email}
          />
          <TextField
            required
            fullWidth
            label='Code'
            name='token'
            value={verifyFormik.values.token}
            onBlur={verifyFormik.handleBlur}
            onChange={verifyFormik.handleChange}
            helperText={
              !!verifyFormik.touched.token &&
              !!verifyFormik.errors.token &&
              verifyFormik.errors.token
            }
            error={!!verifyFormik.touched.token && !!verifyFormik.errors.token}
          />
          <Button
            size='large'
            variant='contained'
            fullWidth
            disabled={verifyIsLoading || verifyIsSuccess}
            type='submit'
          >
            Verify
          </Button>
          <Link href='/auth/login' variant='body2' align='center'>
            Go back to sign in
          </Link>
        </Box>
      </form>
    </Container>
  );
};

export default VerifyPage;
