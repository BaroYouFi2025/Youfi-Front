import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { AppState } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useColorScheme } from '@/hooks/useColorScheme';
import { startBackgroundLocationTracking } from '@/services/locationService';
import { getAccessToken } from '@/utils/authStorage';
import { Alert, Linking, Platform } from 'react-native';

// Firebase는 네이티브 빌드에서만 사용 가능
let messaging: any = null;
try {
  messaging = require('@react-native-firebase/messaging').default;
} catch (e) {
  // Expo Go에서는 Firebase 사용 불가
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync().catch(() => null);
    }
  }, [fontsLoaded]);

  // 알림 권한 확인 및 요청, FCM 토큰 발급 (앱 진입 시 및 포그라운드 복귀 시)
  useEffect(() => {
    const requestNotificationPermissionAndGetToken = async () => {
      if (!messaging) {
        console.log('⏭️ 알림 권한 요청 건너뜀: Firebase 사용 불가');
        return;
      }

      try {
        // 현재 알림 권한 상태 확인
        const currentAuthStatus = await messaging().hasPermission();
        console.log('🔍 알림 권한 상태:', {
          status: currentAuthStatus,
          statusName: currentAuthStatus === messaging.AuthorizationStatus.NOT_DETERMINED ? 'NOT_DETERMINED' :
                     currentAuthStatus === messaging.AuthorizationStatus.DENIED ? 'DENIED' :
                     currentAuthStatus === messaging.AuthorizationStatus.AUTHORIZED ? 'AUTHORIZED' :
                     currentAuthStatus === messaging.AuthorizationStatus.PROVISIONAL ? 'PROVISIONAL' : 'UNKNOWN'
        });

        let authStatus = currentAuthStatus;

        // 권한이 아직 결정되지 않았으면 요청
        if (currentAuthStatus === messaging.AuthorizationStatus.NOT_DETERMINED) {
          console.log('📱 알림 권한 요청 팝업 표시');
          authStatus = await messaging().requestPermission();
          console.log('📱 알림 권한 요청 결과:', {
            status: authStatus,
            statusName: authStatus === messaging.AuthorizationStatus.AUTHORIZED ? 'AUTHORIZED' :
                       authStatus === messaging.AuthorizationStatus.PROVISIONAL ? 'PROVISIONAL' :
                       authStatus === messaging.AuthorizationStatus.DENIED ? 'DENIED' : 'UNKNOWN'
          });

          // 권한이 거부되면 설정으로 안내 (반드시 허용 필요)
          if (authStatus === messaging.AuthorizationStatus.DENIED) {
            Alert.alert(
              '알림 권한 필요',
              'YouFi 앱을 사용하려면 알림 권한이 반드시 필요합니다. 설정에서 알림 권한을 허용해주세요.',
              [
                {
                  text: '설정 열기',
                  onPress: async () => {
                    if (Platform.OS === 'ios') {
                      await Linking.openURL('app-settings:');
                    } else {
                      await Linking.openSettings();
                    }
                  },
                },
              ],
              { cancelable: false } // 취소 불가능
            );
            return;
          }
        } else if (currentAuthStatus === messaging.AuthorizationStatus.DENIED) {
          // 이미 거부된 경우: 설정으로 안내 (반드시 허용 필요)
          Alert.alert(
            '알림 권한 필요',
            'YouFi 앱을 사용하려면 알림 권한이 반드시 필요합니다. 설정에서 알림 권한을 허용해주세요.',
            [
              {
                text: '설정 열기',
                onPress: async () => {
                  if (Platform.OS === 'ios') {
                    await Linking.openURL('app-settings:');
                  } else {
                    await Linking.openSettings();
                  }
                },
              },
            ],
            { cancelable: false } // 취소 불가능
          );
          console.log('⏭️ 알림 권한이 거부되어 FCM 토큰 발급을 건너뜁니다.');
          return;
        }

        // 권한이 허용된 경우에만 FCM 토큰 발급
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
          try {
            const token = await messaging().getToken();
            console.log('🔑 FCM 토큰 발급 성공:', {
              hasToken: !!token,
              tokenLength: token?.length || 0,
            });
            // FCM 토큰은 발급만 하고, 기기 등록은 회원가입 시에만 수행
          } catch (error) {
            console.error('❌ FCM 토큰 발급 실패:', error);
          }
        } else {
          console.log('⏭️ 알림 권한이 허용되지 않아 FCM 토큰 발급을 건너뜁니다.');
        }
      } catch (error) {
        console.error('❌ 알림 권한 확인/요청 실패:', error);
      }
    };

    // 앱 진입 시 권한 확인
    requestNotificationPermissionAndGetToken();

    // 앱이 포그라운드로 돌아올 때마다 권한 확인 (권한이 없으면 계속 안내)
    const appStateSubscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        requestNotificationPermissionAndGetToken();
      }
    });

    return () => {
      appStateSubscription.remove();
    };
  }, []);

  // 백그라운드 GPS 위치 추적 시작 (로그인된 경우)
  useEffect(() => {
    const initializeLocationTracking = async () => {
      try {
        const accessToken = await getAccessToken();
        if (accessToken) {
          console.log('📍 백그라운드 GPS 위치 추적 초기화');
          const started = await startBackgroundLocationTracking();
          
          // GPS 추적 시작 실패 시 위치 권한 안내
          if (!started) {
            Alert.alert(
              '위치 권한 필요',
              'YouFi 앱은 실종자 추적을 위해 위치 권한이 반드시 필요합니다. 설정에서 위치 권한을 "항상 허용"으로 설정해주세요.',
              [
                {
                  text: '나중에',
                  style: 'cancel',
                },
                {
                  text: '설정 열기',
                  onPress: async () => {
                    if (Platform.OS === 'ios') {
                      await Linking.openURL('app-settings:');
                    } else {
                      await Linking.openSettings();
                    }
                  },
                },
              ]
            );
          }
        } else {
          console.log('⏭️ GPS 위치 추적 건너뜀: 로그인하지 않음');
        }
      } catch (error) {
        console.error('❌ GPS 위치 추적 초기화 실패:', error);
      }
    };

    initializeLocationTracking();
  }, []);

  // 푸시 알림 수신 처리 (기기 등록은 회원가입 시에만 수행)
  useEffect(() => {
    if (!messaging) {
      return;
    }

    // 앱이 포그라운드에 있을 때 푸시 알림 수신
    const unsubscribe = messaging().onMessage(async (remoteMessage: any) => {
      console.log('포그라운드 푸시 알림 수신:', remoteMessage);
    });

    // 앱이 종료된 상태에서 알림 클릭으로 앱 실행
    messaging()
      .getInitialNotification()
      .then((remoteMessage: any) => {
        if (remoteMessage) {
          console.log('알림 클릭으로 앱 실행:', remoteMessage);
        }
      });

    // 백그라운드에서 알림 클릭 시 처리
    const unsubscribeNotificationOpened = messaging().onNotificationOpenedApp((remoteMessage: any) => {
      console.log('백그라운드에서 알림 클릭:', remoteMessage);
    });

    return () => {
      unsubscribe();
      unsubscribeNotificationOpened();
    };
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="phone-verification" options={{ headerShown: false }} />
          <Stack.Screen name="signup" options={{ headerShown: false }} />
          <Stack.Screen name="gps-tracking" options={{ headerShown: false }} />
          <Stack.Screen name="missing-report" options={{ headerShown: false }} />
          <Stack.Screen name="person-found" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
