import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logoutHandler } from '../../features/auth/authAction';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BASE_URL,
  credentials: 'include',
  prepareHeaders: (headers) => {
    return headers;
  },
});

const baseQueryWithReAuth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  console.log(result);
  if (result?.error?.status === 401) {
    api.dispatch(logoutHandler({ isSession: true }));
  }

  return result;
};

const apiSlice = createApi({
  baseQuery: baseQueryWithReAuth,
  tagTypes: ['User', 'Log', 'Analytics'],
  endpoints: () => ({}),
});

export default apiSlice;
