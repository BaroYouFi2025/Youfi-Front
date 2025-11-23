import { generateDeviceUuid, getDeviceUuid, setDeviceUuid, setStoredFCMToken } from '@/utils/authStorage';
import axios, { AxiosError } from 'axios';
import { Platform } from 'react-native';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://jjm.jojaemin.com';

const deviceClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// 요청 인터셉터: 실제 전송되는 요청 로깅
deviceClient.interceptors.request.use(
  (config) => {
    console.log('📤 실제 전송되는 요청:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      headers: config.headers,
      data: config.data,
    });
    return config;
  },
  (error) => {
    console.error('❌ 요청 설정 오류:', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터: 실제 받은 응답 로깅
deviceClient.interceptors.response.use(
  (response) => {
    console.log('📥 실제 받은 응답:', {
      status: response.status,
      statusText: response.statusText,
      url: response.config.url,
      data: response.data,
      headers: response.headers,
    });
    return response;
  },
  (error) => {
    console.error('❌ 실제 받은 에러 응답:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      fullURL: error.config ? `${error.config.baseURL}${error.config.url}` : 'unknown',
      headers: error.config?.headers,
      requestData: error.config?.data,
      responseData: error.response?.data,
      responseHeaders: error.response?.headers,
    });
    return Promise.reject(error);
  }
);

// 레거시 인터페이스 (하위 호환성을 위해 유지)
interface RegisterDeviceRequest {
  fcmToken: string;
}

interface RegisterDeviceResponse {
  message: string;
}

interface DeviceRegisterRequest {
  deviceUuid: string;
  osType?: string;
  osVersion?: string;
  fcmToken?: string;
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

const resolveErrorMessage = (error: AxiosError): string => {
  // HTTP 상태 코드 확인
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data as { message?: string; errorMessage?: string } | string;
    
    // 상태 코드별 메시지
    if (status === 404) {
      return '요청하신 API 엔드포인트를 찾을 수 없습니다.';
    }
    if (status === 403) {
      return '인증이 필요합니다. 로그인 후 다시 시도해주세요.';
    }
    if (status === 401) {
      return '인증 토큰이 유효하지 않습니다. 다시 로그인해주세요.';
    }
    
    // 백엔드에서 보낸 에러 메시지
    if (typeof data === 'object' && data !== null) {
      return data.message || data.errorMessage || `서버 오류 (${status})`;
    }
    if (typeof data === 'string') {
      return data;
    }
    
    return `서버 오류 (${status})`;
  }

  if (error.message) {
    return error.message;
  }

  return '요청에 실패했습니다. 다시 시도해주세요.';
};

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
      console.log('🔑 새로운 deviceUuid 생성:', {
        deviceUuid,
        length: deviceUuid.length,
      });
    } else {
      console.log('🔑 기존 deviceUuid 사용:', {
        deviceUuid,
        length: deviceUuid.length,
      });
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

    console.log('🔍 기기 등록 요청 (/devices/register):', {
      url: `${API_BASE_URL}/devices/register`,
      deviceUuid,
      osType,
      osVersion,
      hasFcmToken: !!fcmToken,
      fcmTokenLength: fcmToken?.length || 0,
      hasAuth: !!accessToken,
      tokenLength: accessToken?.length || 0,
    });

    const response = await deviceClient.post<DeviceRegisterResponse>(
      '/devices/register',
      requestBody,
      { headers }
    );

    // 등록 성공 시 FCM 토큰 저장
    await setStoredFCMToken(fcmToken);
    console.log('✅ 기기 등록 성공:', {
      status: response.status,
      deviceId: response.data.deviceId,
      deviceUuid: response.data.deviceUuid,
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    const status = axiosError.response?.status;
    const statusText = axiosError.response?.statusText;
    const responseData = axiosError.response?.data;
    
    console.error('❌ 기기 등록 실패:', {
      status,
      statusText,
      url: `${API_BASE_URL}/devices/register`,
      responseData: JSON.stringify(responseData, null, 2),
      fullError: axiosError.response,
    });
    
    throw new Error(resolveErrorMessage(axiosError));
  }
};

/**
 * 기기 등록 (POST /devices/register)
 * 로그인 시 기기를 등록합니다.
 */
export const registerDeviceWithUuid = async (
  osType: string,
  osVersion: string,
  fcmToken?: string,
  accessToken?: string
): Promise<DeviceRegisterResponse> => {
  try {
    console.log('📱 기기 등록 시작:', {
      osType,
      osVersion,
      hasFcmToken: !!fcmToken,
      hasAuth: !!accessToken,
      fcmTokenLength: fcmToken?.length || 0,
      authTokenLength: accessToken?.length || 0,
    });

    // 저장된 deviceUuid가 있으면 사용, 없으면 생성
    let deviceUuid = await getDeviceUuid();
    if (!deviceUuid) {
      deviceUuid = generateDeviceUuid();
      await setDeviceUuid(deviceUuid);
      console.log('🔑 새로운 deviceUuid 생성:', {
        deviceUuid,
        length: deviceUuid.length,
      });
    } else {
      console.log('🔑 기존 deviceUuid 사용:', {
        deviceUuid,
        length: deviceUuid.length,
      });
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
      console.log('🔐 인증 토큰 포함:', {
        tokenPrefix: accessToken.substring(0, 20) + '...',
        tokenLength: accessToken.length,
      });
    } else {
      console.warn('⚠️ 인증 토큰 없음: 인증 없이 기기 등록 시도');
    }

    const requestBody: DeviceRegisterRequest = {
      deviceUuid,
      osType,
      osVersion,
    };

    if (fcmToken) {
      requestBody.fcmToken = fcmToken;
      console.log('📲 FCM 토큰 포함:', {
        tokenPrefix: fcmToken.substring(0, 30) + '...',
        tokenLength: fcmToken.length,
      });
    } else {
      console.log('📲 FCM 토큰 없음: FCM 토큰 없이 기기 등록');
    }

    console.log('🔍 기기 등록 요청 상세:', {
      method: 'POST',
      url: `${API_BASE_URL}/devices/register`,
      fullURL: `${API_BASE_URL}/devices/register`,
      requestBody: {
        deviceUuid,
        osType,
        osVersion,
        fcmToken: fcmToken ? `${fcmToken.substring(0, 30)}...` : undefined,
      },
      headers: {
        'Content-Type': headers['Content-Type'],
        'Authorization': headers['Authorization'] ? 'Bearer ***' : undefined,
      },
    });

    const response = await deviceClient.post<DeviceRegisterResponse>(
      '/devices/register',
      requestBody,
      { headers }
    );

    console.log('✅ 기기 등록 성공:', {
      status: response.status,
      statusText: response.statusText,
      data: {
        deviceId: response.data.deviceId,
        deviceUuid: response.data.deviceUuid,
        osType: response.data.osType,
        osVersion: response.data.osVersion,
        registeredAt: response.data.registeredAt,
        hasFcmToken: !!response.data.fcmToken,
        active: response.data.active,
        batteryLevel: response.data.batteryLevel,
      },
      fullResponse: response.data,
    });
    
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    const status = axiosError.response?.status;
    const statusText = axiosError.response?.statusText;
    const responseData = axiosError.response?.data;
    const requestConfig = axiosError.config;
    
    console.error('❌ 기기 등록 실패 상세:', {
      status,
      statusText,
      url: requestConfig?.url,
      baseURL: requestConfig?.baseURL,
      fullURL: requestConfig ? `${requestConfig.baseURL}${requestConfig.url}` : 'unknown',
      method: requestConfig?.method?.toUpperCase(),
      requestData: requestConfig?.data,
      responseData: responseData ? JSON.stringify(responseData, null, 2) : undefined,
      responseHeaders: axiosError.response?.headers,
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

    console.log('📍 GPS 위치 업데이트 요청:', {
      url: `${API_BASE_URL}/devices/gps`,
      latitude,
      longitude,
      batteryLevel,
      hasAuth: !!accessToken,
    });

    const response = await deviceClient.post<GpsUpdateResponse>(
      '/devices/gps',
      requestBody,
      { headers }
    );

    console.log('✅ GPS 위치 업데이트 성공:', {
      status: response.status,
      recordedAt: response.data.recordedAt,
      message: response.data.message,
    });

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    const status = axiosError.response?.status;
    const statusText = axiosError.response?.statusText;
    const responseData = axiosError.response?.data;

    console.error('❌ GPS 위치 업데이트 실패:', {
      status,
      statusText,
      url: `${API_BASE_URL}/devices/gps`,
      responseData: JSON.stringify(responseData, null, 2),
    });

    throw new Error(resolveErrorMessage(axiosError));
  }
};
