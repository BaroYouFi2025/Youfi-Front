export interface MissingPersonData {
  name: string;
  birthDate: string;
  gender: 'MALE' | 'FEMALE';
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
  gender: 'MALE' | 'FEMALE';
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
  missingPersonId: number;
}
