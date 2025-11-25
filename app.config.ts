import type { ConfigContext, ExpoConfig } from 'expo/config';

const defineConfig = ({ config }: ConfigContext): ExpoConfig => {
  const googleMapsApiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  return {
  ...config,
  name: 'YouFi',
  slug: 'YouFi',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'youfi',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  ios: {
    bundleIdentifier: 'baro.youfi',
    supportsTablet: true,
    config: {
      googleMapsApiKey,
    },
  },
  android: {
    package: 'baro.youfi',
    googleServicesFile: './google-services.json',
    adaptiveIcon: {
      backgroundColor: '#E6F4FE',
      foregroundImage: './assets/images/adaptive-icon.png',
    },
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
    'expo-router',
    [
      'expo-splash-screen',
      {
        image: './assets/images/splash-icon.png',
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
      'expo-location',
      {
        locationAlwaysAndWhenInUsePermission: 'YouFi는 실종자 추적을 위해 위치 정보가 필요합니다.',
        locationAlwaysPermission: 'YouFi는 실종자 추적을 위해 백그라운드에서도 위치 정보가 필요합니다.',
        locationWhenInUsePermission: 'YouFi는 실종자 추적을 위해 위치 정보가 필요합니다.',
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
