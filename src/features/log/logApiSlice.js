import apiSlice from '../../app/api/apiSlice';

export const logApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLoggerKey: builder.query({
      query: () => ({
        url: '/users/logger-key',
      }),
    }),
  }),
});

export const { useGetLoggerKeyQuery } = logApiSlice;
