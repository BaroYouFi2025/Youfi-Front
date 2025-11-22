import { MissingPersonAPIRequest, MissingPersonAPIResponse, MissingPersonData } from '@/types/MissingPersonTypes';
import { getAccessToken } from '@/utils/authStorage';
import axios, { AxiosError } from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://jjm.jojaemin.com';

const requireAccessToken = async (): Promise<string> => {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('로그인 세션이 만료되었습니다. 다시 로그인 후 시도해주세요.');
  }
  return token;
};

const resolveErrorMessage = (error: AxiosError): string => {
  if (error.response?.status === 401) {
    return '인증 정보가 유효하지 않습니다. 다시 로그인 후 시도해주세요.';
  }

  if (error.response?.data) {
    const data = error.response.data as { message?: string; errorMessage?: string };
    return data.message || data.errorMessage || '요청 처리 중 오류가 발생했습니다.';
  }

  return '요청 처리 중 오류가 발생했습니다.';
};

const toApiDateTime = (value: string): string => {
  if (!value) return value;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  // API는 스웨거 예시처럼 밀리초/타임존 없이 "YYYY-MM-DDTHH:mm:ss"를 기대
  return date.toISOString().slice(0, 19);
};

export const createMissingPersonReport = async (data: MissingPersonData): Promise<MissingPersonAPIResponse> => {
  try {
    const accessToken = await requireAccessToken();
    const requestData: MissingPersonAPIRequest = {
      name: data.name,
      birthDate: data.birthDate,
      gender: data.gender,
      missingDate: toApiDateTime(data.missingDate),
      height: Number(data.height),
      weight: Number(data.weight),
      body: data.body,
      bodyEtc: data.bodyEtc,
      clothesTop: data.clothesTop,
      clothesBottom: data.clothesBottom,
      clothesEtc: data.clothesEtc,
      photoUrl: data.photo,
      latitude: data.location?.latitude ?? 0,
      longitude: data.location?.longitude ?? 0,
    };

    const response = await axios.post<MissingPersonAPIResponse>(
      `${API_BASE_URL}/missing-persons/register`,
      requestData,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('Error creating missing person report:', axiosError.response?.data ?? axiosError.message);
    throw new Error(resolveErrorMessage(axiosError));
  }
};

export const uploadPhoto = async (photoUri: string): Promise<string> => {
  try {
    const accessToken = await requireAccessToken();
    const formData = new FormData();
    formData.append('file', {
      uri: photoUri,
      type: 'image/jpeg',
      name: 'missing_person_photo.jpg',
    } as any);

    const response = await axios.post<{ url: string }>(
      `${API_BASE_URL}/images`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data.url;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('Error uploading photo:', axiosError.response?.data ?? axiosError.message);
    throw new Error(resolveErrorMessage(axiosError));
  }
};
