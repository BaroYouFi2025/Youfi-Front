import { refreshTokens } from '@/services/authAPI';
import { clearStoredTokens, getRefreshToken, setAccessToken, setRefreshToken } from '@/utils/authStorage';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';

export default function Index() {
  const [hasToken, setHasToken] = useState<boolean | null>(null);
  const bypassAuth = process.env.EXPO_PUBLIC_BYPASS_AUTH === 'true';

  useEffect(() => {
    const checkAuth = async () => {
      console.log('🔍 EXPO_PUBLIC_BYPASS_AUTH:', process.env.EXPO_PUBLIC_BYPASS_AUTH);
      console.log('🔍 bypassAuth:', bypassAuth);
      
      if (bypassAuth) {
        console.log('✅ Bypassing auth - going to tabs');
        setHasToken(true);
        return;
      }
      
      const token = await getRefreshToken();
      console.log('🔍 Token from storage:', token ? 'EXISTS' : 'NULL');

      if (!token) {
        setHasToken(false);
        return;
      }

      try {
        const refreshed = await refreshTokens(token);
        await Promise.all([setAccessToken(refreshed.accessToken), setRefreshToken(refreshed.refreshToken)]);
        console.log('✅ Refresh token valid, updated access token');
        setHasToken(true);
      } catch (error) {
        console.warn('⚠️ Refresh token invalid, clearing stored tokens');
        await clearStoredTokens();
        setHasToken(false);
      }
    };
    checkAuth();
  }, [bypassAuth]);

  console.log('🔍 Current hasToken state:', hasToken);

  if (hasToken === null) {
    console.log('⏳ Waiting for auth check...');
    return null;
  }

  const destination = hasToken ? '/(tabs)' : '/login';
  console.log('🚀 Redirecting to:', destination);

  return <Redirect href={destination} />;
}
