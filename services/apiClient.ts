import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

import { clearStoredTokens, getAccessToken, getRefreshToken, setAccessToken, setRefreshToken } from '@/utils/authStorage';

import { refreshTokens } from './authAPI';
import { API_BASE_URL } from './config';

type RetriableRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean };

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

let refreshPromise: Promise<string> | null = null;

apiClient.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) {
    config.headers = config.headers ?? {};
    if (!config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const originalRequest = error.config as RetriableRequestConfig | undefined;

    // GPS 요청 에러 디버깅
    if (originalRequest?.url?.includes('/devices/gps')) {
      console.error('🔍 [apiClient] GPS 요청 실패:', {
        status,
        statusText: error.response?.statusText,
        responseData: error.response?.data,
        requestUrl: originalRequest.url,
        requestMethod: originalRequest.method,
        requestData: originalRequest.data,
      });
    }

    if (status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!refreshPromise) {
        refreshPromise = (async () => {
          const storedRefreshToken = await getRefreshToken();
          if (!storedRefreshToken) {
            throw error;
          }

          const tokens = await refreshTokens(storedRefreshToken);
          await Promise.all([setAccessToken(tokens.accessToken), setRefreshToken(tokens.refreshToken)]);
          return tokens.accessToken;
        })().finally(() => {
          refreshPromise = null;
        });
      }

      try {
        const newAccessToken = await refreshPromise;

        originalRequest.headers = {
          ...(originalRequest.headers || {}),
          Authorization: `Bearer ${newAccessToken}`,
        } as RetriableRequestConfig['headers'];

        return apiClient(originalRequest);
      } catch (refreshError) {
        await clearStoredTokens();
        throw refreshError;
      }
    }

    throw error;
  },
);

export default apiClient;
