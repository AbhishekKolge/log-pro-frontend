import {
  TextField,
  Container,
  Typography,
  Button,
  Box,
  Link,
} from '@mui/material';

const ForgotPasswordPage = () => {
  return (
    <Container
      component='main'
      maxWidth='xs'
      sx={{ minHeight: '100vh', display: 'grid', alignItems: 'center' }}
    >
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

        <TextField required fullWidth label='Email Address' />

        <Button size='large' variant='contained' fullWidth>
          Get Reset Code
        </Button>
        <Link href='/auth/login' variant='body2' align='center'>
          Go back to sign in
        </Link>
      </Box>
    </Container>
  );
};

export default ForgotPasswordPage;
