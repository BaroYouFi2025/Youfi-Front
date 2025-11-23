# FCM 푸시 알림 테스트 가이드

## 방법 1: Firebase Console에서 테스트 (가장 간단)

1. Firebase Console 접속: https://console.firebase.google.com/
2. 프로젝트 선택: `baro-youfi`
3. Cloud Messaging → "Send test message" 클릭
4. FCM 토큰 입력 (앱에서 로그인 후 콘솔에서 확인)
5. 제목과 내용 입력 후 전송

## 방법 2: Postman으로 FCM REST API 직접 호출

### 필요한 정보:
- **FCM 서버 키**: Firebase Console → 프로젝트 설정 → Cloud Messaging → 서버 키
- **FCM 토큰**: 앱에서 로그인 후 등록된 디바이스 토큰

### Postman 설정:

**URL:**
```
POST https://fcm.googleapis.com/fcm/send
```

**Headers:**
```
Authorization: key=YOUR_SERVER_KEY
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "to": "DEVICE_FCM_TOKEN",
  "notification": {
    "title": "테스트 알림",
    "body": "이것은 테스트 알림입니다"
  },
  "data": {
    "type": "TEST",
    "message": "테스트 데이터"
  }
}
```

### 주의사항:
- ⚠️ **서버 키는 절대 클라이언트 코드에 포함하면 안 됩니다!**
- 서버 키는 백엔드 서버에서만 사용해야 합니다
- 테스트 목적으로만 Postman 사용을 권장합니다

## 방법 3: 백엔드 API를 통한 알림 전송 (권장)

백엔드 서버가 알림을 생성하면 자동으로 FCM을 통해 전송됩니다.

### 백엔드 API 호출 예시:
```bash
POST https://jjm.jojaemin.com/notifications/send
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "userId": 123,
  "type": "FOUND_REPORT",
  "title": "발견 신고",
  "message": "실종자가 발견되었습니다"
}
```

## FCM 토큰 확인 방법

앱에서 로그인 후:
1. Metro bundler 콘솔에서 "FCM Token: ..." 로그 확인
2. 또는 앱의 홈 화면에서 "FCM 기기 등록하기" 버튼 클릭 후 콘솔 확인

## 테스트 시나리오

1. **앱 실행 및 로그인**
   - 알림 권한 허용
   - FCM 토큰 등록 확인

2. **알림 전송**
   - Firebase Console 또는 Postman으로 알림 전송
   - 또는 백엔드에서 알림 생성

3. **알림 수신 확인**
   - 포그라운드: 앱 내에서 알림 수신
   - 백그라운드: 시스템 알림 표시
   - 종료 상태: 시스템 알림 표시

4. **알림 클릭 시 동작**
   - 앱 실행 또는 포그라운드로 전환
   - 홈 화면 알림 목록 자동 새로고침

