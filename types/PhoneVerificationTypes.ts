export interface PhoneVerificationRequest {
  phoneNumber: string;
}

export interface PhoneVerificationResponse {
  token: string;
}

export interface PhoneVerificationStatusResponse {
  verified: boolean;
}
