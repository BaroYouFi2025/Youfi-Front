import type { ConfigContext, ExpoConfig } from 'expo/config';

const defineConfig = ({ config }: ConfigContext): ExpoConfig => ({
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
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      backgroundColor: '#E6F4FE',
      foregroundImage: './assets/images/adaptive-icon.png',
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
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
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    ...config.extra,
    bypassAuth: process.env.EXPO_PUBLIC_BYPASS_AUTH ?? 'false',
    apiUrl: process.env.EXPO_PUBLIC_API_URL ?? 'https://api.youfi.com',
  },
});

export default defineConfig;

