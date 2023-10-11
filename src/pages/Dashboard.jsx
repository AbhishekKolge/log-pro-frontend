import { useState, useEffect } from 'react';
import { Typography, Stack } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import dayjs from 'dayjs';

import TimeFilter from '../components/TimeFilter/TimeFilter';
import ChartBox from '../components/ChartBox/ChartBox';

import { showError } from '../snackbar/snackbarAction';

import { useGetAnalyticsQuery } from '../features/log/logApiSlice';

const DashboardPage = () => {
  const [selectionRange, setSelectionRange] = useState({
    startDate: dayjs().startOf('day').toDate(),
    endDate: dayjs().endOf('day').toDate(),
    key: 'selection',
  });

  const {
    data: analyticsData,
    isLoading: analyticsIsLoading,
    error: analyticsError,
    isFetching: analyticsIsFetching,
  } = useGetAnalyticsQuery(
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

  useEffect(() => {
    if (analyticsError) {
      if (analyticsError?.data?.msg) {
        showError({ message: analyticsError.data.msg });
      } else {
        showError({ message: 'Something went wrong!, please try again' });
      }
    }
  }, [analyticsError]);

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
            <ChartBox
              data={analyticsData?.request}
              title='Request'
              isLoading={analyticsIsLoading || analyticsIsFetching}
            />
            <ChartBox
              data={analyticsData?.failedRequest}
              title='Failure'
              isLoading={analyticsIsLoading || analyticsIsFetching}
            />
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default DashboardPage;
