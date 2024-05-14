import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Deployment } from '@/types/Deployment';

export interface BaseApiResponse {
  timestamp: string;
}

export interface CreateDeploymentUploadLinkRequest {
  name: string;
}

export interface CreateDeploymentUploadLinkResponse {
  uploadUrl: string;
}

export interface CreateDeploymentRequest {
  name: string;
  description: string;
  type: 'STATIC_SITE';
}

export interface CreateDeploymentResponse {}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: [],
  endpoints: (builder) => ({
    createDeployment: builder.mutation<CreateDeploymentResponse, CreateDeploymentRequest>({
      query: (body) => ({
        url: `deployment`,
        method: 'POST',
        body,
      }),
    }),
    createDeploymentUploadLink: builder.mutation<CreateDeploymentUploadLinkResponse, CreateDeploymentUploadLinkRequest>({
      query: (deploymentName) => ({
        url: `deployment/${deploymentName}/upload`,
        method: 'POST',
      }),
    }),
    listDeployments: builder.query<Deployment[], void>({
      query: () => 'deployment',
    }),
  }),
})

export const { 
  useCreateDeploymentUploadLinkMutation,
  useCreateDeploymentMutation,
  useListDeploymentsQuery,
 } = api;