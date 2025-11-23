import axios, { AxiosError } from 'axios';

import { SliceResponse, UserSearchRequest, UserSummary } from '@/types/UserTypes';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://jjm.jojaemin.com';

const userClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

const resolveErrorMessage = (error: AxiosError): string => {
  if (error.response?.data) {
    const data = error.response.data as { message?: string; errorMessage?: string };
    return data.message || data.errorMessage || '알 수 없는 오류가 발생했습니다.';
  }

  if (error.message) {
    return error.message;
  }

  return '요청에 실패했습니다. 다시 시도해주세요.';
};

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

    const response = await userClient.post<SliceResponse<UserSummary>>(
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
