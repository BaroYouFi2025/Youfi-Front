import React, { useCallback } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';

import { logout as logoutRequest } from '@/services/authAPI';
import { clearStoredTokens, getAccessToken, getRefreshToken } from '@/utils/authStorage';

import { styles } from './setting.style';

export default function SettingScreen() {
  const router = useRouter();

  const handleLogout = useCallback(() => {
    Alert.alert('로그아웃', '정말 로그아웃하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '로그아웃',
        style: 'destructive',
        onPress: async () => {
          try {
            const refreshToken = await getRefreshToken();
            const accessToken = await getAccessToken();

            if (refreshToken) {
              await logoutRequest(refreshToken, accessToken || undefined);
            }
          } catch (error) {
            console.warn('로그아웃 API 실패:', error);
          } finally {
            await clearStoredTokens();
            router.replace('/login');
          }
        },
      },
    ]);
  }, [router]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>설정</Text>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>로그아웃</Text>
      </TouchableOpacity>
    </View>
  );
}
