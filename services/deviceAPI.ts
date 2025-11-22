import axios, { AxiosError } from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://jjm.jojaemin.com';

const deviceClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

interface RegisterDeviceRequest {
  fcmToken: string;
}

interface RegisterDeviceResponse {
  message: string;
}

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

export const registerDevice = async (fcmToken: string, accessToken?: string): Promise<RegisterDeviceResponse> => {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const response = await deviceClient.post<RegisterDeviceResponse>(
      '/device',
      { fcmToken },
      { headers }
    );

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw new Error(resolveErrorMessage(axiosError));
  }
};
