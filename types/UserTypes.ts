export interface UserSearchRequest {
  uid?: string;
  page?: number;
  size?: number;
}

export interface UserSummary {
  userId?: number;
  uid?: string;
  name?: string;
  title?: string;
  profileUrl?: string;
  profileBackgroundColor?: string;
  level?: number;
  exp?: number;
  distanceKm?: number;
}

export interface SliceResponse<T> {
  content: T[];
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
  sort?: unknown;
  pageable?: unknown;
}
