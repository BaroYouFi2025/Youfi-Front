# 카카오맵 설정 가이드

## 1. 카카오 개발자 계정 설정

### 앱 등록
1. [Kakao Developers](https://developers.kakao.com/) 접속
2. 내 애플리케이션 > 애플리케이션 추가하기
3. 앱 이름 입력 (예: YouFi)
4. 회사명 입력 후 저장

### API 키 발급
앱 생성 후 다음 키들을 확인:
- **JavaScript 키**: 웹 및 WebView에서 사용
- **네이티브 앱 키**: Android/iOS 네이티브 SDK용 (향후 필요시)

## 2. 플랫폼 설정

### 웹 플랫폼 등록 (필수!)
1. 앱 설정 > 플랫폼 > Web 플랫폼 등록
2. 사이트 도메인 추가 (모두 등록 권장):
   - `http://localhost:19006` (Expo Web 기본 포트)
   - `http://localhost:19000` (Expo Web 대체 포트)
   - `http://localhost:8081` (Metro Bundler)
   - 실제 배포 도메인 (프로덕션용)
3. **저장 버튼 클릭 필수!**

**주의**: 플랫폼 등록 없이는 지도가 로드되지 않습니다!

### Android 플랫폼 등록 (선택사항)
1. 앱 설정 > 플랫폼 > Android 플랫폼 등록
2. 패키지명: `com.youfi.app` (또는 실제 패키지명)
3. 키 해시 등록:
```bash
# 디버그 키 해시 생성
keytool -exportcert -alias androiddebugkey -keystore ~/.android/debug.keystore | openssl sha1 -binary | openssl base64
# 비밀번호: android
```

### iOS 플랫폼 등록 (선택사항)
1. 앱 설정 > 플랫폼 > iOS 플랫폼 등록
2. 번들 ID: `com.youfi.app` (또는 실제 번들 ID)

## 3. 환경 변수 설정

`.env` 파일에 JavaScript 키 추가:
```
EXPO_PUBLIC_KAKAO_MAP_API_KEY=your_actual_javascript_key_here
```

**중요**: 실제 키로 교체 필요!

## 4. 사용 예시

```typescript
import KakaoMap from '@/components/KakaoMap';

<KakaoMap
  latitude={37.5665}
  longitude={126.9780}
  zoom={3}
  markers={[
    { lat: 37.5665, lng: 126.9780, title: '서울' }
  ]}
/>
```

## 5. 테스트

```bash
npm run start
```

앱 실행 후 GPS 탭에서 지도가 정상적으로 표시되는지 확인

## 6. 문제 해결

### 지도가 표시되지 않는 경우 (가장 흔한 원인)
1. **플랫폼 미등록** (90% 원인)
   - 카카오 개발자 콘솔 > 앱 설정 > 플랫폼 확인
   - Web 플랫폼에 `http://localhost:19006` 등록 확인
   - 등록 후 **저장 버튼 클릭 필수**
   - 브라우저 새로고침 (Ctrl+R 또는 Cmd+R)

2. **API 키 문제**
   - `.env` 파일의 API 키 확인
   - JavaScript 키 (네이티브 앱 키 아님!)
   - 앱 재시작 (`npm run start` 다시 실행)

3. **개발 서버 포트 확인**
   - 터미널에서 Expo 개발 서버 URL 확인
   - 해당 URL을 카카오 플랫폼에 등록

### 로딩만 표시되는 경우
- API 키가 `your_kakao_javascript_key_here`인지 확인
- 네트워크 연결 확인
- 브라우저 콘솔에서 에러 메시지 확인

## 참고 자료
- [카카오맵 Web API 가이드](https://apis.map.kakao.com/web/)
- [카카오 개발자 문서](https://developers.kakao.com/docs/latest/ko/local/dev-guide)
