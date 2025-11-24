import {
  MissingPersonAPIRequest,
  MissingPersonAPIResponse,
  MissingPersonData,
  MissingPersonDetail,
  MissingPersonSightingRequest,
  MissingPersonSightingResponse,
  NearbyMissingPersonsResponse,
} from '@/types/MissingPersonTypes';
import { getAccessToken } from '@/utils/authStorage';
import { AxiosError, isAxiosError } from 'axios';
import apiClient from './apiClient';

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

    const response = await apiClient.post<MissingPersonAPIResponse>(
      '/missing-persons/register',
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

    const response = await apiClient.post<{ url: string }>(
      '/images',
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

/**
 * 실종자 상세 조회
 * @param id 실종자 ID
 */
export const getMissingPersonDetail = async (id: number): Promise<MissingPersonDetail> => {
  try {
    const accessToken = await getAccessToken();
    
    console.log('🔍 실종자 상세 조회 시작:', { id });
    
    const response = await apiClient.get<MissingPersonDetail>(
      `/missing-persons/${id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    console.log('✅ 실종자 상세 조회 성공:', {
      id: response.data.missingPersonId,
      name: response.data.name,
      latitude: response.data.latitude,
      longitude: response.data.longitude,
    });
    
    return response.data;
  } catch (error) {
    console.error('❌ 실종자 상세 조회 실패:', { id, error });
    throw error;
  }
};

/**
 * 근처 실종자 조회 (위치 정보 포함)
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
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    const response = await apiClient.get<NearbyMissingPersonsResponse>(
      '/missing-persons/nearby',
      {
        params: {
          latitude,
          longitude,
          radius,
        },
        headers,
      }
    );
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log('🗺️ ========== 근처 실종자 조회 성공 ==========');
    console.log('🗺️ 조회 소요 시간:', `${duration}ms`);
    console.log('🗺️ 총 실종자 수:', response.data.totalElements);
    console.log('🗺️ 현재 페이지 실종자 수:', response.data.content.length);
    
    console.log('🗺️ ========== nearby API 전체 응답 확인 ==========');
    console.log('🗺️ 전체 응답:', JSON.stringify(response.data, null, 2));
    console.log('🗺️ =======================================');
    
    // 각 실종자의 상세 정보를 조회하여 위치 정보 추가
    if (response.data.content.length > 0) {
      console.log('🗺️ ========== nearby API 첫 번째 실종자 확인 ==========');
      console.log('🗺️ content[0]:', response.data.content[0]);
      console.log('🗺️ content[0] stringify:', JSON.stringify(response.data.content[0], null, 2));
      console.log('🗺️ ID 필드들:', {
        id: response.data.content[0].id,
        missingPersonId: response.data.content[0].missingPersonId,
        personId: response.data.content[0].personId,
        missing_person_id: response.data.content[0].missing_person_id,
      });
      console.log('🗺️ 모든 키:', Object.keys(response.data.content[0]));
      console.log('🗺️ ================================================');
      
      console.log('🗺️ ========== 실종자 상세 정보 조회 시작 ==========');
      
      const personsWithDetails = await Promise.all(
        response.data.content.map(async (person) => {
          try {
            // ID 필드명이 다를 수 있으므로 여러 가능성 확인
            const personId = person.id || person.missingPersonId || person.personId || (person as any).missing_person_id;
            
            console.log('🔍 ID 찾기 시도:', {
              'person.id': person.id,
              'person.missingPersonId': person.missingPersonId,
              'person.personId': person.personId,
              'person.missing_person_id': (person as any).missing_person_id,
              '최종 personId': personId,
              'person 전체': person,
            });
            
            if (!personId) {
              console.error('❌ 실종자 ID를 찾을 수 없음:', {
                person,
                allKeys: Object.keys(person),
              });
              return person;
            }
            
            console.log('🔍 실종자 상세 조회 시작:', { personId });
            const detail = await getMissingPersonDetail(personId);
            
            // 상세 정보의 필드명을 NearbyMissingPerson 타입에 맞게 변환
            return {
              ...person,
              latitude: detail.latitude,
              longitude: detail.longitude,
              address: detail.address,
              birth_date: detail.birthDate,
              missing_date: detail.missingDate,
              body_type: detail.body,
              physical_features: detail.bodyEtc,
              top_clothing: detail.clothesTop,
              bottom_clothing: detail.clothesBottom,
              other_features: detail.clothesEtc,
              photo_url: detail.photoUrl,
            };
          } catch (error) {
            const personId = person.id || person.missingPersonId || person.personId;
            console.error(`❌ 실종자 ${personId} 상세 조회 실패:`, error);
            if (isAxiosError(error)) {
              console.error('❌ 응답 상태:', error.response?.status);
              console.error('❌ 응답 데이터:', error.response?.data);
            }
            // 상세 정보 조회 실패 시 기본 데이터만 반환
            return person;
          }
        })
      );
      
      console.log('🗺️ ========== 실종자 위치 정보 확인 ==========');
      personsWithDetails.forEach((person, index) => {
        console.log(`🗺️ [${index + 1}] ID:`, person.id);
        console.log(`🗺️ [${index + 1}] 이름:`, person.name);
        console.log(`🗺️ [${index + 1}] 위도(latitude):`, person.latitude, typeof person.latitude);
        console.log(`🗺️ [${index + 1}] 경도(longitude):`, person.longitude, typeof person.longitude);
        console.log(`🗺️ [${index + 1}] 주소:`, person.address || 'N/A');
        console.log(`🗺️ [${index + 1}] 거리:`, person.distance ? `${person.distance}m` : 'N/A');
        console.log('🗺️ ----------------------------------------');
      });
      
      console.log('🗺️ ========== 근처 실종자 조회 완료 ==========');
      
      return {
        ...response.data,
        content: personsWithDetails,
      };
    } else {
      console.log('🗺️ 근처에 실종자가 없습니다.');
      console.log('🗺️ ========== 근처 실종자 조회 완료 ==========');
      return response.data;
    }
  } catch (error) {
    console.error('❌ ========== 근처 실종자 조회 실패 ==========');
    console.error('❌ 에러 발생 시점:', new Date().toISOString());
    console.error('❌ 에러 타입:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('❌ 에러 메시지:', error instanceof Error ? error.message : String(error));
    if (isAxiosError(error)) {
      console.error('❌ 응답 상태:', error.response?.status);
      console.error('❌ 응답 데이터:', JSON.stringify(error.response?.data, null, 2));
    }
    console.error('❌ ========================================');
    throw error;
  }
};

export const reportMissingPersonSighting = async (
  payload: MissingPersonSightingRequest
): Promise<MissingPersonSightingResponse> => {
  try {
    const accessToken = await requireAccessToken();
    const response = await apiClient.post<MissingPersonSightingResponse>(
      '/missing-persons/sightings',
      payload,
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
    console.error('Error reporting missing person sighting:', axiosError.response?.data ?? axiosError.message);
    throw new Error(resolveErrorMessage(axiosError));
  }
};
