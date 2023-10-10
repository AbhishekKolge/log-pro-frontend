import apiSlice from '../../app/api/apiSlice';

import { omitNullishKeys } from '../../utils/helper';

export const logApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLoggerKey: builder.query({
      query: () => ({
        url: '/users/logger-key',
      }),
    }),
    getAllLogs: builder.query({
      query: (queries) => {
        return {
          url: '/logs',
          params: omitNullishKeys(queries),
        };
      },
      providesTags: ['Log'],
    }),
    getAnalytics: builder.query({
      query: (queries) => {
        return {
          url: '/logs/analytics',
          params: omitNullishKeys(queries),
        };
      },
      providesTags: ['Analytics'],
    }),
  }),
});

export const {
  useGetLoggerKeyQuery,
  useGetAllLogsQuery,
  useGetAnalyticsQuery,
} = logApiSlice;
