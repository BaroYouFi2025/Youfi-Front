import axios, { AxiosError, AxiosResponseHeaders } from 'axios';

import { AuthTokensResponse, AuthTokensWithRefresh, LoginRequest, LogoutResponse, RefreshResponse } from '@/types/AuthTypes';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.youfi.com';

const authClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 10000,
});

const extractRefreshToken = (setCookieHeader?: string | string[]): string | undefined => {
  if (!setCookieHeader) {
    return undefined;
  }

  const cookies = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];
  for (const cookieString of cookies) {
    const match = cookieString.match(/refreshToken=([^;]+)/);
    if (match && match[1]) {
      return match[1];
    }
  }

  return undefined;
};

const getSetCookieHeader = (headers: AxiosResponseHeaders): string | string[] | undefined => {
  if (typeof headers.getSetCookie === 'function') {
    const cookies = headers.getSetCookie();
    if (cookies && cookies.length > 0) {
      return cookies;
    }
  }

  const lowerCaseHeader = headers.get?.('set-cookie');
  if (lowerCaseHeader) {
    return lowerCaseHeader;
  }

  const upperCaseHeader = headers.get?.('Set-Cookie');
  if (upperCaseHeader) {
    return upperCaseHeader;
  }

  const recordHeaders = headers as unknown as Record<string, unknown>;
  const directHeader = recordHeaders['set-cookie'] ?? recordHeaders['Set-Cookie'];
  if (typeof directHeader === 'string' || Array.isArray(directHeader)) {
    return directHeader;
  }

  return undefined;
};

const toAuthTokensResult = (response: AuthTokensResponse, refreshToken?: string): AuthTokensWithRefresh => ({
  accessToken: response.accessToken,
  expiresIn: response.expiresIn,
  refreshToken,
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
    const refreshToken = extractRefreshToken(getSetCookieHeader(response.headers));
    return toAuthTokensResult(response.data, refreshToken);
  } catch (error) {
    const axiosError = error as AxiosError;
    throw new Error(resolveErrorMessage(axiosError));
  }
};

export const refreshTokens = async (refreshToken: string): Promise<AuthTokensWithRefresh> => {
  try {
    const response = await authClient.post<RefreshResponse>('/auth/refresh', null, {
      headers: {
        'Content-Type': 'application/json',
        Cookie: `refreshToken=${refreshToken}`,
      },
    });
    const nextRefreshToken = extractRefreshToken(getSetCookieHeader(response.headers)) || refreshToken;
    return toAuthTokensResult(response.data, nextRefreshToken);
  } catch (error) {
    const axiosError = error as AxiosError;
    throw new Error(resolveErrorMessage(axiosError));
  }
};

export const logout = async (refreshToken: string): Promise<LogoutResponse> => {
  try {
    const response = await authClient.post<LogoutResponse>('/auth/logout', null, {
      headers: {
        'Content-Type': 'application/json',
        Cookie: `refreshToken=${refreshToken}`,
      },
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw new Error(resolveErrorMessage(axiosError));
  }
};
