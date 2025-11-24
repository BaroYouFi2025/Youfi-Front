import { AxiosError } from 'axios';

import {
    PhoneVerificationRequest,
    PhoneVerificationResponse,
    PhoneVerificationStatusResponse,
} from '@/types/PhoneVerificationTypes';
import { resolveErrorMessage } from '@/utils/apiErrorHandler';

import apiClient from './apiClient';

export const requestPhoneVerificationToken = async (
  payload: PhoneVerificationRequest,
): Promise<PhoneVerificationResponse> => {
  try {
    const response = await apiClient.post<PhoneVerificationResponse>(
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
    const response = await apiClient.get<PhoneVerificationStatusResponse>(
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
