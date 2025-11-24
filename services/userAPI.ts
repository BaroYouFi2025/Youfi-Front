import { AxiosError } from 'axios';

import { SliceResponse, UserSearchRequest, UserSummary } from '@/types/UserTypes';
import { resolveErrorMessage } from '@/utils/apiErrorHandler';

import apiClient from './apiClient';

const withDefaults = (payload: UserSearchRequest): UserSearchRequest => ({
  uid: payload.uid?.trim() || undefined,
  page: payload.page ?? 0,
  size: payload.size ?? 20,
});

export const searchUsers = async (
  payload: UserSearchRequest,
  accessToken?: string,
): Promise<SliceResponse<UserSummary>> => {
  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    const response = await apiClient.post<SliceResponse<UserSummary>>(
      '/users/search',
      withDefaults(payload),
      { headers },
    );

    const fallback = {
      content: [],
      number: 0,
      size: payload.size ?? 20,
      first: true,
      last: true,
      numberOfElements: 0,
      empty: true,
    };

    const data = response.data;

    return {
      ...fallback,
      ...data,
      content: Array.isArray(data?.content) ? data.content : [],
      number: data?.number ?? fallback.number,
      size: data?.size ?? fallback.size,
      first: data?.first ?? fallback.first,
      last: data?.last ?? fallback.last,
      numberOfElements: data?.numberOfElements ?? fallback.numberOfElements,
      empty: data?.empty ?? (Array.isArray(data?.content) ? data.content.length === 0 : fallback.empty),
    };
  } catch (error) {
    const axiosError = error as AxiosError;
    throw new Error(resolveErrorMessage(axiosError));
  }
};
