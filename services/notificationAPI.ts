import {
  AcceptInvitationFromNotificationRequest,
  AcceptInvitationResponse,
  NotificationResponse,
} from '@/types/NotificationTypes';
import { getAccessToken } from '@/utils/authStorage';
import { resolveErrorMessage } from '@/utils/apiErrorHandler';
import { AxiosError } from 'axios';

import apiClient from './apiClient';

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

/**
 * 내 알림 목록 조회
 * GET /notifications/me
 */
export const getMyNotifications = async (): Promise<NotificationResponse[]> => {
  const startTime = Date.now();
  try {

    const headers = await getAuthHeaders();

    const response = await apiClient.get<NotificationResponse[]>('/notifications/me', {
      headers,
    });

    const duration = Date.now() - startTime;

    if (Array.isArray(response.data) && response.data.length > 0) {
    }


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
    const response = await apiClient.get<NotificationResponse[]>('/notifications/me/unread', {
      headers,
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    const status = axiosError.response?.status;
    const responseData = axiosError.response?.data;

    console.error('❌ 읽지 않은 알림 조회 실패:', {
      status,
      url: '/notifications/me/unread',
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
    const response = await apiClient.get<number>('/notifications/unread-count', {
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

    const headers = await getAuthHeaders();

    await apiClient.put(`/notifications/${notificationId}/read`, {}, { headers });

    const duration = Date.now() - startTime;
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

    const headers = await getAuthHeaders();

    const response = await apiClient.post<AcceptInvitationResponse>(
      `/notifications/${notificationId}/accept-invitation`,
      request,
      { headers },
    );

    const duration = Date.now() - startTime;

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
    await apiClient.post(`/notifications/${notificationId}/reject-invitation`, {}, { headers });
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
    const response = await apiClient.get(`/notifications/${notificationId}/missing-person`, {
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
    const response = await apiClient.get(`/notifications/${notificationId}/sighting`, {
      headers,
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw new Error(resolveErrorMessage(axiosError));
  }
};

