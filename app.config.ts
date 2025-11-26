import { ConfigPlugin, withAndroidManifest } from '@expo/config-plugins';
import type { ConfigContext, ExpoConfig } from 'expo/config';

const withAndroidNotificationManifest: ConfigPlugin = (config) => {
  return withAndroidManifest(config, (config) => {
    const mainApplication = config.modResults.manifest.application?.[0];
    if (mainApplication) {
      const metaData = mainApplication['meta-data'];
      if (metaData) {
        // Find the notification color meta-data
        const notificationColorMeta = metaData.find(
          (item: any) =>
            item.$['android:name'] ===
            'com.google.firebase.messaging.default_notification_color'
        );

        if (notificationColorMeta) {
          // Add tools:replace="android:resource"
          // @ts-ignore
          notificationColorMeta.$['tools:replace'] = 'android:resource';
        }
      }
    }
    return config;
  });
};

const defineConfig = ({ config }: ConfigContext): ExpoConfig => {
  const googleMapsApiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  return {
    ...config,
    name: 'YouFi',
    slug: 'YouFi',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/YouFi_Icon.png',
    scheme: 'youfi',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: {
      bundleIdentifier: 'baro.youfi',
      supportsTablet: true,
      infoPlist: {
        NSUserNotificationsUsageDescription:
          'YouFi는 실종자 발견 알림 및 중요한 정보를 전달하기 위해 알림 권한이 필요합니다.',
      },
      config: {
        googleMapsApiKey,
      },
    },
    android: {
      package: 'baro.youfi',
      googleServicesFile: './google-services.json',
      adaptiveIcon: {
        // Use the main app icon for Android adaptive icon as well
        backgroundColor: '#FFFFFF',
        foregroundImage: './assets/images/YouFi_Icon.png',
      },
      permissions: [
        'ACCESS_COARSE_LOCATION',
        'ACCESS_FINE_LOCATION',
        'ACCESS_BACKGROUND_LOCATION',
        'RECEIVE_BOOT_COMPLETED',
        'POST_NOTIFICATIONS',
        'VIBRATE',
        'WAKE_LOCK',
      ],
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      config: {
        googleMaps: {
          apiKey: googleMapsApiKey,
        },
      },
    },
    web: {
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      withAndroidNotificationManifest, // Register the custom plugin correctly
      'expo-router',
      [
        'expo-splash-screen',
        {
          image: './assets/images/YouFi_Icon.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#ffffff',
          dark: {
            backgroundColor: '#000000',
          },
        },
      ],
      'expo-web-browser',
      '@react-native-firebase/app',
      '@react-native-firebase/messaging',
      [
        'expo-notifications',
        {
          icon: './assets/images/YouFi_Icon.png',
          color: '#ffffff',
        },
      ],
      [
        'expo-location',
        {
          locationAlwaysAndWhenInUsePermission:
            'YouFi는 실종자 추적을 위해 위치 정보가 필요합니다.',
          locationAlwaysPermission:
            'YouFi는 실종자 추적을 위해 백그라운드에서도 위치 정보가 필요합니다.',
          locationWhenInUsePermission:
            'YouFi는 실종자 추적을 위해 위치 정보가 필요합니다.',
          isIosBackgroundLocationEnabled: true,
          isAndroidBackgroundLocationEnabled: true,
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    extra: {
      ...config.extra,
      googleMapsApiKey,
    },
  };
};

export default defineConfig;
