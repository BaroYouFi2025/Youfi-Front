import { MissingPersonAPIRequest, MissingPersonAPIResponse, MissingPersonData, NearbyMissingPersonsResponse } from '@/types/MissingPersonTypes';
import { getAccessToken } from '@/utils/authStorage';
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

/**
 * 근처 실종자 조회
 * @param latitude 위도
 * @param longitude 경도
 * @param radius 반경 (미터, 기본값: 1000)
 */
export const getNearbyMissingPersons = async (
  latitude: number,
  longitude: number,
  radius: number = 1000
): Promise<NearbyMissingPersonsResponse> => {
  try {
    const accessToken = await getAccessToken();
    const startTime = Date.now();
    
    console.log('🗺️ ========== 근처 실종자 조회 시작 ==========');
    console.log('🗺️ 조회 시점:', new Date().toISOString());
    console.log('🗺️ 위치 정보:', { latitude, longitude, radius });
    
    const response = await axios.get<NearbyMissingPersonsResponse>(
      `${API_BASE_URL}/missing-persons/nearby`,
      {
        params: {
          latitude,
          longitude,
          radius,
        },
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log('🗺️ ========== 근처 실종자 조회 성공 ==========');
    console.log('🗺️ 조회 소요 시간:', `${duration}ms`);
    console.log('🗺️ 총 실종자 수:', response.data.totalElements);
    console.log('🗺️ 현재 페이지 실종자 수:', response.data.content.length);
    
    if (response.data.content.length > 0) {
      console.log('🗺️ ========== 실종자 상세 정보 ==========');
      response.data.content.forEach((person, index) => {
        console.log(`🗺️ [${index + 1}] ID:`, person.id);
        console.log(`🗺️ [${index + 1}] 이름:`, person.name);
        console.log(`🗺️ [${index + 1}] 실종 위치:`, person.address || `${person.latitude}, ${person.longitude}`);
        console.log(`🗺️ [${index + 1}] 거리:`, person.distance ? `${person.distance}m` : 'N/A');
        console.log(`🗺️ [${index + 1}] 실종 일자:`, person.missing_date);
        console.log('🗺️ ----------------------------------------');
      });
    } else {
      console.log('🗺️ 근처에 실종자가 없습니다.');
    }
    console.log('🗺️ ========== 근처 실종자 조회 완료 ==========');
    
    return response.data;
  } catch (error) {
    console.error('❌ ========== 근처 실종자 조회 실패 ==========');
    console.error('❌ 에러 발생 시점:', new Date().toISOString());
    console.error('❌ 에러 타입:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('❌ 에러 메시지:', error instanceof Error ? error.message : String(error));
    if (axios.isAxiosError(error)) {
      console.error('❌ 응답 상태:', error.response?.status);
      console.error('❌ 응답 데이터:', JSON.stringify(error.response?.data, null, 2));
    }
    console.error('❌ ========================================');
    throw error;
  }
};