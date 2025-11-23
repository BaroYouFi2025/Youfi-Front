import axios, { AxiosError } from 'axios';

import { AuthTokensResponse, AuthTokensWithRefresh, LoginRequest, LogoutRequest, LogoutResponse, RefreshRequest, RefreshResponse, SignupRequest } from '@/types/AuthTypes';

import { API_BASE_URL } from './config';

const authClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 10000,
});

const toAuthTokensResult = (response: AuthTokensResponse): AuthTokensWithRefresh => ({
  accessToken: response.accessToken,
  refreshToken: response.refreshToken,
  expiresIn: response.expiresIn,
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

export const login = async (payload: LoginRequest): Promise<AuthTokensWithRefresh> => {
  try {
    const response = await authClient.post<AuthTokensResponse>('/auth/login', payload, {
      headers: { 'Content-Type': 'application/json' },
    });
    return toAuthTokensResult(response.data);
  } catch (error) {
    const axiosError = error as AxiosError;
    throw new Error(resolveErrorMessage(axiosError));
  }
};

export const signup = async (payload: SignupRequest): Promise<AuthTokensWithRefresh> => {
  try {
    const response = await authClient.post<AuthTokensResponse>('/users/register', payload, {
      headers: { 'Content-Type': 'application/json' },
    });
    return toAuthTokensResult(response.data);
  } catch (error) {
    const axiosError = error as AxiosError;
    throw new Error(resolveErrorMessage(axiosError));
  }
};

export const refreshTokens = async (refreshToken: string): Promise<AuthTokensWithRefresh> => {
  try {
    const payload: RefreshRequest = { refreshToken };
    const response = await authClient.post<RefreshResponse>('/auth/refresh', payload, {
      headers: { 'Content-Type': 'application/json' },
    });
    return toAuthTokensResult(response.data);
  } catch (error) {
    const axiosError = error as AxiosError;
    throw new Error(resolveErrorMessage(axiosError));
  }
};

export const logout = async (refreshToken: string, accessToken?: string): Promise<LogoutResponse> => {
  try {
    const payload: LogoutRequest = { refreshToken };
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }
    const response = await authClient.post<LogoutResponse>('/auth/logout', payload, { headers });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw new Error(resolveErrorMessage(axiosError));
  }
};
