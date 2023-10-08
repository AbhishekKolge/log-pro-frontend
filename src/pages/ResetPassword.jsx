import { TextField, Container, Typography, Button, Box } from '@mui/material';

const ResetPasswordPage = () => {
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
        <TextField required fullWidth label='Email Address' />
        <TextField required fullWidth label='Code' />
        <TextField required fullWidth label='Password' type='password' />
        <Button size='large' variant='contained' fullWidth>
          reset password
        </Button>
      </Box>
    </Container>
  );
};

export default ResetPasswordPage;
