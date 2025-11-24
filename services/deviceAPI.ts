import { AxiosError } from 'axios';
import { Platform } from 'react-native';

import { generateDeviceUuid, getDeviceId, getDeviceUuid, getRefreshToken, setAccessToken, setDeviceId, setDeviceUuid, setRefreshToken, setStoredFCMToken } from '@/utils/authStorage';
import { resolveErrorMessage } from '@/utils/apiErrorHandler';

import apiClient from './apiClient';
import { refreshTokens } from './authAPI';

interface DeviceRegisterRequest {
  deviceUuid: string;
  osType?: string;
  osVersion?: string;
  fcmToken: string;
}

interface DeviceRegisterResponse {
  deviceId: number;
  deviceUuid: string;
  batteryLevel: number | null;
  osType: string | null;
  osVersion: string | null;
  registeredAt: string;
  fcmToken: string | null;
  active: boolean;
}

/**
 * 기기 등록 (FCM 토큰 포함)
 * /devices/register 엔드포인트를 사용하여 기기를 등록합니다.
 */
export const registerDevice = async (fcmToken: string, accessToken?: string): Promise<DeviceRegisterResponse> => {
  try {
    // Platform 정보 가져오기
    const osType = Platform.OS === 'ios' ? 'iOS' : Platform.OS === 'android' ? 'Android' : 'Unknown';
    const osVersion = Platform.Version.toString();

    // 저장된 deviceUuid가 있으면 사용, 없으면 생성
    let deviceUuid = await getDeviceUuid();
    if (!deviceUuid) {
      deviceUuid = generateDeviceUuid();
      await setDeviceUuid(deviceUuid);
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const requestBody: DeviceRegisterRequest = {
      deviceUuid,
      osType,
      osVersion,
      fcmToken,
    };

    const response = await apiClient.post<DeviceRegisterResponse>(
      '/devices/register',
      requestBody,
      { headers }
    );

    // 등록 성공 시 FCM 토큰 및 deviceId 저장
    await setStoredFCMToken(fcmToken);
    if (response.data.deviceId) {
      await setDeviceId(response.data.deviceId);
    }

    // 토큰 갱신 시도 (deviceId가 포함된 토큰을 받기 위해)
    try {
      const refreshToken = await getRefreshToken();
      if (refreshToken) {
        const newTokens = await refreshTokens(refreshToken);
        await setAccessToken(newTokens.accessToken);
        if (newTokens.refreshToken) {
          await setRefreshToken(newTokens.refreshToken);
        }
      }
    } catch (refreshError) {
      console.error('❌ 기기 등록 후 토큰 갱신 실패:', refreshError);
    }

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    const requestConfig = axiosError.config;

    console.error('❌ 기기 등록 실패:', {
      status: axiosError.response?.status,
      statusText: axiosError.response?.statusText,
      url: requestConfig?.url,
      baseURL: requestConfig?.baseURL,
      fullURL: requestConfig ? `${requestConfig.baseURL}${requestConfig.url}` : 'unknown',
      method: requestConfig?.method?.toUpperCase(),
      responseData: axiosError.response?.data ? JSON.stringify(axiosError.response.data, null, 2) : undefined,
      errorMessage: axiosError.message,
    });

    throw new Error(resolveErrorMessage(axiosError));
  }
};

interface GpsUpdateRequest {
  latitude: number;
  longitude: number;
  batteryLevel: number;
}

interface GpsUpdateResponse {
  latitude: number;
  longitude: number;
  recordedAt: string;
  message: string;
}

/**
 * GPS 위치 업데이트 (POST /devices/gps)
 * 백그라운드에서 주기적으로 호출하여 기기 위치를 업데이트합니다.
 */
export const updateGpsLocation = async (
  latitude: number,
  longitude: number,
  batteryLevel: number,
  accessToken?: string
): Promise<GpsUpdateResponse> => {
  try {
    // deviceId 가져오기
    const deviceId = await getDeviceId();
    if (!deviceId) {
      throw new Error('기기 등록이 필요합니다.');
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const requestBody: GpsUpdateRequest = {
      latitude,
      longitude,
      batteryLevel,
    };

    const response = await apiClient.post<GpsUpdateResponse>(
      '/devices/gps',
      requestBody,
      { headers }
    );

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    const status = axiosError.response?.status;
    const statusText = axiosError.response?.statusText;
    const responseData = axiosError.response?.data;

    console.error('❌ GPS 위치 업데이트 실패:', {
      status,
      statusText,
      url: '/devices/gps',
      responseData: JSON.stringify(responseData, null, 2),
    });

    throw new Error(resolveErrorMessage(axiosError));
  }
};
