import axios from 'axios';
import { MissingPersonData, MissingPersonAPIRequest, MissingPersonAPIResponse } from '@/types/MissingPersonTypes';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.youfi.com';

export const createMissingPersonReport = async (data: MissingPersonData): Promise<MissingPersonAPIResponse> => {
  try {
    const requestData: MissingPersonAPIRequest = {
      name: data.name,
      birth_date: data.birthDate,
      gender: data.gender,
      missing_date: data.missingDate,
      height: Number(data.height),
      weight: Number(data.weight),
      body_type: data.bodyType,
      physical_features: data.physicalFeatures,
      top_clothing: data.topClothing,
      bottom_clothing: data.bottomClothing,
      other_features: data.otherFeatures,
      photo_url: data.photo,
      latitude: data.location?.latitude,
      longitude: data.location?.longitude,
      address: data.location?.address,
    };

    const response = await axios.post<MissingPersonAPIResponse>(
      `${API_BASE_URL}/missing-persons`,
      requestData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error creating missing person report:', error);
    throw new Error('실종자 등록에 실패했습니다. 다시 시도해주세요.');
  }
};

export const uploadPhoto = async (photoUri: string): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('photo', {
      uri: photoUri,
      type: 'image/jpeg',
      name: 'missing_person_photo.jpg',
    } as any);

    const response = await axios.post<{ url: string }>(
      `${API_BASE_URL}/upload/photo`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data.url;
  } catch (error) {
    console.error('Error uploading photo:', error);
    throw new Error('사진 업로드에 실패했습니다. 다시 시도해주세요.');
  }
};