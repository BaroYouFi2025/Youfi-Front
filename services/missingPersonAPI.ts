import {
    MissingPersonAPIRequest,
    MissingPersonAPIResponse,
    MissingPersonData,
    NearbyMissingPersonsResponse
} from '@/types/MissingPersonTypes';
import axios from 'axios';

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

export const getNearbyMissingPersons = async (
  latitude: number,
  longitude: number,
  radius: number = 1000,
  page: number = 0,
  size: number = 20
): Promise<NearbyMissingPersonsResponse> => {
  try {
    console.log('🔍 주변 실종자 조회 요청:', { latitude, longitude, radius, page, size });
    
    const response = await axios.get<NearbyMissingPersonsResponse>(
      `${API_BASE_URL}/missing-persons/nearby`,
      {
        params: {
          latitude,
          longitude,
          radius,
          page,
          size,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('✅ 주변 실종자 조회 성공:', response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // 404나 빈 결과는 에러가 아니라 빈 배열로 처리
      if (error.response?.status === 404 || error.response?.data?.code === 'ENDPOINT_NOT_FOUND') {
        console.log('ℹ️ 주변 실종자 없음 또는 엔드포인트 없음');
        return {
          content: [],
          pageable: { pageNumber: 0, pageSize: size },
          totalElements: 0,
          totalPages: 0,
          last: true,
        };
      }
      
      console.error('❌ API 에러:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
    } else {
      console.error('❌ 알 수 없는 에러:', error);
    }
    
    // 에러 발생 시에도 빈 배열 반환
    return {
      content: [],
      pageable: { pageNumber: 0, pageSize: size },
      totalElements: 0,
      totalPages: 0,
      last: true,
    };
  }
};