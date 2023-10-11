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
    <Card>
      <CardContent>
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
          <Box sx={{ minHeight: '100px', minWidth: '500px' }}>
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
