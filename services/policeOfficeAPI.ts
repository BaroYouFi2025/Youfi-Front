import { PoliceOffice } from '@/types/PoliceOfficeTypes';
import apiClient from './apiClient';
import { AxiosError } from 'axios';

export interface NearbyPoliceOfficeParams {
  latitude: number;
  longitude: number;
  radiusMeters?: number;
  limit?: number;
}

const resolveErrorMessage = (error: AxiosError): string => {
  if (error.response?.data) {
    const data = error.response.data as { message?: string; errorMessage?: string };
    return data.message || data.errorMessage || '근처 경찰청을 찾는 중 오류가 발생했습니다.';
  }

  return error.message || '근처 경찰청을 찾는 중 오류가 발생했습니다.';
};

export const getNearbyPoliceOffices = async ({
  latitude,
  longitude,
  radiusMeters = 5000,
  limit = 5,
}: NearbyPoliceOfficeParams): Promise<PoliceOffice[]> => {
  try {
    const response = await apiClient.get<PoliceOffice[]>('/police-offices/nearby', {
      params: {
        latitude,
        longitude,
        radiusMeters,
        limit,
      },
    });

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('Error fetching nearby police offices:', axiosError.response?.data ?? axiosError.message);
    throw new Error(resolveErrorMessage(axiosError));
  }
};

