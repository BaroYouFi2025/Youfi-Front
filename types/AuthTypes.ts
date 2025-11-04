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
  expiresIn: number;
}

export interface AuthTokensWithRefresh extends AuthTokensResponse {
  refreshToken?: string;
}

export interface RefreshResponse extends AuthTokensResponse {}

export interface LogoutResponse {
  message: string;
}
