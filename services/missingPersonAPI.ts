import { MissingPersonAPIRequest, MissingPersonAPIResponse, MissingPersonData, NearbyMissingPersonsResponse } from '@/types/MissingPersonTypes';
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
