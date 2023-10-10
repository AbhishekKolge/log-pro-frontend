import { Stack, Typography, CircularProgress } from '@mui/material';

const ChartBox = (props) => {
  const { count, title, isLoading } = props;

  return (
    <Stack direction='row' spacing={3}>
      <Stack spacing={1} justifyContent='center' alignItems='center'>
        <Typography color='text.secondary' variant='overline'>
          {title}
        </Typography>
        {isLoading ? (
          <CircularProgress color='primary' size={30} />
        ) : (
          <Typography variant='h4'>{count}</Typography>
        )}
      </Stack>
    </Stack>
  );
};

export default ChartBox;
