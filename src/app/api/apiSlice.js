import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logoutHandler } from '../../features/auth/authAction';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BASE_URL,
  prepareHeaders: (headers) => {
    return headers;
  },
});

const baseQueryWithReAuth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    api.dispatch(logoutHandler());
  }

  return result;
};

const apiSlice = createApi({
  baseQuery: baseQueryWithReAuth,
  tagTypes: ['User'],
  endpoints: () => ({}),
});

export default apiSlice;
