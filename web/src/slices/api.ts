import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: [],
  endpoints: (builder) => ({
    createDeploymentUploadLink: builder.mutation({
      query: () => ({
        url: 'deployments/upload',
        method: 'POST',
      }),
    }),
  }),
});

export const { useCreateDeploymentUploadLinkMutation } = api;