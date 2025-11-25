import { AxiosError } from 'axios';

import {
  Pageable,
  SortInfo,
  UserSearchRequest,
  UserSearchResponse,
} from '@/types/UserTypes';
import { resolveErrorMessage } from '@/utils/apiErrorHandler';
import { getAccessToken } from '@/utils/authStorage';

import apiClient from './apiClient';

const withDefaults = (payload: UserSearchRequest): UserSearchRequest => ({
  uid: payload.uid?.trim() || undefined,
  page: payload.page ?? 0,
  size: payload.size ?? 20,
});

export const searchUsers = async (
  payload: UserSearchRequest,
  accessToken?: string,
): Promise<UserSearchResponse> => {
  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    const requestPayload = withDefaults(payload);

    const response = await apiClient.post<UserSearchResponse>(
      '/users/search',
      requestPayload,
      { headers },
    );



    const sortDefault: SortInfo = {
      empty: true,
      sorted: false,
      unsorted: true,
    };

    const pageableDefault: Pageable = {
      pageNumber: requestPayload.page ?? 0,
      pageSize: requestPayload.size ?? 20,
      sort: sortDefault,
      offset: (requestPayload.page ?? 0) * (requestPayload.size ?? 20),
      paged: true,
      unpaged: false,
    };

    const fallback: UserSearchResponse = {
      content: [],
      number: 0,
      size: payload.size ?? 20,
      first: true,
      last: true,
      numberOfElements: 0,
      empty: true,
      pageable: pageableDefault,
      sort: sortDefault,
    };

    const data = response.data;

    return {
      ...fallback,
      ...data,
      content: data?.content ?? fallback.content,
      number: data?.number ?? fallback.number,
      size: data?.size ?? fallback.size,
      first: data?.first ?? fallback.first,
      last: data?.last ?? fallback.last,
      numberOfElements: data?.numberOfElements ?? fallback.numberOfElements,
      empty: data?.empty ?? (Array.isArray(data?.content) ? data.content.length === 0 : fallback.empty),
      pageable: data?.pageable ?? fallback.pageable,
      sort: data?.sort ?? fallback.sort,
    };
  } catch (error) {
    const axiosError = error as AxiosError;
    throw new Error(resolveErrorMessage(axiosError));
  }
};

export const deleteMe = async (password: string): Promise<void> => {
  try {
    const accessToken = await getAccessToken();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }
    await apiClient.delete('/users/me', {
      headers,
      data: { password },
    });
  } catch (error) {
    const axiosError = error as AxiosError;
    throw new Error(resolveErrorMessage(axiosError));
  }
};
