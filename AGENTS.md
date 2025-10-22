# Repository Guidelines

## 프로젝트 구조 및 모듈 구성
- `app/`: Expo Router 화면과 `app/(tabs)` 하위 탭을 보관합니다. 새 라우트는 페이지 전용 스타일·훅과 함께 동일 경로에 배치하세요.
- `components/`, `screens/`: 재사용 가능한 UI와 페이지 레이아웃이 위치합니다. 모든 컴포넌트는 타입 정의된 `.tsx` 함수 컴포넌트로 작성합니다.
- `services/`, `utils/`, `constants/`: 공용 비즈니스 로직, API 어댑터, 상수 구성을 모아둡니다. 순환 의존성을 피하기 위해 named export를 사용하세요.
- `assets/`: Expo에 번들되는 이미지·폰트가 있습니다. 새 폰트는 `app.json`에 등록하고 `hooks/`에서 사전 로드하세요.

## 빌드, 테스트, 개발 커맨드
- `npm install`: `package.json` 변경 후 의존성을 갱신합니다.
- `npm run start`: Expo 개발 서버를 실행합니다. QR 빌드가 Android·iOS·web에서 동작하는지 확인하세요.
- `npm run ios` / `npm run android` / `npm run web`: 각 플랫폼 미리보기를 실행하여 플랫폼 별 수정 사항을 검증합니다.
- `npm run lint`: `eslint-config-expo` 기반 린트를 수행해 포맷팅과 타입 문제를 차단합니다.
- `npm run reset-project`: Metro/Expo 캐시 이슈가 발생할 때 `scripts/reset-project.js`로 상태를 초기화합니다.

## 코딩 스타일 및 네이밍 규칙
- 전역적으로 TypeScript를 사용하며 컴포넌트 파일은 `PascalCase.tsx`, 훅은 `use*.ts`, 유틸은 `camelCase.ts`로 작성합니다.
- 들여쓰기는 스페이스 2칸을 유지하고 문자열은 기본적으로 작은따옴표를 사용합니다.
- 함수형 컴포넌트와 React 훅, `styled-components`를 기본 스타일링 패턴으로 삼고 styled 블록은 파일 하단에 배치합니다.
- 푸시 전 `npm run lint`를 실행하고 자동 수정 가능 항목을 반영하며 불가피한 룰 예외는 해당 줄에 주석으로 남깁니다.

## 테스트 가이드라인
- 현재 자동화 테스트 도구는 없습니다. `npm run start`로 서버를 실행한 뒤 기기·시뮬레이터에서 주요 플로우를 검증하세요.
- 테스트를 추가한다면 `__tests__/` 내 Jest 기본 패턴(`*.test.ts[x]`)을 따르고 비동기 의존성은 목 처리합니다.
- 인증, 위치 추적, 신고 등 핵심 플로우 수정 시 PR 본문에 수동 QA 절차와 결과를 기록하세요.

## 커밋 및 Pull Request 가이드라인
- Conventional Commits(`feat:`, `fix:`, `chore:` 등)를 따라 스코프와 간결한 변경 요약을 남깁니다.
- 커밋은 단일 책임을 유지하고 번역·설정 변경은 가능하면 별도 커밋으로 분리합니다.
- PR에는 변경 요약, 연관 Linear/GitHub 이슈, UI 변경 시 스크린샷 또는 영상, 테스트 결과를 포함합니다.
- 머지 전 리뷰를 요청하고 CI 또는 수동 검증 완료 후 승인되면 스쿼시 머지를 진행하세요.
