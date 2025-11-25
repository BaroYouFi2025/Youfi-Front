import { refreshTokens } from '@/services/authAPI';
import { clearStoredTokens, getRefreshToken, setAccessToken, setRefreshToken } from '@/utils/authStorage';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';

export default function Index() {
  const [hasToken, setHasToken] = useState<boolean | null>(null);
  const bypassAuth = process.env.EXPO_PUBLIC_BYPASS_AUTH === 'true';

  useEffect(() => {
    const checkAuth = async () => {
      
      if (bypassAuth) {
        setHasToken(true);
        return;
      }
      
      const token = await getRefreshToken();

      if (!token) {
        setHasToken(false);
        return;
      }

      try {
        const refreshed = await refreshTokens(token);
        await Promise.all([setAccessToken(refreshed.accessToken), setRefreshToken(refreshed.refreshToken)]);
        setHasToken(true);
      } catch {
        await clearStoredTokens();
        setHasToken(false);
      }
    };
    checkAuth();
  }, [bypassAuth]);


  if (hasToken === null) {
    return null;
  }

  const destination = hasToken ? '/(tabs)' : '/login';

  return <Redirect href={destination} />;
}
