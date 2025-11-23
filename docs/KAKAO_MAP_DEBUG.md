# 카카오 맵 디버깅 가이드

## 문제: 카카오 맵이 표시되지 않음

### 1단계: 콘솔 로그 확인

앱을 실행하고 홈 화면으로 이동했을 때 다음 로그들이 표시되는지 확인하세요:

```
🗺️ KakaoMap 렌더링: {...}
🗺️ Kakao Maps 초기화 시작
✅ 지도 생성 완료
✅ Kakao Maps 초기화 완료
🗺️ WebView 로드 완료
🗺️ WebView 성공: Map loaded successfully
```

### 2단계: 에러 확인

만약 다음과 같은 에러가 나타나면:

#### ❌ "Kakao Maps SDK가 로드되지 않았습니다"
**원인**: Kakao Maps JavaScript SDK 로드 실패

**해결책**:
1. 인터넷 연결 확인
2. API 키 확인 (올바른 JavaScript 키인지)
3. 카카오 개발자 사이트에서 플랫폼 설정 확인

#### ❌ "Map container를 찾을 수 없습니다"
**원인**: HTML 구조 문제

**해결책**:
1. 앱 재시작
2. WebView 권한 확인

#### ❌ Network Error
**원인**: 인터넷 연결 또는 CORS 문제

**해결책**:
1. 인터넷 연결 확인
2. 안드로이드의 경우 `usesCleartextTraffic: true` 설정 확인 (app.json)

### 3단계: API 키 확인

```bash
# 터미널에서 실행
cd /Users/anjunhwan/Desktop/baro-app/Youfi-Front
cat .env | grep KAKAO_MAP
```

출력 예시:
```
EXPO_PUBLIC_KAKAO_MAP_API_KEY=3a99e7670443a2236a92ef2574d857f4
```

### 4단계: WebView 권한 확인 (Android)

`app.json`에 다음 권한이 있는지 확인:

```json
{
  "android": {
    "permissions": [
      "INTERNET",
      "ACCESS_NETWORK_STATE"
    ],
    "usesCleartextTraffic": true
  }
}
```

### 5단계: 캐시 클리어 후 재시작

```bash
# Metro 번들러 캐시 클리어
npm run start --clear

# 또는 Android 재빌드
npm run android
```

### 6단계: 간단한 테스트

홈 화면에 접근했을 때:

1. **로딩 인디케이터**가 보이는지 확인
2. **로딩 후 지도**가 나타나는지 확인
3. **내 위치** (파란색 점)가 표시되는지 확인
4. **근처 실종자** (빨간색 라벨)가 표시되는지 확인

### 7단계: 수동 테스트

다음 코드를 홈 화면에 임시로 추가해서 테스트:

```typescript
// screens/Home/home.tsx
useEffect(() => {
  console.log('🗺️ 테스트: KakaoMap에 전달되는 데이터:', {
    currentLocation,
    nearbyPersons,
  });
}, [currentLocation, nearbyPersons]);
```

### 일반적인 문제들

| 증상 | 원인 | 해결책 |
|------|------|--------|
| 흰 화면만 보임 | API 키 오류 | API 키 재확인 |
| 로딩만 계속됨 | 네트워크 에러 | 인터넷 연결 확인 |
| 지도는 보이지만 마커 없음 | 위치/데이터 없음 | 위치 권한 및 데이터 확인 |
| 에러 메시지 표시 | WebView 에러 | 콘솔 로그 확인 |

### 추가 디버깅

React Native Debugger나 Chrome DevTools에서:

```javascript
// 현재 API 키 확인
console.log('API Key:', process.env.EXPO_PUBLIC_KAKAO_MAP_API_KEY);

// 현재 위치 확인
import('@/utils/authStorage').then(async () => {
  const { checkAuthStatus } = await import('@/utils/checkAuth');
  await checkAuthStatus();
});
```

### 도움이 필요한 경우

콘솔 로그 전체를 복사해서 공유해주세요:
- 🗺️로 시작하는 모든 로그
- ❌로 시작하는 모든 에러
- WebView 관련 메시지

