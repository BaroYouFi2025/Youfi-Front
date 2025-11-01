import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';

import { logout } from '@/services/authAPI';
import { clearStoredTokens, getRefreshToken } from '@/utils/authStorage';

export default function ProfileScreen() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);

    try {
      const refreshToken = await getRefreshToken();

      if (refreshToken) {
        await logout(refreshToken);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : '로그아웃에 실패했습니다. 다시 시도해주세요.';
      Alert.alert('로그아웃 실패', message);
    } finally {
      await clearStoredTokens();
      router.replace('/login');
      setIsLoggingOut(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.logoutButton, isLoggingOut && styles.logoutButtonDisabled]}
        onPress={handleLogout}
        activeOpacity={0.7}
        disabled={isLoggingOut}
      >
        {isLoggingOut ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.logoutButtonText}>로그아웃</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 8,
  },
  logoutButtonDisabled: {
    opacity: 0.7,
  },
  logoutButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
