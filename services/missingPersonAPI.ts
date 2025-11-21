import { MissingPersonAPIRequest, MissingPersonAPIResponse, MissingPersonData } from '@/types/MissingPersonTypes';
import axios from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.youfi.com';

export const createMissingPersonReport = async (data: MissingPersonData): Promise<MissingPersonAPIResponse> => {
  try {
    const requestData: MissingPersonAPIRequest = {
      name: data.name,
      birthDate: data.birthDate,
      gender: data.gender,
      missingDate: data.missingDate,
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
        },
      }
    );

    return response.data.url;
  } catch (error) {
    console.error('Error uploading photo:', error);
    throw new Error('사진 업로드에 실패했습니다. 다시 시도해주세요.');
  }
};
