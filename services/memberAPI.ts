import { AxiosError } from 'axios';

import apiClient from './apiClient';
import { resolveErrorMessage } from '@/utils/apiErrorHandler';
import { MemberLocation } from '@/types/MemberLocationTypes';

/**
 * 구성원 초대 요청
 */
export interface InviteMemberRequest {
  inviteeUserId: number;
  relation: string;
}

/**
 * 구성원 초대 응답
 */
export interface InviteMemberResponse {
  relationshipRequestId: number;
}

/**
 * 다른 사용자를 멤버로 초대
 * POST /members/invitations
 */
export const inviteMember = async (request: InviteMemberRequest): Promise<InviteMemberResponse> => {
  try {
    const response = await apiClient.post<InviteMemberResponse>('/members/invitations', request);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw new Error(resolveErrorMessage(axiosError));
  }
};

/**
 * 구성원 위치 목록 조회
 * GET /members/locations
 */
export const getMemberLocations = async (): Promise<MemberLocation[]> => {
  try {
    const response = await apiClient.get<MemberLocation[]>('/members/locations');
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    const axiosError = error as AxiosError;
    throw new Error(resolveErrorMessage(axiosError));
  }
};

