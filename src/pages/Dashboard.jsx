import { useState } from 'react';
import { Typography, Stack, Card, CardContent } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import dayjs from 'dayjs';

import TimeFilter from '../components/TimeFilter/TimeFilter';
import ChartBox from '../components/ChartBox/ChartBox';

import { useGetAnalyticsQuery } from '../features/log/logApiSlice';

const DashboardPage = () => {
  const [selectionRange, setSelectionRange] = useState({
    startDate: dayjs().startOf('day').toDate(),
    endDate: dayjs().endOf('day').toDate(),
    key: 'selection',
  });

  const { data: analyticsData, isLoading: analyticsIsLoading } =
    useGetAnalyticsQuery(
      {
        startDate: new Date(selectionRange.startDate).getTime(),
        endDate: new Date(selectionRange.endDate).getTime(),
      },
      {
        skip: selectionRange.startDate && selectionRange.endDate ? false : true,
      }
    );

  const selectionHandler = (ranges) => {
    ranges.selection.startDate = dayjs(ranges.selection.startDate)
      .startOf('day')
      .toDate();
    ranges.selection.endDate = dayjs(ranges.selection.endDate)
      .endOf('day')
      .toDate();
    setSelectionRange(ranges.selection);
  };

  return (
    <Stack spacing={3}>
      <Typography variant='h4'>Dashboard</Typography>
      <Grid container spacing={3}>
        <Grid xs={12} lg={6}>
          <TimeFilter
            selectionRange={selectionRange}
            onSelection={selectionHandler}
            moveRangeOnFirstSelection={true}
            retainEndDateOnFirstSelection={true}
          />
        </Grid>
        <Grid xs={12} lg={6}>
          <Stack spacing={3}>
            <Card>
              <CardContent>
                <Stack direction='row' justifyContent='space-between'>
                  <ChartBox
                    count={analyticsData?.usersCount}
                    data={analyticsData?.users}
                    title='Users'
                    isLoading={analyticsIsLoading}
                  />
                  <ChartBox
                    count={analyticsData?.requestCount}
                    data={analyticsData?.request}
                    title='Request'
                    isLoading={analyticsIsLoading}
                  />
                  <ChartBox
                    count={analyticsData?.failedRequestCount}
                    data={analyticsData?.failedRequest}
                    title='Failure'
                    isLoading={analyticsIsLoading}
                  />
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default DashboardPage;
