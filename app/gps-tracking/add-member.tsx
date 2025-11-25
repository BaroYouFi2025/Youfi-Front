import { Stack } from 'expo-router';
import React from 'react';
import AddMemberScreen from '../../screens/GpsTracking/AddMemberScreen';

export default function AddMemberPage() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <AddMemberScreen />
    </>
  );
}
