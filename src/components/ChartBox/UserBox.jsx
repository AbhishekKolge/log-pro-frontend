import {
  Stack,
  Typography,
  CircularProgress,
  Card,
  CardContent,
} from '@mui/material';

const UserBox = (props) => {
  const { data, title, isLoading } = props;

  let count = 0;

  if (data?.length) {
    count = data[0].count;
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ height: '100%' }}>
        <Stack
          spacing={3}
          justifyContent='center'
          alignItems='center'
          height='100%'
        >
          <Typography color='text.secondary' variant='overline'>
            {title}
          </Typography>
          {isLoading ? (
            <CircularProgress color='primary' size={30} />
          ) : (
            <Typography variant='h4'>{count}</Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default UserBox;
