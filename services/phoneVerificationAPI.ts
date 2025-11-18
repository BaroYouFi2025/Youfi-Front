import axios, { AxiosError } from 'axios';

import {
  PhoneVerificationRequest,
  PhoneVerificationResponse,
  PhoneVerificationStatusResponse,
} from '@/types/PhoneVerificationTypes';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://jjm.jojaemin.com';

const phoneVerificationClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
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

export const requestPhoneVerificationToken = async (
  payload: PhoneVerificationRequest,
): Promise<PhoneVerificationResponse> => {
  try {
    const response = await phoneVerificationClient.post<PhoneVerificationResponse>(
      '/auth/phone/verifications',
      payload,
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw new Error(resolveErrorMessage(axiosError));
  }
};

export const checkPhoneVerificationStatus = async (
  phoneNumber: string,
): Promise<PhoneVerificationStatusResponse> => {
  try {
    const response = await phoneVerificationClient.get<PhoneVerificationStatusResponse>(
      '/auth/phone/verifications',
      {
        params: { phoneNumber },
      },
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw new Error(resolveErrorMessage(axiosError));
  }
};
