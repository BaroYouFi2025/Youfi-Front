# 푸시 알림 권한 설정 가이드

YouFi 앱에서 푸시 알림 권한을 요청하고 관리하는 방법을 설명합니다.

## 개요

YouFi 앱은 실종자 발견 알림 및 중요한 정보를 사용자에게 전달하기 위해 푸시 알림 기능을 사용합니다.
앱은 두 가지 알림 시스템을 지원합니다:

1. **Firebase Cloud Messaging (FCM)**: 네이티브 빌드에서 사용
2. **Expo Notifications**: 개발 및 테스트 환경에서 사용

## 자동 권한 요청

앱이 시작될 때 자동으로 알림 권한을 요청합니다:

- `app/_layout.tsx`에서 앱 실행 시 Expo Notifications API를 통해 권한을 요청합니다.
- Firebase FCM을 사용하는 네이티브 빌드에서는 별도의 Firebase 권한 요청도 수행됩니다.

## 수동 권한 요청

특정 화면이나 기능에서 알림 권한을 요청하려면 `utils/notificationPermissions.ts`의 유틸리티 함수를 사용하세요.

### 기본 사용법

```typescript
import { requestNotificationPermissions, checkNotificationPermissions } from '@/utils/notificationPermissions';

// 권한 상태 확인
const hasPermission = await checkNotificationPermissions();

// 권한 요청 (거부 시 설정 안내 Alert 표시)
const granted = await requestNotificationPermissions(true);

// 권한 요청 (거부 시 Alert 표시 안 함)
const granted = await requestNotificationPermissions(false);
```

### 전체 초기화

앱의 특정 시점에서 알림 시스템을 완전히 초기화하려면:

```typescript
import { initializeNotifications } from '@/utils/notificationPermissions';

const { hasPermission, expoPushToken } = await initializeNotifications();

if (hasPermission) {
  console.log('알림 권한이 허용되었습니다.');
  console.log('Expo Push Token:', expoPushToken);
  
  // TODO: 서버에 expoPushToken 등록
}
```

### 설정 화면 열기

사용자가 권한을 거부한 경우, 앱 설정 화면으로 안내할 수 있습니다:

```typescript
import { openAppSettings } from '@/utils/notificationPermissions';

await openAppSettings();
```

## 유틸리티 함수 목록

### `checkNotificationPermissions()`
- **설명**: 현재 알림 권한 상태를 확인합니다.
- **반환값**: `Promise<boolean>` - 권한이 허용되었으면 `true`, 그렇지 않으면 `false`

### `requestNotificationPermissions(showAlertOnDenied?: boolean)`
- **설명**: 알림 권한을 요청합니다.
- **매개변수**:
  - `showAlertOnDenied` (선택, 기본값: `true`): 권한 거부 시 설정 안내 Alert 표시 여부
- **반환값**: `Promise<boolean>` - 권한이 허용되었으면 `true`, 그렇지 않으면 `false`

### `openAppSettings()`
- **설명**: 기기의 앱 설정 화면을 엽니다.
- **반환값**: `Promise<void>`

### `getExpoPushToken()`
- **설명**: Expo Push Token을 발급받습니다.
- **반환값**: `Promise<string | null>` - 토큰 문자열 또는 `null`

### `setupNotificationChannel()`
- **설명**: Android 알림 채널을 설정합니다. (Android 전용)
- **반환값**: `Promise<void>`

### `initializeNotifications()`
- **설명**: 알림 시스템을 초기화합니다. (권한 요청, 채널 설정, 토큰 발급)
- **반환값**: `Promise<{ hasPermission: boolean; expoPushToken: string | null }>`

### `configureNotificationHandler()`
- **설명**: 포그라운드에서 알림 표시 방식을 설정합니다.
- **반환값**: `void`

## 설정 파일

### `app.config.ts`

알림 관련 설정이 `app.config.ts`에 추가되어 있습니다:

```typescript
// iOS 권한 메시지
ios: {
  infoPlist: {
    NSUserNotificationsUsageDescription: 'YouFi는 실종자 발견 알림 및 중요한 정보를 전달하기 위해 알림 권한이 필요합니다.',
  },
}

// Android 권한
android: {
  permissions: [
    'POST_NOTIFICATIONS',
    'VIBRATE',
    'WAKE_LOCK',
    // ...기타 권한
  ],
}

// Expo Notifications 플러그인
plugins: [
  [
    'expo-notifications',
    {
      icon: './assets/images/YouFi_Icon.png',
      color: '#ffffff',
      sounds: ['default'],
      mode: 'production',
    },
  ],
  // ...기타 플러그인
]
```

## 테스트

### 개발 환경에서 테스트

1. **Expo Go**: Expo Notifications API가 작동합니다.
   ```bash
   npm run start
   ```

2. **네이티브 빌드**: Firebase FCM과 Expo Notifications 모두 작동합니다.
   ```bash
   npm run ios  # iOS
   npm run android  # Android
   ```

### 권한 초기화

테스트 중 권한을 다시 요청하려면:

1. **iOS**: 
   - 설정 > 일반 > 앱 재설정 > 위치 및 개인정보 보호 재설정
   - 또는 앱 삭제 후 재설치

2. **Android**:
   - 설정 > 앱 > YouFi > 권한 > 알림 권한 초기화
   - 또는 앱 삭제 후 재설치

## 주의사항

1. **iOS**: `NSUserNotificationsUsageDescription`이 `Info.plist`에 포함되어야 합니다. (자동으로 설정됨)
2. **Android**: API 33 (Android 13) 이상에서는 `POST_NOTIFICATIONS` 권한이 필수입니다.
3. **Firebase**: 네이티브 빌드에서만 작동하며, Expo Go에서는 Firebase를 사용할 수 없습니다.
4. **Expo Notifications**: 개발 및 테스트 환경에서 사용하며, 프로덕션에서는 Firebase를 주로 사용합니다.

## 문제 해결

### 권한이 요청되지 않음
- `app.config.ts`의 플러그인 설정 확인
- 앱을 완전히 재시작 (`expo prebuild` 후 재빌드)

### Android에서 알림이 표시되지 않음
- 알림 채널이 설정되었는지 확인
- `POST_NOTIFICATIONS` 권한이 `AndroidManifest.xml`에 포함되었는지 확인

### iOS에서 권한 요청 팝업이 표시되지 않음
- `Info.plist`에 `NSUserNotificationsUsageDescription` 추가 확인
- 기기 설정에서 앱 권한 초기화 후 재시도

## 추가 리소스

- [Expo Notifications 문서](https://docs.expo.dev/versions/latest/sdk/notifications/)
- [Firebase Cloud Messaging 문서](https://firebase.google.com/docs/cloud-messaging)
- [React Native Firebase 문서](https://rnfirebase.io/)

