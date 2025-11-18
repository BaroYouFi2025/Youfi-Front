# Baro API Documentation

**Base URL**: `https://jjm.jojaemin.com`  
**API Version**: v1.0.0  
**Authentication**: Bearer Token (JWT)

---

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <accessToken>
```

### Auth Endpoints

#### POST /auth/login
로그인을 수행하고 JWT 토큰을 발급받습니다.

**Request Body**:
```json
{
  "uid": "baro",
  "password": "barobaro"
}
```

**Response** (200):
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGci0OiJIUzI1NiIs...",
  "expiresIn": 3600
}
```

**Error Responses**:
- 401: 아이디 또는 비밀번호가 올바르지 않습니다
- 429: 로그인 시도가 너무 많습니다

---

#### POST /auth/refresh
Access Token과 Refresh Token을 갱신합니다.

**Request Body**:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response** (200):
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGci0OiJIUzI1NiIs...",
  "expiresIn": 3600
}
```

---

#### POST /auth/logout
로그아웃을 수행하고 Refresh Token을 무효화합니다.

**Request Body**:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response** (200):
```json
{
  "message": "로그아웃 되었습니다."
}
```

---

## User Management

#### POST /users/register
새로운 사용자를 등록합니다. 전화번호 인증이 완료된 상태에서 호출해야 합니다.

**Request Body**:
```json
{
  "uid": "newUs",
  "password": "StrongPass123!",
  "phone": "01012345678",
  "username": "김이수",
  "birthDate": "2000-09-09"
}
```

**Validation**:
- uid: 4~20자
- password: 8~20자
- phone: 11자리 (하이픈 없음)
- username: 1~20자
- birthDate: yyyy-MM-dd 형식

**Response** (200):
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGci0OiJIUzI1NiIs...",
  "expiresIn": 3600
}
```

**Error Responses**:
- 400: UID already exists
- 401: 전화번호 인증이 필요합니다

---

#### GET /users/me
현재 로그인한 사용자의 프로필 정보를 조회합니다.

**Response** (200):
```json
{
  "userId": 2,
  "name": "배성민",
  "level": 3,
  "exp": 40,
  "title": "수색 초보자",
  "profileUrl": "https://example.com/profile.jpg",
  "profileBackgroundColor": "#FFFFFF"
}
```

---

#### PATCH /users/me
현재 로그인한 사용자의 프로필 정보를 수정합니다.

**Request Body**:
```json
{
  "name": "배성민",
  "title": "수색 초보자",
  "profileUrl": "https://example.com/profile.jpg",
  "profileBackgroundColor": "#FFFFFF"
}
```

---

#### DELETE /users/me
현재 로그인한 사용자의 계정을 비활성화합니다.

**Request Body**:
```json
{
  "password": "password123!"
}
```

**Response** (200):
```json
{
  "message": "회원 탈퇴가 완료되었습니다."
}
```

---

#### POST /users/search
UID로 사용자를 검색합니다. UID가 입력되지 않으면 사용자 주위 우선으로 조회합니다.

**Request Body**:
```json
{
  "uid": "user4",
  "page": 0,
  "size": 20
}
```

**Response** (200): Slice 형태의 페이징된 사용자 목록

---

## Phone Verification

#### POST /auth/phone/verifications
전화번호 인증을 위한 토큰을 생성하고 이메일 리스너를 시작합니다.

**Response** (200):
```json
{
  "token": "abc123def456"
}
```

---

#### GET /auth/phone/verifications
특정 전화번호의 인증 완료 여부를 확인합니다.

**Query Parameters**:
- phoneNumber: 전화번호 (11자리, 예: 01012345678)

**Response** (200):
```json
{
  "verified": true
}
```

---

#### POST /auth/phone/verifications/test
테스트용 전화번호 인증 (개발 환경 전용)

**Query Parameters**:
- token: 인증할 토큰
- phoneNumber: 인증할 전화번호 (11자리)

**Response** (200):
```json
{
  "verified": true
}
```

---

## Missing Person Management

#### POST /missing-persons/register
새로운 실종자 정보를 등록합니다.

**Request Body**:
```json
{
  "name": "김실종",
  "birthDate": "2015-09-12",
  "gender": "MALE",
  "photoUrl": "https://example.com/photo.jpg",
  "missingDate": "2025-10-01T14:30:00",
  "height": 165,
  "weight": 55,
  "body": "보통",
  "bodyEtc": "왼쪽 귀에 점이 2개 있음",
  "clothesTop": "티니핑 티",
  "clothesBottom": "노란 바지",
  "clothesEtc": "회색 바람막이",
  "latitude": 35.188884,
  "longitude": 128.90348
}
```

**Response** (200):
```json
{
  "missingPersonId": 1
}
```

---

#### PUT /missing-persons/register/{id}
기존 실종자 정보를 수정합니다.

**Path Parameters**:
- id: 실종자 ID

**Request Body**: RegisterMissingPersonRequest와 동일

---

#### GET /missing-persons/{id}
실종자 ID로 상세 정보를 조회합니다.

**Path Parameters**:
- id: 실종자 ID

**Response** (200):
```json
{
  "missingPersonId": 1,
  "name": "김실종",
  "birthDate": "2015-09-12",
  "address": "대한민국 부산광역시 사상구 삼락동 29-6",
  "missingDate": "2024-12-06T00:00:00+09:00",
  "height": 111,
  "weight": 28,
  "body": "통통한 체형",
  "bodyEtc": "왼쪽 팔에 점이 있음",
  "clothesTop": "파란색 티셔츠",
  "clothesBottom": "검은색 바지",
  "clothesEtc": "빨간 모자",
  "latitude": 35.188884,
  "longitude": 128.90348,
  "photoUrl": "https://example.com/photo.jpg"
}
```

---

#### GET /missing-persons/search
실종자 목록을 검색합니다.

**Query Parameters**:
- page: 페이지 번호 (기본값: 0)
- size: 페이지 크기 (기본값: 20)

**Response** (200): Page 형태의 페이징된 실종자 목록

---

#### GET /missing-persons/me
현재 로그인한 사용자가 등록한 실종자 목록을 조회합니다.

**Response** (200):
```json
[
  {
    "missingPersonId": 1,
    "name": "김수호",
    "address": "대한민국 부산광역시 사상구 삼락동 29-6",
    "height": 111,
    "weight": 28,
    "body": "통통한 체형",
    "photoUrl": "https://example.com/photo.jpg",
    "missing_date": "2024-12-06"
  }
]
```

---

#### POST /missing-persons/sightings
실종자를 발견했을 때 신고합니다. 신고가 접수되면 실종자 등록자에게 푸시 알림이 전송됩니다.

**Request Body**:
```json
{
  "missingPersonId": 1,
  "latitude": 37.5665,
  "longitude": 126.978
}
```

**Response** (200):
```json
{
  "message": "신고가 접수되었습니다. 실종자 등록자에게 알림이 전송되었습니다."
}
```

---

#### GET /missing-person/nearby
현재 위치 기준으로 반경 내의 실종자를 조회합니다.

**Query Parameters**:
- latitude: 위도 (예: 35.1763)
- longitude: 경도 (예: 128.9664)
- radius: 반경 (미터, 예: 1000)

**Response** (200): Page 형태의 페이징된 근처 실종자 목록

---

## Police API (경찰청 실종자 데이터)

#### POST /missing/police/sync
경찰청 API로부터 실종자 데이터를 즉시 동기화합니다. (관리자 권한 필요)

**Response** (200): 동기화 성공 메시지

**Error Responses**:
- 401: 인증되지 않은 사용자
- 403: 권한 없음 (관리자 전용)

---

#### GET /missing/police/missing-persons
DB에 저장된 경찰청 실종자 데이터를 페이징하여 조회합니다.

**Query Parameters**:
- page: 페이지 번호 (기본값: 0)
- size: 페이지 크기 (기본값: 20, 최대: 100)

**Response** (200): Page 형태의 페이징된 경찰청 실종자 목록

---

#### GET /missing/police/missing-persons/{id}
경찰청 실종자 ID로 상세 정보를 조회합니다.

**Path Parameters**:
- id: 경찰청 실종자 ID

**Response** (200):
```json
{
  "id": 123456789,
  "occurrenceDate": "20231215",
  "dress": "검은색 청바지, 흰색 티셔츠",
  "ageNow": 25,
  "missingAge": 20,
  "statusCode": "010",
  "gender": "남자",
  "specialFeatures": "왼쪽 팔에 문신",
  "occurrenceAddress": "서울특별시 강남구 역삼동",
  "name": "홍길동",
  "photoUrl": "http://localhost:8080/uploads/images/police_123456789_abc123.jpg"
}
```

---

## Device Management

#### POST /devices/register
새로운 기기를 등록합니다. 클라이언트가 생성한 UUID를 사용합니다.

**Request Body**:
```json
{
  "deviceUuid": "device-uuid-1234",
  "osType": "iOS",
  "osVersion": "17.0",
  "fcmToken": "fcm-token-string"
}
```

**Response** (200):
```json
{
  "deviceId": 123,
  "deviceUuid": "device-uuid-1234",
  "batteryLevel": 85,
  "osType": "iOS",
  "osVersion": "17.0",
  "registeredAt": "2024-01-15T10:30:00",
  "fcmToken": "fcm-token-string",
  "active": true
}
```

---

#### POST /devices/{deviceId}/gps
기기의 GPS 위치를 업데이트합니다.

**Path Parameters**:
- deviceId: 기기 ID

**Request Body**:
```json
{
  "latitude": 37.5665,
  "longitude": 126.978,
  "batteryLevel": 85
}
```

**Validation**:
- latitude: -90 ~ 90
- longitude: -180 ~ 180
- batteryLevel: 0 ~ 100 (선택)

**Response** (200):
```json
{
  "latitude": 37.5665,
  "longitude": 126.978,
  "recordedAt": "2024-01-15T10:30:00",
  "message": "GPS 위치가 업데이트 되었습니다."
}
```

---

#### POST /devices/fcm-token
기기의 FCM 토큰을 업데이트합니다.

**Request Body**:
```json
{
  "fcmToken": "fcm-token-string"
}
```

**Response** (200): FCM 토큰 업데이트 성공

---

## Member & Invitation Management

#### POST /members/invitations
다른 사용자를 멤버로 초대합니다.

**Request Body**:
```json
{
  "inviteeUserId": 1,
  "relation": "아들"
}
```

**Response** (201):
```json
{
  "relationshipRequestId": 1
}
```

---

#### POST /members/invitations/acceptance
받은 초대를 수락하여 관계를 맺습니다.

**Request Body**:
```json
{
  "relationshipRequestId": 1,
  "relation": "아버지"
}
```

**Response** (201):
```json
{
  "relationshipIds": [1, 2]
}
```

---

#### DELETE /members/invitations/rejection
받은 초대를 거절합니다.

**Request Body**:
```json
{
  "relationshipId": 1
}
```

**Response** (204): 초대 거절 성공

---

#### GET /members/locations
사용자와 관계가 있는 구성원들의 위치, 배터리, 거리 정보를 조회합니다.

**Response** (200):
```json
[
  {
    "userId": 1,
    "name": "김실종",
    "relationship": "가족",
    "batteryLevel": 45,
    "distance": 0.1,
    "location": {
      "latitude": 35.1763,
      "longitude": 128.9664
    }
  }
]
```

---

## Notification Management

#### GET /notifications/me
현재 로그인한 사용자의 모든 알림을 조회합니다.

**Response** (200):
```json
[
  {
    "id": 1,
    "type": "INVITE_REQUEST",
    "title": "새로운 구성원 초대 요청",
    "message": "홍길동님이 아들로 초대 요청을 보냈습니다.",
    "createdAt": "2024-01-15T10:30:00",
    "readAt": null,
    "read": false
  }
]
```

**Notification Types**:
- INVITE_REQUEST: 초대 요청
- FOUND_REPORT: 발견 신고
- NEARBY_ALERT: 근처 알림

---

#### GET /notifications/me/unread
현재 로그인한 사용자의 읽지 않은 알림만 조회합니다.

---

#### GET /notifications/unread-count
현재 로그인한 사용자의 읽지 않은 알림 개수를 조회합니다.

**Response** (200): 읽지 않은 알림 개수 (integer)

---

#### GET /notifications/users/{userId}
특정 사용자 ID의 모든 알림을 조회합니다. (본인 알림만 조회 가능)

**Path Parameters**:
- userId: 사용자 ID

---

#### PUT /notifications/{notificationId}/read
특정 알림을 읽음 처리합니다.

**Path Parameters**:
- notificationId: 알림 ID

**Response** (200): 읽음 처리 성공

---

## Image Management

#### POST /images
이미지 파일을 업로드하고 접근 가능한 URL을 반환합니다.

**Request**: multipart/form-data
- file: 업로드할 이미지 파일 (jpg, png, webp 등)

**Response** (200):
```json
{
  "url": "http://localhost:8080/images/2025/01/26/abc-123-def.jpg"
}
```

**Error Responses**:
- 400: 파일 없음, 이미지가 아님, 파일 크기 초과
- 401: 인증 필요

---

## AI Image Generation

#### POST /ai/images/generate
실종자 정보 기반으로 AI 이미지를 생성합니다.

**Request Body**:
```json
{
  "missingPersonId": 1,
  "assetType": "AGE_PROGRESSION"
}
```

**Asset Types**:
- AGE_PROGRESSION: 성장/노화 이미지 (3장)
- GENERATED_IMAGE: 인상착의 이미지 (1장)

**Response** (200):
```json
{
  "assetType": "AGE_PROGRESSION",
  "imageUrls": [
    "http://example.com/image1.jpg",
    "http://example.com/image2.jpg",
    "http://example.com/image3.jpg"
  ]
}
```

---

#### POST /ai/images/apply
생성된 이미지 중 선택한 이미지를 MissingPerson에 대표 이미지로 저장합니다.

**Request Body**:
```json
{
  "missingPersonId": 1,
  "assetType": "AGE_PROGRESSION",
  "selectedImageUrl": "http://example.com/image.jpg"
}
```

**Response** (200):
```json
{
  "missingPersonId": 1,
  "assetType": "AGE_PROGRESSION",
  "appliedUrl": "http://example.com/image.jpg"
}
```

---

## Location Services

#### GET /location/address
위도와 경도를 입력받아 해당 위치의 주소를 반환합니다. (Google Maps Geocoding API 사용)

**Query Parameters**:
- latitude: 위도 (예: 37.5665)
- longitude: 경도 (예: 126.978)

**Response** (200):
```json
{
  "latitude": 37.5665,
  "longitude": 126.978,
  "address": "서울특별시 중구 세종대로 110",
  "success": true
}
```

---

## Police Office Search

#### GET /police-offices/nearby
현재 GPS 좌표를 기준으로 가까운 지구대/파출소 목록을 반환합니다.

**Query Parameters**:
- latitude: 위도 (예: 37.5665)
- longitude: 경도 (예: 126.978)
- radiusMeters: 검색 반경 (미터, 기본값: 5000)
- limit: 최대 결과 수 (기본값: 5)

**Response** (200):
```json
[
  {
    "id": 1,
    "headquarters": "서울청",
    "station": "서울중부",
    "officeName": "을지",
    "officeType": "지구대",
    "phoneNumber": "02-2279-1908",
    "address": "서울특별시 중구 퇴계로49길 13",
    "latitude": 37.5665,
    "longitude": 126.978,
    "distanceKm": 1.2
  }
]
```

---

## Common Error Response Format

```json
{
  "code": "ERROR_CODE",
  "message": "에러 메시지",
  "status": 400,
  "timestamp": "2024-01-15T10:30:00"
}
```

---

## Common HTTP Status Codes

- 200: 성공
- 201: 생성 성공
- 204: 성공 (응답 본문 없음)
- 400: 잘못된 요청 (유효성 검증 실패)
- 401: 인증 실패
- 403: 권한 없음
- 404: 리소스를 찾을 수 없음
- 429: 요청 횟수 제한 초과
- 500: 서버 내부 오류

---

## Data Types & Enums

### Gender
- MALE: 남성
- FEMALE: 여성
- UNKNOWN: 알 수 없음

### Notification Type
- INVITE_REQUEST: 초대 요청
- FOUND_REPORT: 발견 신고
- NEARBY_ALERT: 근처 알림

### Asset Type
- AGE_PROGRESSION: 성장/노화 이미지
- GENERATED_IMAGE: 인상착의 이미지

---

## Notes

1. 모든 날짜/시간은 ISO 8601 형식을 사용합니다
2. 페이징은 0부터 시작합니다
3. Bearer 토큰은 Authorization 헤더에 포함되어야 합니다
4. 전화번호는 11자리 숫자만 입력합니다 (하이픈 없음)
5. GPS 좌표는 WGS84 좌표계를 사용합니다
