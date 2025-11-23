export interface MissingPersonData {
  name: string;
  birthDate: string;
  gender: 'male' | 'female' | 'private';
  missingDate: string;
  height: string;
  weight: string;
  bodyType: string;
  physicalFeatures: string;
  topClothing: string;
  bottomClothing: string;
  otherFeatures: string;
  photo?: string;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
}

export interface MissingPersonFormErrors {
  name?: string;
  birthDate?: string;
  missingDate?: string;
  height?: string;
  weight?: string;
  general?: string;
}

export interface MissingPersonAPIRequest {
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
  latitude?: number;
  longitude?: number;
  address?: string;
}

export interface MissingPersonAPIResponse {
  id: string;
  message: string;
  success: boolean;
}

export interface NearbyMissingPerson {
  id: number;
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