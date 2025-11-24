import {
  AIAssetType,
  ApplyAIImageResponse,
  GenerateAIImageResponse,
  MissingPersonAPIRequest,
  MissingPersonAPIResponse,
  MissingPersonData,
  MissingPersonDetail,
  MissingPersonDetailResponse,
  MissingPersonSightingRequest,
  MissingPersonSightingResponse,
  NearbyMissingPersonsResponse,
} from '@/types/MissingPersonTypes';
import { getAccessToken } from '@/utils/authStorage';
import { resolveErrorMessage } from '@/utils/apiErrorHandler';
import { AxiosError, isAxiosError } from 'axios';

import apiClient from './apiClient';

const requireAccessToken = async (): Promise<string> => {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('로그인 세션이 만료되었습니다. 다시 로그인 후 시도해주세요.');
  }
  return token;
};

const toApiDateTime = (value: string): string => {
  if (!value) return value;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  // API는 스웨거 예시처럼 밀리초/타임존 없이 "YYYY-MM-DDTHH:mm:ss"를 기대
  return date.toISOString().slice(0, 19);
};

const extractList = (payload: unknown): any[] => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && typeof payload === 'object') {
    const obj = payload as Record<string, unknown>;

    if (Array.isArray(obj.content)) {
      return obj.content;
    }

    if (Array.isArray(obj.data)) {
      return obj.data;
    }

    const dataField = obj.data as Record<string, unknown> | undefined;
    if (dataField && Array.isArray(dataField.content)) {
      return dataField.content;
    }
  }

  return [];
};

export const getMyMissingPersons = async (): Promise<any[]> => {
  try {
    const accessToken = await requireAccessToken();
    const response = await apiClient.get('/missing-persons/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return extractList(response.data);
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('Error fetching user missing persons:', axiosError.response?.data ?? axiosError.message);
    throw new Error(resolveErrorMessage(axiosError));
  }
};

export const getMissingPersonById = async (id: string | number): Promise<MissingPersonDetailResponse> => {
  try {
    const accessToken = await requireAccessToken();
    const response = await apiClient.get(`/missing-persons/${id}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data as MissingPersonDetailResponse;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('Error fetching missing person detail:', axiosError.response?.data ?? axiosError.message);
    throw new Error(resolveErrorMessage(axiosError));
  }
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

export const updateMissingPerson = async (
  id: string | number,
  data: MissingPersonData
): Promise<MissingPersonAPIResponse> => {
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

    const response = await apiClient.put<MissingPersonAPIResponse>(
      `/missing-persons/register/${id}`,
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
    console.error('Error updating missing person:', axiosError.response?.data ?? axiosError.message);
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


    const response = await apiClient.get<MissingPersonDetail>(
      `/missing-persons/${id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

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



    // 각 실종자의 상세 정보를 조회하여 위치 정보 추가
    if (response.data.content.length > 0) {
      const personsWithDetails = await Promise.all(
        response.data.content.map(async (person) => {
          try {
            // ID 필드명이 다를 수 있으므로 여러 가능성 확인
            const personId = person.id || person.missingPersonId || person.personId || (person as any).missing_person_id;

            if (!personId) {
              console.error('❌ 실종자 ID를 찾을 수 없음:', {
                person,
                allKeys: Object.keys(person),
              });
              return person;
            }

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

      return {
        ...response.data,
        content: personsWithDetails,
      };
    } else {
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

export const generateAIImage = async (
  missingPersonId: number,
  assetType: AIAssetType = 'AGE_PROGRESSION'
): Promise<GenerateAIImageResponse> => {
  try {
    const accessToken = await requireAccessToken();

    const response = await apiClient.post<GenerateAIImageResponse>(
      '/ai/images/generate',
      { missingPersonId, assetType },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        timeout: 120000, // AI 생성은 시간이 오래 걸릴 수 있으므로 2분으로 설정
      }
    );

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('Error generating AI image:', axiosError.response?.data ?? axiosError.message);
    throw new Error(resolveErrorMessage(axiosError));
  }
};

export const closeMissingPerson = async (id: string | number): Promise<void> => {
  try {
    const accessToken = await requireAccessToken();

    await apiClient.post(
      `/missing-persons/${id}/close`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('Error closing missing person:', axiosError.response?.data ?? axiosError.message);
    throw new Error(resolveErrorMessage(axiosError));
  }
};

export const applyAIImage = async (
  missingPersonId: number,
  assetType: AIAssetType,
  selectedImageUrl: string
): Promise<ApplyAIImageResponse> => {
  try {
    const accessToken = await requireAccessToken();

    const response = await apiClient.post<ApplyAIImageResponse>(
      '/ai/images/apply',
      { missingPersonId, assetType, selectedImageUrl },
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
    console.error('Error applying AI image:', axiosError.response?.data ?? axiosError.message);
    throw new Error(resolveErrorMessage(axiosError));
  }
};
