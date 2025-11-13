import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useColorScheme } from '@/hooks/useColorScheme';
import { getRefreshToken } from '@/utils/authStorage';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const bypassAuth = process.env.EXPO_PUBLIC_BYPASS_AUTH === 'true';
  const [hasRefreshToken, setHasRefreshToken] = useState<boolean | undefined>(undefined);
  const [isTokenChecked, setIsTokenChecked] = useState(false);
  const splashPreventedRef = useRef(false);

  useEffect(() => {
    if (!splashPreventedRef.current) {
      SplashScreen.preventAutoHideAsync().catch(() => null);
      splashPreventedRef.current = true;
    }
  }, []);

  useEffect(() => {
    if (bypassAuth) {
      setHasRefreshToken(true);
      setIsTokenChecked(true);
      return;
    }

    const checkRefreshToken = async () => {
      try {
        const token = await getRefreshToken();
        setHasRefreshToken(Boolean(token));
      } finally {
        setIsTokenChecked(true);
      }
    };

    checkRefreshToken();
  }, [bypassAuth]);

  useEffect(() => {
    if (fontsLoaded && isTokenChecked) {
      SplashScreen.hideAsync().catch(() => null);
    }
  }, [fontsLoaded, isTokenChecked]);

  if (!fontsLoaded || !isTokenChecked || typeof hasRefreshToken === 'undefined') {
    // Async font loading only occurs in development.
    return null;
  }

  const initialRouteName = hasRefreshToken ? '(tabs)' : 'login';

  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack initialRouteName={initialRouteName}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="phone-verification" options={{ headerShown: false }} />
          <Stack.Screen name="signup" options={{ headerShown: false }} />
          <Stack.Screen name="gps-tracking" options={{ headerShown: false }} />
          <Stack.Screen name="missing-report" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
