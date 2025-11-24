import { PoliceOffice } from '@/types/PoliceOfficeTypes';
import { resolveErrorMessage } from '@/utils/apiErrorHandler';
import { AxiosError } from 'axios';

import apiClient from './apiClient';

export interface NearbyPoliceOfficeParams {
  latitude: number;
  longitude: number;
  radiusMeters?: number;
  limit?: number;
}

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

