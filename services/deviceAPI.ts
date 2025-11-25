import { AxiosError } from 'axios';
import { Platform } from 'react-native';

import { resolveErrorMessage } from '@/utils/apiErrorHandler';
import { generateDeviceUuid, getDeviceId, getDeviceUuid, getRefreshToken, setAccessToken, setDeviceId, setDeviceUuid, setRefreshToken, setStoredFCMToken } from '@/utils/authStorage';

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
  let responseData: DeviceRegisterResponse | null = null;

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

    responseData = response.data;

    // 등록 성공 시 FCM 토큰 및 deviceId 저장
    await setStoredFCMToken(fcmToken);
    if (response.data.deviceId) {
      await setDeviceId(response.data.deviceId);
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    const status = axiosError.response?.status;
    const errorData = axiosError.response?.data as any;

    // 이미 등록된 기기인 경우 (409 Conflict 또는 400 Bad Request)
    // 백엔드 에러 코드가 DEVICE_ALREADY_REGISTERED 인지 확인
    const isAlreadyRegistered =
      status === 409 ||
      (status === 400 && errorData?.code === 'DEVICE_ALREADY_REGISTERED');

    if (isAlreadyRegistered) {
      // 이미 등록된 경우에도 FCM 토큰은 저장
      await setStoredFCMToken(fcmToken);
    } else {
      // 기기 등록 실패 시 조용히 실패 처리 (throw 하지 않음)
      // 로그인 플로우는 계속 진행되어야 함
    }
  }

  // 토큰 갱신 시도 (deviceId가 포함된 토큰을 받기 위해)
  // 기기 등록이 성공했거나, 이미 등록된 경우 모두 실행
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

  if (responseData) {
    return responseData;
  } else {
    // 이미 등록된 경우, 로컬에 저장된 정보나 기본값을 반환해야 함
    // 하지만 함수의 반환 타입이 Promise<DeviceRegisterResponse> 이므로
    // 최소한의 정보를 담은 객체를 반환
    return {
      deviceId: (await getDeviceId()) || 0,
      deviceUuid: (await getDeviceUuid()) || '',
      batteryLevel: null,
      osType: Platform.OS === 'ios' ? 'iOS' : 'Android',
      osVersion: String(Platform.Version),
      registeredAt: new Date().toISOString(),
      fcmToken: fcmToken,
      active: true
    };
  }
};

/**
 * FCM 토큰 업데이트 (POST /devices/fcm-token)
 * 로그인 시 FCM 토큰을 서버에 업데이트합니다.
 */
export const updateFcmToken = async (fcmToken: string): Promise<void> => {
  try {
    await apiClient.post('/devices/fcm-token', {
      fcmToken,
    });

    // 업데이트 성공 시 로컬에 저장
    await setStoredFCMToken(fcmToken);
  } catch (error) {
    // FCM 토큰 업데이트 실패해도 로그인은 계속 진행
    // 조용히 실패 처리
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
 * Authorization 헤더는 apiClient 인터셉터가 자동으로 추가합니다.
 */
export const updateGpsLocation = async (
  latitude: number,
  longitude: number,
  batteryLevel: number
): Promise<GpsUpdateResponse> => {
  try {
    if (isNaN(latitude) || isNaN(longitude)) {
      console.error('❌ GPS 좌표가 유효하지 않습니다 (NaN):', { latitude, longitude });
      throw new Error('Invalid GPS coordinates (NaN)');
    }

    const requestBody: GpsUpdateRequest = {
      latitude,
      longitude,
      batteryLevel,
    };

    const response = await apiClient.post<GpsUpdateResponse>(
      '/devices/gps',
      requestBody
    );

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    const status = axiosError.response?.status;
    const statusText = axiosError.response?.statusText;
    const responseData = axiosError.response?.data;

    throw new Error(resolveErrorMessage(axiosError));
  }
};
