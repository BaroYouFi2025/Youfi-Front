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
   location?: string;
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
