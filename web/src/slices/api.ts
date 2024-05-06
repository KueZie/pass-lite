import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface CreateDeploymentUploadLinkRequest {
  name: string;
}

export interface CreateDeploymentUploadLinkResponse {
  uploadUrl: string;
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  tagTypes: [],
  endpoints: (builder) => ({
    createDeploymentUploadLink: builder.mutation<CreateDeploymentUploadLinkResponse, CreateDeploymentUploadLinkRequest>({
      query: ({name}) => ({
        url: 'deployment/upload',
        method: 'POST',
        body: { name },
      }),
    }),
  }),
});

export const { useCreateDeploymentUploadLinkMutation } = api;