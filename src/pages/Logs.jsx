import { useEffect, useReducer, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  Typography,
  Stack,
  Card,
  CardContent,
  TextField,
  Select,
  MenuItem,
  Button,
  InputLabel,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

import CollapsibleRow from '../components/CollapsibleRow/CollapsibleRow';

import { showError } from '../snackbar/snackbarAction';
import { omitEmptyKeys, pickExactObjKeys } from '../utils/helper';

import { useGetAllLogsQuery } from '../features/log/logApiSlice';

const initialQueryFilterState = {
  search: null,
  status: null,
  method: null,
  processingTime: null,
  sort: null,
  page: 1,
};

const initialLogState = {
  totalCount: 0,
  firstRender: true,
};

const queryFilterReducer = (state, action) => {
  if (action.type === 'CHANGE_PAGE') {
    return {
      ...state,
      page: action.page,
    };
  }
  if (action.type === 'SEARCH') {
    return {
      ...state,
      page: initialQueryFilterState.page,
      search: action.search,
    };
  }
  if (action.type === 'SET_FILTERS') {
    return {
      ...state,
      ...action.filters,
    };
  }
  if (action.type === 'SET_STATUS') {
    return {
      ...state,
      page: initialQueryFilterState.page,
      status: action.status,
    };
  }
  if (action.type === 'SET_METHOD') {
    return {
      ...state,
      page: initialQueryFilterState.page,
      method: action.method,
    };
  }
  if (action.type === 'SET_PROCESSING_TIME') {
    return {
      ...state,
      page: initialQueryFilterState.page,
      processingTime: action.processingTime,
    };
  }
  if (action.type === 'SET_SORT') {
    return {
      ...state,
      page: initialQueryFilterState.page,
      sort: action.sort,
    };
  }
  if (action.type === 'RESET_FILTERS') {
    return {
      ...initialQueryFilterState,
    };
  }
  return initialQueryFilterState;
};

const logReducer = (state, action) => {
  if (action.type === 'SET_TOTAL_COUNT') {
    return {
      ...state,
      totalCount: action.totalCount,
    };
  }
  if (action.type === 'DISABLE_FIRST_RENDER') {
    return {
      ...state,
      firstRender: false,
    };
  }
  return initialLogState;
};

const LogsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams('');
  const [queryFilterState, dispatchQueryFilter] = useReducer(
    queryFilterReducer,
    initialQueryFilterState
  );
  const [logsState, dispatchLogs] = useReducer(logReducer, initialLogState);
  const [expandedRowId, setExpandedRowId] = useState(null);

  const expandRowHandler = (id) => {
    setExpandedRowId((prevState) => (prevState === id ? null : id));
  };

  const {
    data: logData,
    isLoading: logIsLoading,
    isFetching: logIsFetching,
    isSuccess: logIsSuccess,
    error: logError,
  } = useGetAllLogsQuery(queryFilterState, {
    skip: logsState.firstRender,
  });

  const pageChangeHandler = (_, page) => {
    dispatchQueryFilter({ type: 'CHANGE_PAGE', page });
  };

  const searchHandler = (e) => {
    const search = e.target.value;
    dispatchQueryFilter({ type: 'SEARCH', search });
  };

  const resetFilterHandler = () => {
    dispatchQueryFilter({ type: 'RESET_FILTERS' });
  };

  const statusHandler = (e) => {
    const status = e.target.value;
    dispatchQueryFilter({ type: 'SET_STATUS', status });
  };

  const methodHandler = (e) => {
    const method = e.target.value;
    dispatchQueryFilter({ type: 'SET_METHOD', method });
  };

  const processingTimeHandler = (e) => {
    const processingTime = e.target.value;
    dispatchQueryFilter({ type: 'SET_PROCESSING_TIME', processingTime });
  };

  const sortHandler = (e) => {
    const sort = e.target.value;
    dispatchQueryFilter({ type: 'SET_SORT', sort });
  };

  useEffect(() => {
    if (logError) {
      if (logError?.data?.msg) {
        showError({ message: logError.data.msg });
      } else {
        showError({ message: 'Something went wrong!, please try again' });
      }
    }

    if (logIsSuccess) {
      dispatchLogs({
        type: 'SET_TOTAL_COUNT',
        totalCount: logData.totalLogs,
      });
    }
  }, [logError, logIsSuccess, logData]);

  useEffect(() => {
    if (logsState.firstRender) {
      const search = omitEmptyKeys(JSON.parse(searchParams.get('search')));
      const filters = pickExactObjKeys(queryFilterState, search);
      dispatchQueryFilter({
        type: 'SET_FILTERS',
        filters,
      });

      dispatchLogs({ type: 'DISABLE_FIRST_RENDER' });
    }
  }, [searchParams, logsState.firstRender, queryFilterState]);

  useEffect(() => {
    if (!logsState.firstRender) {
      setSearchParams(
        {
          search: JSON.stringify({
            ...queryFilterState,
          }),
        },
        { replace: true }
      );
    }
  }, [queryFilterState, setSearchParams, logsState.firstRender]);

  return (
    <Stack spacing={3}>
      <Typography variant='h4'>Logs</Typography>
      <Card>
        <CardContent>
          <Stack spacing={3}>
            <Grid container spacing={3}>
              <Grid xs={12} md={4}>
                <InputLabel>URL</InputLabel>
                <TextField
                  size='small'
                  fullWidth
                  label='Search URL'
                  value={queryFilterState.search || ''}
                  onChange={searchHandler}
                />
              </Grid>
              <Grid xs={12} md={4}>
                <InputLabel>Status</InputLabel>
                <Select
                  fullWidth
                  size='small'
                  value={queryFilterState.status || ''}
                  onChange={statusHandler}
                >
                  <MenuItem value=''>None</MenuItem>
                  <MenuItem value='successful'>Successful</MenuItem>
                  <MenuItem value='failed'>Failed</MenuItem>
                </Select>
              </Grid>
              <Grid xs={12} md={4}>
                <InputLabel>Method</InputLabel>
                <Select
                  fullWidth
                  size='small'
                  value={queryFilterState.method || ''}
                  onChange={methodHandler}
                >
                  <MenuItem value=''>None</MenuItem>
                  <MenuItem value='get'>Get</MenuItem>
                  <MenuItem value='post'>Post</MenuItem>
                  <MenuItem value='patch'>Patch</MenuItem>
                  <MenuItem value='put'>Put</MenuItem>
                  <MenuItem value='delete'>Delete</MenuItem>
                </Select>
              </Grid>
              <Grid xs={12} md={4}>
                <InputLabel>Processing Time</InputLabel>
                <Select
                  fullWidth
                  size='small'
                  value={queryFilterState.processingTime || ''}
                  onChange={processingTimeHandler}
                >
                  <MenuItem value=''>None</MenuItem>
                  <MenuItem value='highest'>High to Low</MenuItem>
                  <MenuItem value='lowest'>Low to Hight</MenuItem>
                </Select>
              </Grid>
              <Grid xs={12} md={4}>
                <InputLabel>Sort</InputLabel>
                <Select
                  fullWidth
                  size='small'
                  value={queryFilterState.sort || ''}
                  onChange={sortHandler}
                >
                  <MenuItem value=''>None</MenuItem>
                  <MenuItem value='newest'>Newest</MenuItem>
                  <MenuItem value='oldest'>Oldest</MenuItem>
                </Select>
              </Grid>
              <Grid xs={12} md={4}>
                <Button
                  type='button'
                  onClick={resetFilterHandler}
                  size='small'
                  variant='contained'
                  fullWidth
                  sx={{
                    height: '40px',
                    marginTop: '22px',
                  }}
                >
                  clear all filters
                </Button>
              </Grid>
            </Grid>
          </Stack>
        </CardContent>
      </Card>
      <TableContainer
        sx={(theme) => {
          return {
            width: 'calc(100vw - 8rem)',
            [theme.breakpoints.down('lg')]: {
              width: 'calc(100vw - 4rem - 65px)',
            },
            [theme.breakpoints.down('md')]: {
              width: 'calc(100vw - 2rem)',
            },
          };
        }}
        component={Paper}
      >
        <Table
          responsive
          sx={(theme) => {
            return {
              [theme.breakpoints.down('md')]: {
                width: '100%',
              },
            };
          }}
          aria-label='simple table'
        >
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Req. Time</TableCell>
              <TableCell align='center'>Processing Time (ms)</TableCell>
              <TableCell align='center'>Method</TableCell>
              <TableCell align='center'>Remote Address</TableCell>
              <TableCell align='left'>Endpoint</TableCell>
              <TableCell align='center'>Status Code</TableCell>
              <TableCell align='right'>Status Message</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!logIsLoading &&
              !logIsFetching &&
              !!logData?.logs?.length &&
              logData?.logs.map((log) => {
                const isExpanded = expandedRowId === log.id;
                return (
                  <CollapsibleRow
                    key={log.id}
                    log={log}
                    isExpanded={isExpanded}
                    onExpand={expandRowHandler}
                  />
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      {!logsState.firstRender && (
        <Typography align='center'>
          {logIsLoading || logIsFetching
            ? 'Loading...'
            : logData?.logs?.length
            ? ''
            : 'No data found'}
        </Typography>
      )}
      <Pagination
        count={Math.ceil(logsState.totalCount / 10)}
        page={queryFilterState.page}
        onChange={pageChangeHandler}
      />
    </Stack>
  );
};

export default LogsPage;
