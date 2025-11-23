import { logout as logoutRequest } from '@/services/authAPI';
import apiClient from '@/services/apiClient';
import { clearStoredTokens, getAccessToken, getRefreshToken } from '@/utils/authStorage';
import { useRouter, useFocusEffect } from 'expo-router'; // 👈 useFocusEffect 추가
import React, { useCallback, useState } from 'react'; // 👈 useCallback 추가
import { ActivityIndicator, Alert, Image, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './profile.style';

// 칭호 → 등급 매핑
const titleGradeMap: Record<string, string> = {
  "수색 초보자": "common",
  "수색 대원": "uncommon",
  "수색 전문가": "rare",
};

// 등급 → 뱃지 이미지
const badgeImages: Record<string, any> = {
  common: require('../../assets/images/badge/common.png'),
  uncommon: require('../../assets/images/badge/uncommon.png'),
  rare: require('../../assets/images/badge/rare.png'),
};

// 기본 프로필 이미지
const defaultProfile = require('../../assets/images/default_profile.png');

export default function ProfileScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 로그아웃
  const handleLogout = async () => {
    Alert.alert(
      '로그아웃',
      '로그아웃 하시겠습니까?',
      [
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
            } catch (e) {
              console.warn('로그아웃 API 실패:', e);
            } finally {
              await clearStoredTokens();
              router.replace('/login');
            }
          }
        }
      ]
    );
  };

  // 프로필 GET - 🌟 useFocusEffect로 변경하여 화면 포커스 시마다 데이터 새로고침 🌟
  useFocusEffect(
    useCallback(() => {
        const fetchProfile = async () => {
            setLoading(true); // 데이터 재로딩 시 로딩 상태 설정
            try {
                const token = await getAccessToken();
                if (!token) return router.replace('/login');

                const res = await apiClient.get('/users/me', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                console.log("🔥 새로고침된 profileUrl:", res.data.profileUrl);
                console.log("🔥 GET 응답:", res.data);
                console.log("🔥 배경색 (새로고침):", res.data.profileBackgroundColor);


                setProfile(res.data);
            } catch (e) {
                console.log("프로필 불러오기 실패:", e);
                setProfile(null); // 로딩 실패 시 프로필 실패 화면을 띄우기 위함
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
        
        // 클린업 함수는 필요하지 않으므로 비워둡니다.
        return () => {};
    }, [])
  );

  // 로딩화면
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4FC3F7" />
      </View>
    );
  }

  // 프로필 실패 화면
  if (!profile) {
    return (
      <View style={styles.container}>
        <Text style={{ marginBottom: 20 }}>프로필 정보를 불러올 수 없습니다.</Text>
        <TouchableOpacity 
          style={[styles.editBtn, { backgroundColor: '#ff4444' }]}
          onPress={handleLogout}
        >
          <Text style={styles.editBtnText}>🚪 로그아웃</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const expRatio = Math.min(profile.exp / 100, 1);

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
        <TouchableOpacity 
          style={styles.settingBtn} 
          onPress={() => router.push('/settings')}
        >
          <Text style={styles.settingIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* 메인 카드 */}
      <View style={[styles.card, { backgroundColor: profile.profileBackgroundColor || '#fff' }]}> 
        {/* 🌟 배경색이 profile.profileBackgroundColor 값으로 적용됩니다. */}

        {/* 기본 이미지 */}
        <Image
          source={defaultProfile}
          style={styles.avatar}
        />

        <Text style={styles.name}>{profile.name}</Text>

        <Text style={styles.level}>
          Lv <Text style={styles.levelNum}>{profile.level}</Text>
        </Text>

        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${expRatio * 100}%` }]} />
        </View>
        <Text style={styles.expText}>{profile.exp} / 100</Text>

        {profile.title && titleGradeMap[profile.title] ? (
          <Image 
            source={badgeImages[titleGradeMap[profile.title]]}
            style={styles.badgeImage}
          />
        ) : (
          <Text style={{ marginTop: 18, fontSize: 18 }}>{profile.title}</Text>
        )}
      </View>

      <TouchableOpacity 
        style={styles.editBtn} 
        onPress={() => router.push('/profileEdit')}
      >
        <Text style={styles.editBtnText}>✏️ 프로필 편집</Text>
      </TouchableOpacity>
    </View>
  );
}
