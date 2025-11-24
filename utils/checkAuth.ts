import { getAccessToken, getRefreshToken, getDeviceUuid, getStoredFCMToken } from './authStorage';

/**
 * 현재 저장된 인증 정보를 확인하는 유틸리티
 */
export const checkAuthStatus = async () => {
  const accessToken = await getAccessToken();
  const refreshToken = await getRefreshToken();
  const deviceUuid = await getDeviceUuid();
  const fcmToken = await getStoredFCMToken();

  const status = {
    accessToken: {
      exists: !!accessToken,
      value: accessToken,
      preview: accessToken ? `${accessToken.substring(0, 20)}...` : null,
      length: accessToken?.length || 0,
    },
    refreshToken: {
      exists: !!refreshToken,
      value: refreshToken,
      preview: refreshToken ? `${refreshToken.substring(0, 20)}...` : null,
      length: refreshToken?.length || 0,
    },
    deviceUuid: {
      exists: !!deviceUuid,
      value: deviceUuid,
    },
    fcmToken: {
      exists: !!fcmToken,
      value: fcmToken,
      preview: fcmToken ? `${fcmToken.substring(0, 30)}...` : null,
      length: fcmToken?.length || 0,
    },
    isAuthenticated: !!accessToken && !!refreshToken,
  };

  // 콘솔에 보기 좋게 출력

  return status;
};

/**
 * Authorization 헤더 값 가져오기
 */
export const getAuthorizationHeader = async (): Promise<string | null> => {
  const accessToken = await getAccessToken();
  return accessToken ? `Bearer ${accessToken}` : null;
};

/**
 * 현재 토큰이 유효한지 간단히 확인 (형식만 체크)
 */
export const isTokenFormatValid = (token: string | null): boolean => {
  if (!token) return false;
  
  // JWT 토큰은 보통 3개의 부분으로 나뉨 (header.payload.signature)
  const parts = token.split('.');
  return parts.length === 3;
};

/**
 * 전체 인증 상태 검증
 */
export const validateAuthStatus = async () => {
  const status = await checkAuthStatus();
  
  const validation = {
    hasAccessToken: status.accessToken.exists,
    hasRefreshToken: status.refreshToken.exists,
    hasDeviceUuid: status.deviceUuid.exists,
    hasFCMToken: status.fcmToken.exists,
    isAccessTokenValid: isTokenFormatValid(status.accessToken.value),
    isRefreshTokenValid: isTokenFormatValid(status.refreshToken.value),
    canMakeAuthenticatedRequests: status.accessToken.exists && isTokenFormatValid(status.accessToken.value),
  };


  return validation;
};

