export interface PoliceOffice {
  id: number;
  headquarters: string;
  station: string;
  officeName: string;
  officeType: string;
  phoneNumber?: string;
  address: string;
  latitude: number;
  longitude: number;
  distanceKm?: number;
}

