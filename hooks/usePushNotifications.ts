import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { pushNotificationService } from '../services/pushNotificationService';

export const usePushNotifications = () => {
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializePushNotifications();
  }, []);

  const initializePushNotifications = async () => {
    try {
      setIsLoading(true);
      
      // 먼저 현재 권한 상태 확인
      const currentStatus = await pushNotificationService.getPermissionStatus();
      console.log('Current permission status:', currentStatus);
      
      if (currentStatus === 'granted') {
        // 이미 권한이 허용된 경우
        setIsPermissionGranted(true);
        pushNotificationService.setupNotificationListeners();
        
        // FCM 토큰 가져오기 및 서버 업데이트
        await pushNotificationService.requestPermissions();
        console.log('Push notifications already granted, token updated');
      } else if (currentStatus === 'denied') {
        // 권한이 거부된 경우 - 다시 요청하지 않음
        setIsPermissionGranted(false);
        console.log('Push notifications denied by user');
      } else {
        // 권한이 아직 요청되지 않은 경우에만 요청
        const granted = await pushNotificationService.requestPermissions();
        setIsPermissionGranted(granted);
        
        if (granted) {
          pushNotificationService.setupNotificationListeners();
          console.log('Push notifications permission granted');
        } else {
          console.log('Push notifications permission denied');
        }
      }
    } catch (error) {
      console.error('Error initializing push notifications:', error);
      setIsPermissionGranted(false);
    } finally {
      setIsLoading(false);
    }
  };

  const requestPermission = async (): Promise<boolean> => {
    try {
      // 현재 상태 확인
      const currentStatus = await pushNotificationService.getPermissionStatus();
      
      if (currentStatus === 'granted') {
        setIsPermissionGranted(true);
        return true;
      } else if (currentStatus === 'denied') {
        Alert.alert(
          '알림 권한 필요',
          '알림을 받으려면 설정에서 알림 권한을 허용해주세요.',
          [
            { text: '취소', style: 'cancel' },
            { text: '설정으로 이동', onPress: () => {
              // 설정 앱으로 이동하는 로직 (필요시 구현)
            }}
          ]
        );
        return false;
      } else {
        // 권한 요청
        const granted = await pushNotificationService.requestPermissions();
        setIsPermissionGranted(granted);
        
        if (!granted) {
          Alert.alert('알림 권한', '알림 권한이 거부되었습니다.');
        }
        
        return granted;
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
      return false;
    }
  };

  const sendTestNotification = async () => {
    try {
      await pushNotificationService.sendLocalNotification(
        '테스트 알림',
        '푸시 알림이 정상적으로 작동합니다!',
        { test: true }
      );
    } catch (error) {
      console.error('Error sending test notification:', error);
    }
  };

  return {
    isPermissionGranted,
    isLoading,
    requestPermission,
    sendTestNotification,
  };
};