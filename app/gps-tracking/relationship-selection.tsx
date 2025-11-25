import { Stack } from 'expo-router';
import React from 'react';
import RelationshipSelectionScreen from '../../screens/GpsTracking/RelationshipSelectionScreen';

export default function RelationshipSelectionPage() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <RelationshipSelectionScreen />
    </>
  );
}
