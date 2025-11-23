import {
  AcceptInvitationFromNotificationRequest,
  AcceptInvitationResponse,
  NotificationResponse,
} from '@/types/NotificationTypes';
import { getAccessToken } from '@/utils/authStorage';
import axios, { AxiosError } from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://jjm.jojaemin.com';

const notificationClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// 인증 헤더를 포함한 요청 헬퍼
const getAuthHeaders = async (): Promise<Record<string, string>> => {
  const accessToken = await getAccessToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }
  return headers;
};

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
 * 내 알림 목록 조회
 * GET /notifications/me
 */
export const getMyNotifications = async (): Promise<NotificationResponse[]> => {
  const startTime = Date.now();
  try {
    console.log('📡 ========== 알림 API 호출 시작 ==========');
    console.log('📡 엔드포인트: GET /notifications/me');
    console.log('📡 API Base URL:', API_BASE_URL);
    console.log('📡 전체 URL:', `${API_BASE_URL}/notifications/me`);
    console.log('📡 호출 시점:', new Date().toISOString());
    
    const headers = await getAuthHeaders();
    console.log('📡 요청 헤더:', {
      'Content-Type': headers['Content-Type'],
      'Authorization': headers.Authorization ? `${headers.Authorization.substring(0, 20)}...` : '없음',
    });
    
    const response = await notificationClient.get<NotificationResponse[]>('/notifications/me', {
      headers,
    });
    
    const duration = Date.now() - startTime;
    console.log('📡 ========== 알림 API 호출 성공 ==========');
    console.log('📡 응답 상태 코드:', response.status);
    console.log('📡 응답 상태 텍스트:', response.statusText);
    console.log('📡 응답 소요 시간:', `${duration}ms`);
    console.log('📡 응답 데이터 타입:', Array.isArray(response.data) ? 'Array' : typeof response.data);
    console.log('📡 응답 데이터 개수:', Array.isArray(response.data) ? response.data.length : 'N/A');
    console.log('📡 응답 헤더:', JSON.stringify(response.headers, null, 2));
    
    if (Array.isArray(response.data) && response.data.length > 0) {
      console.log('📡 응답 데이터 샘플 (첫 번째):', JSON.stringify(response.data[0], null, 2));
    }
    
    console.log('📡 =========================================');
    
    return response.data;
  } catch (error) {
    const duration = Date.now() - startTime;
    const axiosError = error as AxiosError;
    const status = axiosError.response?.status;
    const statusText = axiosError.response?.statusText;
    const responseData = axiosError.response?.data;
    const requestConfig = axiosError.config;
    
    console.error('❌ ========== 알림 API 호출 실패 ==========');
    console.error('❌ 실패 시점:', new Date().toISOString());
    console.error('❌ 소요 시간:', `${duration}ms`);
    console.error('❌ HTTP 상태 코드:', status || 'N/A');
    console.error('❌ HTTP 상태 텍스트:', statusText || 'N/A');
    console.error('❌ 요청 URL:', requestConfig?.url || 'N/A');
    console.error('❌ 요청 Base URL:', requestConfig?.baseURL || 'N/A');
    console.error('❌ 전체 URL:', requestConfig ? `${requestConfig.baseURL}${requestConfig.url}` : 'N/A');
    console.error('❌ 요청 메서드:', requestConfig?.method?.toUpperCase() || 'N/A');
    console.error('❌ 요청 헤더:', JSON.stringify(requestConfig?.headers, null, 2) || 'N/A');
    console.error('❌ 응답 데이터:', JSON.stringify(responseData, null, 2) || 'N/A');
    console.error('❌ 응답 헤더:', JSON.stringify(axiosError.response?.headers, null, 2) || 'N/A');
    console.error('❌ 에러 메시지:', axiosError.message);
    console.error('❌ 에러 코드:', axiosError.code);
    console.error('❌ 전체 에러 객체:', JSON.stringify(axiosError, Object.getOwnPropertyNames(axiosError), 2));
    console.error('❌ ========================================');
    
    throw new Error(resolveErrorMessage(axiosError));
  }
};

/**
 * 읽지 않은 알림 목록 조회
 * GET /notifications/me/unread
 */
export const getUnreadNotifications = async (): Promise<NotificationResponse[]> => {
  try {
    const headers = await getAuthHeaders();
    const response = await notificationClient.get<NotificationResponse[]>('/notifications/me/unread', {
      headers,
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    const status = axiosError.response?.status;
    const responseData = axiosError.response?.data;
    
    console.error('❌ 읽지 않은 알림 조회 실패:', {
      status,
      url: `${API_BASE_URL}/notifications/me/unread`,
      responseData: JSON.stringify(responseData, null, 2),
    });
    
    throw new Error(resolveErrorMessage(axiosError));
  }
};

/**
 * 읽지 않은 알림 개수 조회
 * GET /notifications/unread-count
 */
export const getUnreadCount = async (): Promise<number> => {
  try {
    const headers = await getAuthHeaders();
    const response = await notificationClient.get<number>('/notifications/unread-count', {
      headers,
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw new Error(resolveErrorMessage(axiosError));
  }
};

/**
 * 알림 읽음 처리
 * PUT /notifications/{notificationId}/read
 */
export const markAsRead = async (notificationId: number): Promise<void> => {
  const startTime = Date.now();
  try {
    console.log('📡 ========== 알림 읽음 처리 API 호출 시작 ==========');
    console.log('📡 엔드포인트: PUT /notifications/{notificationId}/read');
    console.log('📡 알림 ID:', notificationId);
    console.log('📡 API Base URL:', API_BASE_URL);
    console.log('📡 전체 URL:', `${API_BASE_URL}/notifications/${notificationId}/read`);
    console.log('📡 호출 시점:', new Date().toISOString());
    
    const headers = await getAuthHeaders();
    console.log('📡 요청 헤더:', {
      'Content-Type': headers['Content-Type'],
      'Authorization': headers.Authorization ? `${headers.Authorization.substring(0, 20)}...` : '없음',
    });
    console.log('📡 요청 본문:', {});
    
    const response = await notificationClient.put(`/notifications/${notificationId}/read`, {}, { headers });
    
    const duration = Date.now() - startTime;
    console.log('📡 ========== 알림 읽음 처리 API 호출 성공 ==========');
    console.log('📡 응답 상태 코드:', response.status);
    console.log('📡 응답 상태 텍스트:', response.statusText);
    console.log('📡 응답 소요 시간:', `${duration}ms`);
    console.log('📡 응답 데이터:', JSON.stringify(response.data, null, 2));
    console.log('📡 응답 헤더:', JSON.stringify(response.headers, null, 2));
    console.log('📡 ================================================');
  } catch (error) {
    const duration = Date.now() - startTime;
    const axiosError = error as AxiosError;
    const status = axiosError.response?.status;
    const statusText = axiosError.response?.statusText;
    const responseData = axiosError.response?.data;
    const requestConfig = axiosError.config;
    
    console.error('❌ ========== 알림 읽음 처리 API 호출 실패 ==========');
    console.error('❌ 실패 시점:', new Date().toISOString());
    console.error('❌ 소요 시간:', `${duration}ms`);
    console.error('❌ 알림 ID:', notificationId);
    console.error('❌ HTTP 상태 코드:', status || 'N/A');
    console.error('❌ HTTP 상태 텍스트:', statusText || 'N/A');
    console.error('❌ 요청 URL:', requestConfig?.url || 'N/A');
    console.error('❌ 요청 Base URL:', requestConfig?.baseURL || 'N/A');
    console.error('❌ 전체 URL:', requestConfig ? `${requestConfig.baseURL}${requestConfig.url}` : 'N/A');
    console.error('❌ 요청 메서드:', requestConfig?.method?.toUpperCase() || 'N/A');
    console.error('❌ 요청 헤더:', JSON.stringify(requestConfig?.headers, null, 2) || 'N/A');
    console.error('❌ 응답 데이터:', JSON.stringify(responseData, null, 2) || 'N/A');
    console.error('❌ 응답 헤더:', JSON.stringify(axiosError.response?.headers, null, 2) || 'N/A');
    console.error('❌ 에러 메시지:', axiosError.message);
    console.error('❌ 에러 코드:', axiosError.code);
    console.error('❌ 전체 에러 객체:', JSON.stringify(axiosError, Object.getOwnPropertyNames(axiosError), 2));
    console.error('❌ ===============================================');
    
    throw new Error(resolveErrorMessage(axiosError));
  }
};

/**
 * 알림을 통한 초대 수락
 * POST /notifications/{notificationId}/accept-invitation
 */
export const acceptInvitationFromNotification = async (
  notificationId: number,
  request: AcceptInvitationFromNotificationRequest,
): Promise<AcceptInvitationResponse> => {
  const startTime = Date.now();
  try {
    console.log('📡 ========== 초대 수락 API 호출 시작 ==========');
    console.log('📡 엔드포인트: POST /notifications/{notificationId}/accept-invitation');
    console.log('📡 알림 ID:', notificationId);
    console.log('📡 요청 본문:', JSON.stringify(request, null, 2));
    console.log('📡 API Base URL:', API_BASE_URL);
    console.log('📡 전체 URL:', `${API_BASE_URL}/notifications/${notificationId}/accept-invitation`);
    console.log('📡 호출 시점:', new Date().toISOString());
    
    const headers = await getAuthHeaders();
    console.log('📡 요청 헤더:', {
      'Content-Type': headers['Content-Type'],
      'Authorization': headers.Authorization ? `${headers.Authorization.substring(0, 20)}...` : '없음',
    });
    
    const response = await notificationClient.post<AcceptInvitationResponse>(
      `/notifications/${notificationId}/accept-invitation`,
      request,
      { headers },
    );
    
    const duration = Date.now() - startTime;
    console.log('📡 ========== 초대 수락 API 호출 성공 ==========');
    console.log('📡 응답 상태 코드:', response.status);
    console.log('📡 응답 상태 텍스트:', response.statusText);
    console.log('📡 응답 소요 시간:', `${duration}ms`);
    console.log('📡 응답 데이터:', JSON.stringify(response.data, null, 2));
    console.log('📡 응답 헤더:', JSON.stringify(response.headers, null, 2));
    console.log('📡 ================================================');
    
    return response.data;
  } catch (error) {
    const duration = Date.now() - startTime;
    const axiosError = error as AxiosError;
    const status = axiosError.response?.status;
    const statusText = axiosError.response?.statusText;
    const responseData = axiosError.response?.data;
    const requestConfig = axiosError.config;
    
    console.error('❌ ========== 초대 수락 API 호출 실패 ==========');
    console.error('❌ 실패 시점:', new Date().toISOString());
    console.error('❌ 소요 시간:', `${duration}ms`);
    console.error('❌ 알림 ID:', notificationId);
    console.error('❌ 요청 본문:', JSON.stringify(request, null, 2));
    console.error('❌ HTTP 상태 코드:', status || 'N/A');
    console.error('❌ HTTP 상태 텍스트:', statusText || 'N/A');
    console.error('❌ 요청 URL:', requestConfig?.url || 'N/A');
    console.error('❌ 요청 Base URL:', requestConfig?.baseURL || 'N/A');
    console.error('❌ 전체 URL:', requestConfig ? `${requestConfig.baseURL}${requestConfig.url}` : 'N/A');
    console.error('❌ 요청 메서드:', requestConfig?.method?.toUpperCase() || 'N/A');
    console.error('❌ 요청 헤더:', JSON.stringify(requestConfig?.headers, null, 2) || 'N/A');
    console.error('❌ 응답 데이터:', JSON.stringify(responseData, null, 2) || 'N/A');
    console.error('❌ 응답 헤더:', JSON.stringify(axiosError.response?.headers, null, 2) || 'N/A');
    console.error('❌ 에러 메시지:', axiosError.message);
    console.error('❌ 에러 코드:', axiosError.code);
    console.error('❌ 전체 에러 객체:', JSON.stringify(axiosError, Object.getOwnPropertyNames(axiosError), 2));
    console.error('❌ ===============================================');
    
    throw new Error(resolveErrorMessage(axiosError));
  }
};

/**
 * 알림을 통한 초대 거절
 * POST /notifications/{notificationId}/reject-invitation
 */
export const rejectInvitationFromNotification = async (notificationId: number): Promise<void> => {
  try {
    const headers = await getAuthHeaders();
    await notificationClient.post(`/notifications/${notificationId}/reject-invitation`, {}, { headers });
  } catch (error) {
    const axiosError = error as AxiosError;
    throw new Error(resolveErrorMessage(axiosError));
  }
};

/**
 * 알림을 통한 실종자 상세 조회
 * GET /notifications/{notificationId}/missing-person
 */
export const getMissingPersonDetailFromNotification = async (
  notificationId: number,
): Promise<any> => {
  try {
    const headers = await getAuthHeaders();
    const response = await notificationClient.get(`/notifications/${notificationId}/missing-person`, {
      headers,
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw new Error(resolveErrorMessage(axiosError));
  }
};

/**
 * 알림을 통한 발견 신고 상세 조회
 * GET /notifications/{notificationId}/sighting
 */
export const getSightingDetailFromNotification = async (
  notificationId: number,
): Promise<any> => {
  try {
    const headers = await getAuthHeaders();
    const response = await notificationClient.get(`/notifications/${notificationId}/sighting`, {
      headers,
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw new Error(resolveErrorMessage(axiosError));
  }
};

