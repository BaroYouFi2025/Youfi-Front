# Metro Bundler 콘솔 설명

## Metro Bundler란?

**Metro Bundler**는 React Native/Expo 앱의 JavaScript 코드를 번들링하고 실행하는 개발 서버입니다.

- **역할**: JavaScript 코드를 하나의 번들 파일로 묶어서 앱에 전달
- **실행**: `npm run start` 또는 `expo start` 명령어로 실행
- **포트**: 기본적으로 8081 포트 사용

## Metro Bundler 콘솔이란?

**Metro Bundler 콘솔**은 앱의 JavaScript 코드에서 출력하는 로그를 보여주는 터미널 창입니다.

### 출력되는 내용:

1. **JavaScript 코드의 `console.log()` 출력**
   ```javascript
   console.log('FCM Token:', token);
   // ↑ 이 코드가 실행되면 Metro 콘솔에 출력됩니다
   ```

2. **앱의 에러 메시지**
   - JavaScript 에러
   - 네트워크 에러
   - 기타 런타임 에러

3. **개발 서버 정보**
   - 번들링 상태
   - Hot Reload 정보
   - 연결 상태

### 출력되지 않는 내용:

- ❌ 운영체제 메시지
- ❌ 네이티브 코드 로그 (Android Logcat, iOS Console)
- ❌ 시스템 레벨 메시지

## 예시

### 앱 코드:
```javascript
// screens/Auth/login.tsx
const token = await messaging().getToken();
console.log('FCM Token:', token);
```

### Metro Bundler 콘솔 출력:
```
FCM Token: dKxYz123abc456def789...
```

## 운영체제 메시지와의 차이

### Metro Bundler 콘솔 (JavaScript 로그):
- 앱의 JavaScript 코드에서 출력
- `console.log()`, `console.error()` 등
- 개발 중 디버깅용

### 운영체제 메시지 (시스템 로그):
- Android: `adb logcat` (네이티브 로그)
- iOS: Xcode Console (네이티브 로그)
- 시스템 레벨 이벤트

## FCM 토큰 확인 방법

### Metro Bundler 콘솔에서:
```bash
# 터미널에서 실행 중인 Metro bundler의 출력 확인
# 또는 Cursor/IDE의 터미널 창 확인

FCM Token: dKxYz123abc456def789...
FCM 토큰 등록 완료
```

### Android Logcat에서 (네이티브 로그):
```bash
adb logcat | grep -i firebase
# Firebase SDK의 네이티브 로그 확인
```

## 요약

- **Metro Bundler 콘솔** = JavaScript 코드의 `console.log()` 출력
- **운영체제 메시지** = 시스템 레벨 로그 (별도 도구 필요)
- FCM 토큰은 Metro Bundler 콘솔에서 확인 가능 (JavaScript 로그)

