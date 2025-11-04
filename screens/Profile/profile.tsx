import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { styles } from './profile.style';

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* 상단 로고 + 설정 */}
      <View style={styles.header}>
        <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
        <TouchableOpacity style={styles.settingBtn} onPress={() => router.push('/settings')}>
          <Text style={styles.settingIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* 카드 */}
      <View style={styles.card}>
        <Image source={require('../../assets/images/profile.png')} style={styles.avatar} />
        <Text style={styles.name}>배성민</Text>
        <Text style={styles.level}>
          Lv <Text style={styles.levelNum}>3</Text>
        </Text>

        {/* 경험치 바 */}
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '80%' }]} />
        </View>
        <Text style={styles.expText}>80 / 100</Text>

        {/* 칭호 */}
        <Image 
          source={require('../../assets/images/title_badge.png')} 
          style={styles.badgeImage} 
        />
      </View>

      {/* 프로필 편집 버튼 → ProfileEdit 페이지로 이동 */}
      <TouchableOpacity style={styles.editBtn} onPress={() => router.push('/')}>
        <Text style={styles.editBtnText}>✏️ 프로필 편집</Text>
      </TouchableOpacity>
    </View>
  );
}