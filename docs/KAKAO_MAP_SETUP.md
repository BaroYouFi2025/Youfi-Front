# 카카오 맵 API 설정 가이드

## 1. 카카오 개발자 계정 만들기

1. [Kakao Developers](https://developers.kakao.com/) 접속
2. 로그인 또는 회원가입
3. 우측 상단 "내 애플리케이션" 클릭

## 2. 애플리케이션 등록

1. "애플리케이션 추가하기" 클릭
2. 앱 이름 입력 (예: YouFi)
3. 회사명 입력 (선택사항)
4. 저장

## 3. JavaScript 키 발급

1. 생성된 애플리케이션 클릭
2. 좌측 메뉴에서 "앱 키" 클릭
3. **"JavaScript 키"** 복사 (주의: REST API 키가 아닙니다!)

## 4. 플랫폼 등록

1. 좌측 메뉴에서 "플랫폼" 클릭
2. "Web 플랫폼 등록" 클릭
3. 사이트 도메인 입력:
   - 개발 환경: `http://localhost`
   - 실제 환경: 실제 도메인 입력
4. 저장

## 5. 프로젝트 설정

### `.env` 파일 생성 및 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가합니다:

```bash
# Kakao Map API Key (JavaScript 키)
EXPO_PUBLIC_KAKAO_MAP_API_KEY=발급받은_JavaScript_키를_여기에_붙여넣기

# Backend API URL
EXPO_PUBLIC_API_URL=https://jjm.jojaemin.com

# Bypass Authentication (for development)
EXPO_PUBLIC_BYPASS_AUTH=false
```

### 예시

```bash
EXPO_PUBLIC_KAKAO_MAP_API_KEY=1234567890abcdef1234567890abcdef
EXPO_PUBLIC_API_URL=https://jjm.jojaemin.com
EXPO_PUBLIC_BYPASS_AUTH=false
```

## 6. 앱 재시작

환경 변수 변경 후 반드시 앱을 재시작해야 합니다:

```bash
# Metro 번들러 종료 후
npm run start --clear

# 또는
npm run android
npm run ios
```

## 주의사항

⚠️ **중요**: `.env` 파일은 절대 Git에 커밋하지 마세요!
- `.env` 파일은 `.gitignore`에 이미 추가되어 있습니다.
- JavaScript 키는 외부에 노출되어도 비교적 안전하지만, 그래도 주의하세요.
- 키가 유출된 경우 Kakao Developers에서 재발급받을 수 있습니다.

## 문제 해결

### 지도가 표시되지 않는 경우

1. **API 키 확인**
   - JavaScript 키가 맞는지 확인 (REST API 키가 아님)
   - `.env` 파일의 키가 올바른지 확인

2. **플랫폼 설정 확인**
   - Kakao Developers에서 플랫폼이 제대로 등록되었는지 확인

3. **앱 재시작**
   - 환경 변수 변경 후 앱을 완전히 재시작

4. **콘솔 확인**
   - 개발자 콘솔에서 에러 메시지 확인

### 지도는 보이지만 마커가 안 보이는 경우

- 위치 권한이 허용되었는지 확인
- 근처에 실종자가 있는지 확인
- 콘솔 로그 확인

## 추가 정보

- [카카오맵 JavaScript API 문서](https://apis.map.kakao.com/web/)
- [카카오 개발자 가이드](https://developers.kakao.com/docs)

