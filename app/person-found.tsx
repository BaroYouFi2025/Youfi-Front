import { Stack } from 'expo-router';
import PersonFoundScreen from '@/screens/PersonFound/PersonFoundScreen';

export default function PersonFoundRoute() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <PersonFoundScreen />
    </>
  );
}

