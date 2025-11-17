export interface LoginRequest {
  uid: string;
  password: string;
}

export interface SignupRequest {
  uid: string;
  password: string;
  phone: string;
  username: string;
  birthDate: string;
}

export interface AuthTokensResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthTokensWithRefresh extends AuthTokensResponse {}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface LogoutRequest {
  refreshToken: string;
}

export interface LogoutResponse {
  message: string;
}
