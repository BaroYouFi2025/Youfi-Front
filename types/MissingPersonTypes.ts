export interface MissingPersonData {
  name: string;
  birthDate: string;
  gender: '남성' | '여성';
  missingDate: string; // ISO string with time
  height: string;
  weight: string;
  body: string;
  bodyEtc: string;
  clothesTop: string;
  clothesBottom: string;
  clothesEtc: string;
  photo?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

export interface MissingPersonFormErrors {
  name?: string;
  birthDate?: string;
  missingDate?: string;
  height?: string;
  weight?: string;
  location?: string;
  body?: string;
  clothesTop?: string;
  clothesBottom?: string;
  bodyEtc?: string;
  clothesEtc?: string;
  general?: string;
}

export interface MissingPersonAPIRequest {
  name: string;
  birthDate: string;
  gender: '남성' | '여성';
  missingDate: string;
  height: number;
  weight: number;
  body: string;
  bodyEtc: string;
  clothesTop: string;
  clothesBottom: string;
  clothesEtc: string;
  photoUrl?: string;
  latitude: number;
  longitude: number;
}

export interface MissingPersonAPIResponse {
  id: string;
  message: string;
  success: boolean;
}

export interface MissingPersonDetail {
  missingPersonId: number;
  name: string;
  birthDate: string;
  address: string;
  missingDate: string;
  height: number;
  weight: number;
  body: string;
  bodyEtc: string;
  clothesTop: string;
  clothesBottom: string;
  clothesEtc: string;
  latitude: number;
  longitude: number;
  photoUrl?: string;
}

export interface NearbyMissingPerson {
  // API 응답에서 ID 필드명이 상황에 따라 달라 예외적으로 모두 허용
  id?: number;
  missingPersonId?: number;
  personId?: number;
  missing_person_id?: number;
  name: string;
  birth_date: string;
  gender: 'male' | 'female' | 'private';
  missing_date: string;
  height: number;
  weight: number;
  body_type: string;
  physical_features: string;
  top_clothing: string;
  bottom_clothing: string;
  other_features: string;
  photo_url?: string;
  latitude: number;
  longitude: number;
  address?: string;
  distance?: number; // 거리 (미터)
  hasDementia?: boolean; // 치매 여부
}

export interface NearbyMissingPersonsResponse {
  totalElements: number;
  totalPages: number;
  size: number;
  content: NearbyMissingPerson[];
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  pageable: {
    offset: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    paged: boolean;
    pageNumber: number;
    pageSize: number;
    unpaged: boolean;
  };
  last: boolean;
  empty: boolean;
}


export interface MissingPersonSightingRequest {
  missingPersonId: number;
  latitude: number;
  longitude: number;
}

export interface MissingPersonSightingResponse {
  message: string;
}
export interface MissingPersonDetailResponse {
  missingPersonId: number;
  name: string;
  birthDate: string;
  gender?: '남성' | '여성';
  address?: string;
  missingDate: string;
  height: number;
  weight: number;
  body: string;
  bodyEtc?: string;
  clothesTop?: string;
  clothesBottom?: string;
  clothesEtc?: string;
  latitude?: number;
  longitude?: number;
  photoUrl?: string;
  predictedFaceUrl?: string;
  appearanceImageUrl?: string;
}

export type AIAssetType = 'AGE_PROGRESSION' | 'GENERATED_IMAGE';

export interface GenerateAIImageRequest {
  missingPersonId: number;
  assetType: AIAssetType;
}

export interface GenerateAIImageResponse {
  assetType: AIAssetType;
  imageUrls: string[];
}

export interface ApplyAIImageRequest {
  missingPersonId: number;
  assetType: AIAssetType;
  selectedImageUrl: string;
}

export interface ApplyAIImageResponse {
  missingPersonId: number;
  assetType: AIAssetType;
  appliedUrl: string;
}
