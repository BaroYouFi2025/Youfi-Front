export interface UserSearchRequest {
  uid?: string;
  page?: number;
  size?: number;
}

export interface UserSummary {
  id?: number;
  userId?: number; // 하위 호환성을 위해 유지
  uid?: string;
  name?: string;
  title?: string;
  profileUrl?: string;
  profile_url?: string; // API 응답 필드명 (snake_case)
  profileBackgroundColor?: string;
  level?: number;
  exp?: number;
  distanceKm?: number;
}

export interface SortInfo {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: SortInfo;
  offset: number;
  paged: boolean;
  unpaged: boolean;
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

export interface UserSearchResponse extends SliceResponse<UserSummary> {
  pageable: Pageable;
  sort: SortInfo;
}
