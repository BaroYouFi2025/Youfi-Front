import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { router } from 'expo-router';

// 알림 수신 시 동작 설정
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const pushNotificationService = {
  // 권한 상태 확인
  async getPermissionStatus() {
    const { status } = await Notifications.getPermissionsAsync();
    return status;
  },

  // 권한 요청
  async requestPermissions() {
    if (!Device.isDevice) {
      console.warn('Must use physical device for Push Notifications');
      return false;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return false;
    }

    // FCM 토큰 가져오기
    const token = await Notifications.getExpoPushTokenAsync();
    console.log('Expo Push Token:', token);
    
    // TODO: 서버에 토큰 전송

    return true;
  },

  // 알림 리스너 설정
  setupNotificationListeners() {
    // 포그라운드 알림 수신 처리
    Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });

    // 알림 클릭 처리
    Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification clicked:', response);
      
      const data = response.notification.request.content.data;
      
      // 타입에 따라 다른 페이지로 이동
      if (data?.type === 'found') {
        const name = data.missingPersonName || '';
        router.push({
          pathname: '/found-notification',
          params: { name }
        });
      }
    });
  },

  // 로컬 알림 발송
  async sendLocalNotification(title: string, body: string, data?: any) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: data || {},
      },
      trigger: null, // 즉시 발송
    });
  },
};

