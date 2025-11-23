# Authorization (인증) 구조

## 📋 개요

YouFi 앱은 JWT(JSON Web Token) 기반 인증을 사용합니다.

## 🔑 토큰 종류

### 1. Access Token
- **용도**: API 요청 시 인증 헤더로 사용
- **저장 위치**: Expo Secure Store (`accessToken`)
- **형식**: `Bearer {access_token}`
- **사용 예시**:
  ```typescript
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  }
  ```

### 2. Refresh Token
- **용도**: Access Token 만료 시 갱신
- **저장 위치**: Expo Secure Store (`refreshToken`)
- **API 엔드포인트**: `POST /auth/refresh`

### 3. Device UUID
- **용도**: 기기 식별
- **저장 위치**: Expo Secure Store (`deviceUuid`)
- **생성**: 자동 생성 또는 기존 값 사용

### 4. FCM Token
- **용도**: 푸시 알림
- **저장 위치**: Expo Secure Store (`fcmToken`)

## 🛠️ 구현 위치

### 저장/조회 함수
```typescript
// utils/authStorage.ts
- getAccessToken()
- setAccessToken(token)
- deleteAccessToken()
- getRefreshToken()
- setRefreshToken(token)
- deleteRefreshToken()
- clearStoredTokens()
```

### API 클라이언트

#### 1. Notification API (`services/notificationAPI.ts`)
```typescript
const getAuthHeaders = async () => {
  const accessToken = await getAccessToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': accessToken ? `Bearer ${accessToken}` : undefined
  };
};
```

#### 2. Device API (`services/deviceAPI.ts`)
```typescript
const headers = {
  'Content-Type': 'application/json',
  'Authorization': accessToken ? `Bearer ${accessToken}` : undefined
};
```

#### 3. Auth API (`services/authAPI.ts`)
- 로그인/회원가입 시 토큰 발급
- Refresh Token으로 갱신

## 📱 인증 흐름

### 로그인
```
1. 사용자 로그인 (POST /auth/login)
   └─> { accessToken, refreshToken, expiresIn }
2. 토큰 저장 (Secure Store)
3. 기기 등록 (POST /devices/register)
```

### API 요청
```
1. API 호출 전 getAccessToken()
2. Authorization 헤더에 Bearer 토큰 추가
3. 요청 전송
4. 401 에러 시 Refresh Token으로 갱신
```

### 로그아웃
```
1. 로그아웃 API 호출 (POST /auth/logout)
2. clearStoredTokens() 호출
3. 로그인 화면으로 이동
```

## 🔍 인증 상태 확인 방법

### 1. 콘솔에서 확인
```typescript
import { checkAuthStatus, validateAuthStatus } from '@/utils/checkAuth';

// 간단한 확인
await checkAuthStatus();

// 상세 검증
await validateAuthStatus();
```

### 2. React Native Debugger에서
```javascript
// Chrome DevTools 콘솔에서 실행
import('@/utils/checkAuth').then(({ checkAuthStatus }) => checkAuthStatus());
```

### 3. 출력 예시
```
🔐 ========== 인증 상태 확인 ==========
✅ Access Token: eyJhbGciOiJIUzI1...
✅ Refresh Token: eyJhbGciOiJIUzI1...
🔑 Device UUID: 1234abcd-5678-efgh-9012-ijklmnop3456
📲 FCM Token: dXYz12345abcdefgh...
🎯 인증 상태: ✅ 로그인됨
🔐 =====================================
```

## 🚨 현재 인증 상태 확인하기

홈 화면(`screens/Home/home.tsx`)에 다음 코드를 추가하면 앱 시작 시 자동으로 인증 상태를 확인할 수 있습니다:

```typescript
import { checkAuthStatus } from '@/utils/checkAuth';

useEffect(() => {
  checkAuthStatus();
}, []);
```

## 📝 API 요청 시 Authorization 사용 예시

### Notification API
```typescript
// services/notificationAPI.ts
export const getMyNotifications = async () => {
  const headers = await getAuthHeaders(); // Authorization 헤더 자동 포함
  const response = await notificationClient.get('/notifications/me', { headers });
  return response.data;
};
```

### Missing Person API
```typescript
// services/missingPersonAPI.ts
export const getNearbyMissingPersons = async (
  latitude: number,
  longitude: number,
  radius: number
) => {
  const headers = await getAuthHeaders();
  const response = await client.get('/missing-persons/nearby', {
    headers,
    params: { latitude, longitude, radius }
  });
  return response.data;
};
```

## 🔐 보안 주의사항

### ✅ 올바른 사용
- Expo Secure Store 사용 (암호화됨)
- Bearer 토큰 형식 사용
- 토큰 만료 시 자동 갱신

### ❌ 피해야 할 것
- AsyncStorage에 토큰 저장 (암호화되지 않음)
- 토큰을 로그에 전체 출력
- 토큰을 URL 파라미터에 포함

## 🐛 문제 해결

### 401 Unauthorized 에러
```typescript
// 토큰 확인
const status = await checkAuthStatus();
if (!status.isAuthenticated) {
  // 다시 로그인 필요
  router.replace('/login');
}
```

### 토큰이 없는 경우
```typescript
// 토큰 삭제 후 재로그인
await clearStoredTokens();
router.replace('/login');
```

### 토큰 갱신 실패
```typescript
// Refresh Token으로 갱신
const refreshToken = await getRefreshToken();
const response = await refresh(refreshToken);
await setAccessToken(response.accessToken);
```

## 📊 현재 구현된 인증 API

| API | 엔드포인트 | 인증 필요 |
|-----|----------|---------|
| 로그인 | `POST /auth/login` | ❌ |
| 회원가입 | `POST /auth/signup` | ❌ |
| 로그아웃 | `POST /auth/logout` | ✅ |
| 토큰 갱신 | `POST /auth/refresh` | ✅ (Refresh Token) |
| 알림 조회 | `GET /notifications/me` | ✅ |
| 알림 읽음 처리 | `PUT /notifications/{id}/read` | ✅ |
| 초대 수락 | `POST /notifications/{id}/accept` | ✅ |
| 초대 거절 | `POST /notifications/{id}/reject` | ✅ |
| 근처 실종자 | `GET /missing-persons/nearby` | ✅ |
| 발견 신고 상세 | `GET /notifications/{id}/sighting` | ✅ |
| 기기 등록 | `POST /devices/register` | ✅ |
| GPS 업데이트 | `POST /devices/{deviceUuid}/gps` | ✅ |

## 🔧 개발자 팁

### 로컬에서 토큰 확인
```bash
# React Native Debugger 켜기
# Chrome DevTools 열기
# Console에서 실행:

import('@/utils/authStorage')
  .then(({ getAccessToken }) => getAccessToken())
  .then(token => console.log('Access Token:', token));
```

### 토큰 수동 설정 (테스트용)
```typescript
import { setAccessToken } from '@/utils/authStorage';

// 테스트 토큰 설정
await setAccessToken('your_test_token_here');
```

