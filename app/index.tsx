import { getRefreshToken } from '@/utils/authStorage';
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
      console.log('🔍 hasToken will be:', Boolean(token));
      setHasToken(Boolean(token));
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
