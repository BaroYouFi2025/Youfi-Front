import * as Notifications from 'expo-notifications';
import { Alert, Linking, Platform } from 'react-native';

/**
 * 푸시 알림 권한 상태 확인
 * @returns 권한 허용 여부
 */
export const checkNotificationPermissions = async (): Promise<boolean> => {
  try {
    const { status } = await Notifications.getPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('알림 권한 상태 확인 실패:', error);
    return false;
  }
};

/**
 * 푸시 알림 권한 요청
 * @param showAlertOnDenied 권한 거부 시 설정 안내 Alert 표시 여부
 * @returns 권한 허용 여부
 */
export const requestNotificationPermissions = async (
  showAlertOnDenied: boolean = true
): Promise<boolean> => {
  try {
    // 현재 권한 상태 확인
    const { status: existingStatus } = await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;

    // 권한이 아직 결정되지 않았으면 요청
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    // 권한이 거부된 경우
    if (finalStatus !== 'granted' && showAlertOnDenied) {
      Alert.alert(
        '알림 권한 필요',
        'YouFi 앱을 사용하려면 알림 권한이 반드시 필요합니다. 설정에서 알림 권한을 허용해주세요.',
        [
          {
            text: '취소',
            style: 'cancel',
          },
          {
            text: '설정 열기',
            onPress: () => openAppSettings(),
          },
        ]
      );
      return false;
    }

    return finalStatus === 'granted';
  } catch (error) {
    console.error('알림 권한 요청 실패:', error);
    Alert.alert('알림 권한 오류', '알림 권한을 요청하는 중 문제가 발생했습니다.');
    return false;
  }
};

/**
 * 앱 설정 화면 열기
 */
export const openAppSettings = async (): Promise<void> => {
  try {
    if (Platform.OS === 'ios') {
      await Linking.openURL('app-settings:');
    } else {
      await Linking.openSettings();
    }
  } catch (error) {
    console.error('설정 화면 열기 실패:', error);
    Alert.alert('오류', '설정 화면을 열 수 없습니다.');
  }
};

/**
 * Expo Push Token 발급
 * @returns Expo Push Token 또는 null
 */
export const getExpoPushToken = async (): Promise<string | null> => {
  try {
    const hasPermission = await checkNotificationPermissions();
    if (!hasPermission) {
      console.warn('알림 권한이 없어 Expo Push Token을 발급할 수 없습니다.');
      return null;
    }

    const token = await Notifications.getExpoPushTokenAsync();
    console.log('✅ Expo Push Token 발급 완료:', token.data);
    return token.data;
  } catch (error) {
    console.error('Expo Push Token 발급 실패:', error);
    return null;
  }
};

/**
 * 알림 채널 설정 (Android 전용)
 * Android에서 알림을 표시하려면 채널이 필요합니다.
 */
export const setupNotificationChannel = async (): Promise<void> => {
  if (Platform.OS === 'android') {
    try {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'YouFi 알림',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
        sound: 'default',
        enableVibrate: true,
        showBadge: true,
      });
      console.log('✅ Android 알림 채널 설정 완료');
    } catch (error) {
      console.error('Android 알림 채널 설정 실패:', error);
    }
  }
};

/**
 * 앱 시작 시 알림 초기화
 * - 권한 확인 및 요청
 * - Android 채널 설정
 * - Expo Push Token 발급
 */
export const initializeNotifications = async (): Promise<{
  hasPermission: boolean;
  expoPushToken: string | null;
}> => {
  try {
    // Android 알림 채널 설정
    await setupNotificationChannel();

    // 알림 권한 요청
    const hasPermission = await requestNotificationPermissions(true);

    // Expo Push Token 발급
    let expoPushToken: string | null = null;
    if (hasPermission) {
      expoPushToken = await getExpoPushToken();
    }

    return { hasPermission, expoPushToken };
  } catch (error) {
    console.error('알림 초기화 실패:', error);
    return { hasPermission: false, expoPushToken: null };
  }
};

/**
 * 포그라운드에서 알림 표시 방식 설정
 */
export const configureNotificationHandler = (): void => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
};

