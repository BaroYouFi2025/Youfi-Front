import { clearStoredTokens } from '@/utils/authStorage';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './profile.style';

export default function ProfileScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
            await clearStoredTokens();
            router.replace('/login');
          },
        },
      ]
    );
  };

  // 🔥 프로필 GET
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('https://jjm.jojaemin.com/User/getProfile', {
          headers: {
            Authorization: `Bearer YOUR_JWT_TOKEN`, // 로그인에서 받은 토큰
          },
        });
        setProfile(res.data);
      } catch (e) {
        console.log('프로필 불러오기 실패:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // 로딩 표시
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4FC3F7" />
      </View>
    );
  }

  // 프로필 없음
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
      {/* 상단 */}
      <View style={styles.header}>
        <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
        <TouchableOpacity style={styles.settingBtn} onPress={() => router.push('/settings')}>
          <Text style={styles.settingIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* 카드 */}
      <View style={[styles.card, { backgroundColor: profile.backgroundColor || '#fff' }]}>
        
        {/* 프로필 이미지 */}
        <Image 
          source={{ uri: profile.profileUrl }} 
          style={styles.avatar} 
        />

        {/* 이름 */}
        <Text style={styles.name}>{profile.name}</Text>

        {/* 레벨 */}
        <Text style={styles.level}>
          Lv <Text style={styles.levelNum}>{profile.level}</Text>
        </Text>

        {/* 경험치 바 */}
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${expRatio * 100}%` }]} />
        </View>
        <Text style={styles.expText}>{profile.exp} / 100</Text>

        {/* 칭호 → 이미지 or 텍스트 */}
        {profile.titleImageUrl ? (
          <Image source={{ uri: profile.titleImageUrl }} style={styles.badgeImage} />
        ) : (
          <Text style={{ marginTop: 18, fontSize: 18 }}>{profile.title}</Text>
        )}
      </View>

      {/* 프로필 편집 */}
      <TouchableOpacity style={styles.editBtn} onPress={() => router.push('/profileEdit')}>
        <Text style={styles.editBtnText}>✏️ 프로필 편집</Text>
      </TouchableOpacity>

      {/* 로그아웃 */}
      <TouchableOpacity 
        style={[styles.editBtn, { backgroundColor: '#ff4444', marginTop: 12 }]} 
        onPress={handleLogout}
      >
        <Text style={styles.editBtnText}>🚪 로그아웃</Text>
      </TouchableOpacity>
    </View>
  );
}
