import { Stack } from 'expo-router';
import React from 'react';
import GpsTrackingScreen from '../../screens/GpsTracking/GpsTrackingScreen';

export default function GpsTrackingPage() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <GpsTrackingScreen />
    </>
  );
}