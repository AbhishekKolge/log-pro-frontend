import {
  Stack,
  Typography,
  CircularProgress,
  Box,
  Card,
  CardContent,
} from '@mui/material';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

const ChartBox = (props) => {
  const { data, title, isLoading } = props;

  let count = 0;

  if (data?.length) {
    for (const item of data) {
      count += item.count;
    }
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3}>
          <Stack justifyContent='center' alignItems='center'>
            <Typography color='text.secondary' variant='overline'>
              {title}
            </Typography>
            {isLoading ? (
              <CircularProgress color='primary' size={30} />
            ) : (
              <Typography variant='h4'>{count}</Typography>
            )}
          </Stack>
          <Box
            sx={(theme) => {
              return {
                minHeight: '100px',
                minWidth: '265px',
                [theme.breakpoints.down('lg')]: {
                  height: '100px',
                },
              };
            }}
          >
            {!isLoading && !!data?.length && (
              <ResponsiveContainer width='100%' height='100%'>
                <LineChart width={300} height={100} data={data}>
                  <Line
                    type='monotone'
                    dataKey='count'
                    stroke='#8884d8'
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ChartBox;
