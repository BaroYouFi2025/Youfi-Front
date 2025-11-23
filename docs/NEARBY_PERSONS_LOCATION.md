# 근처 실종자 위치 정보 구현

## 문제
- `/missing-persons/nearby` API는 위치 정보(`latitude`, `longitude`)를 반환하지 않음
- 지도에 마커를 표시하려면 각 실종자의 정확한 위치가 필요함

## 해결 방법
두 단계 API 호출을 통해 위치 정보를 가져옵니다:

### 1단계: 근처 실종자 목록 조회
```
GET /missing-persons/nearby?latitude={lat}&longitude={lng}&radius={radius}
```
→ 실종자 ID 목록 반환

### 2단계: 각 실종자의 상세 정보 조회
```
GET /missing-persons/{id}
```
→ 위치 정보 포함된 상세 정보 반환

## 구현 내용

### 1️⃣ 새로운 API 함수 추가 (`services/missingPersonAPI.ts`)

```typescript
// 실종자 상세 조회
export const getMissingPersonDetail = async (id: number): Promise<MissingPersonDetail>
```

### 2️⃣ 근처 실종자 조회 로직 수정

기존:
```typescript
const response = await getNearbyMissingPersons(latitude, longitude, radius);
// response.content에는 위치 정보 없음
```

수정 후:
```typescript
const response = await getNearbyMissingPersons(latitude, longitude, radius);
// 내부적으로 각 실종자의 상세 정보를 조회하여 위치 정보 추가
// response.content에 latitude, longitude 포함됨
```

### 3️⃣ 타입 추가 (`types/MissingPersonTypes.ts`)

```typescript
export interface MissingPersonDetail {
  missingPersonId: number;
  name: string;
  birthDate: string;
  address: string;
  missingDate: string;
  height: number;
  weight: number;
  body: string;
  bodyEtc: string;
  clothesTop: string;
  clothesBottom: string;
  clothesEtc: string;
  latitude: number;        // ✅ 위치 정보
  longitude: number;       // ✅ 위치 정보
  photoUrl?: string;
}
```

## 데이터 흐름

```
📱 홈 화면
  ↓
  ① getNearbyMissingPersons() 호출
  ↓
🌐 API: /missing-persons/nearby
  ↓
  ② 각 실종자 ID로 getMissingPersonDetail() 호출
  ↓
🌐 API: /missing-persons/{id} (병렬 호출)
  ↓
  ③ 위치 정보 매핑
  ↓
📊 NearbyMissingPerson[] (위치 포함)
  ↓
🗺️ KakaoMap 컴포넌트
  ↓
✅ 지도에 마커 표시
```

## 필드 매핑

API 응답 → NearbyMissingPerson 타입

| API 필드 (상세 조회) | 타입 필드 | 설명 |
|---------------------|----------|------|
| `birthDate` | `birth_date` | 생년월일 |
| `missingDate` | `missing_date` | 실종일 |
| `body` | `body_type` | 체형 |
| `bodyEtc` | `physical_features` | 신체 특징 |
| `clothesTop` | `top_clothing` | 상의 |
| `clothesBottom` | `bottom_clothing` | 하의 |
| `clothesEtc` | `other_features` | 기타 특징 |
| `photoUrl` | `photo_url` | 사진 URL |
| `latitude` | `latitude` | 위도 ✅ |
| `longitude` | `longitude` | 경도 ✅ |

## 로그 확인

### 정상 작동 시

```
🗺️ ========== 근처 실종자 조회 시작 ==========
🗺️ 조회 시점: 2025-11-23T...
🗺️ 위치 정보: { latitude: 37.5665, longitude: 126.978, radius: 1000 }

🗺️ ========== 근처 실종자 조회 성공 ==========
🗺️ 총 실종자 수: 2

🗺️ ========== 실종자 상세 정보 조회 시작 ==========
🔍 실종자 상세 조회 시작: { id: 1 }
✅ 실종자 상세 조회 성공: { id: 1, name: '김실종', latitude: 35.188884, longitude: 128.90348 }
🔍 실종자 상세 조회 시작: { id: 2 }
✅ 실종자 상세 조회 성공: { id: 2, name: '이실종', latitude: 35.189123, longitude: 128.90456 }

🗺️ ========== 실종자 위치 정보 확인 ==========
🗺️ [1] ID: 1
🗺️ [1] 이름: 김실종
🗺️ [1] 위도(latitude): 35.188884 number
🗺️ [1] 경도(longitude): 128.90348 number
🗺️ [2] ID: 2
🗺️ [2] 이름: 이실종
🗺️ [2] 위도(latitude): 35.189123 number
🗺️ [2] 경도(longitude): 128.90456 number

🗺️ ========== 근처 실종자 조회 완료 ==========
```

### 에러 발생 시

```
❌ 실종자 1 상세 조회 실패: [에러 메시지]
```
→ 해당 실종자는 위치 정보 없이 목록에 포함됨

## 성능 고려사항

### 장점
✅ 정확한 위치 정보 확보
✅ 모든 상세 정보 함께 로드

### 단점
⚠️ API 호출 횟수 증가 (실종자 수 + 1)
⚠️ 로딩 시간 증가

### 최적화
- `Promise.all()`로 병렬 호출 (이미 구현됨)
- 최대 2명만 표시 (홈 화면 제한)
- 상세 조회 실패 시에도 기본 정보는 표시

## 테스트 방법

1. **앱 재시작**
```bash
npm run start --clear
```

2. **홈 화면으로 이동**

3. **콘솔 확인**
- `🔍 실종자 상세 조회` 로그 확인
- `latitude`, `longitude` 값 확인

4. **지도 확인**
- 빨간색 라벨 마커가 표시되는지 확인
- 마커 위치가 정확한지 확인

## 문제 해결

### 문제: 상세 조회 API 호출이 안 됨
**확인**: 콘솔에서 `🔍 실종자 상세 조회 시작` 로그가 있는지

**해결**:
- Authorization 토큰 확인
- API 엔드포인트 확인
- 네트워크 연결 확인

### 문제: 위치 정보가 여전히 없음
**확인**: 콘솔에서 `latitude: null` 또는 `undefined`인지

**해결**:
- 백엔드 API 응답 구조 확인
- 필드명 확인 (`latitude` vs `lat`)

### 문제: 로딩이 너무 느림
**확인**: 실종자 수가 많은지

**최적화**:
- 홈 화면에서는 최대 2명만 조회 (이미 구현됨)
- 필요 시 캐싱 추가

