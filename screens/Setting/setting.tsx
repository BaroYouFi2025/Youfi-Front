import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, Image, TouchableOpacity, Alert, ActivityIndicator, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { styles, colors } from './setting.style';
import { logout as logoutRequest } from '@/services/authAPI';
import { clearStoredTokens, getAccessToken, getRefreshToken } from '@/utils/authStorage';
import axios from 'axios';
import { deleteMe } from '@/services/userAPI';

const defaultProfile = require('../../assets/images/default_profile.png');

const SettingScreen: React.FC = () => {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [withdrawVisible, setWithdrawVisible] = useState(false);
  const [withdrawPassword, setWithdrawPassword] = useState('');
  const [withdrawing, setWithdrawing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await getAccessToken();
        if (!token) {
          router.replace('/login');
          return;
        }
        const res = await axios.get('https://jjm.jojaemin.com/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
      } catch (e) {
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [router]);

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
            } finally {
              await clearStoredTokens();
              router.replace('/login');
            }
          }
        }
      ]
    );
  };

  const renderLinkRow = (
    title: string,
    desc: string,
    onPress: () => void,
    icon: keyof typeof Ionicons.glyphMap,
  ) => (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={18} color={colors.text} />
      </View>
      <View style={styles.rowTextWrap}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowDesc}>{desc}</Text>
      </View>
      <Ionicons name="chevron-forward" style={styles.chevron} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>설정</Text>
            <Text style={styles.subtitle}>내 계정과 정보를 관리하세요</Text>
          </View>
        </View>

        <View style={styles.profileCard}>
          <Image source={profile?.profileUrl ? { uri: profile.profileUrl } : defaultProfile} style={styles.avatar} />
          <View style={styles.profileTextWrap}>
            <Text style={styles.profileName}>{profile?.name || '이름 정보 없음'}</Text>
            <Text style={styles.profileEmail}>
              {profile ? `Lv ${profile.level} • ${profile.title || ''}` : '불러오는 중'}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.miniButton}
            onPress={() => router.push('/profileEdit')}
            activeOpacity={0.9}
          >
            <Text style={styles.miniButtonText}>프로필 편집</Text>
          </TouchableOpacity>
        </View>

        {loading && (
          <View style={{ paddingVertical: 12, alignItems: 'center' }}>
            <ActivityIndicator />
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>정보</Text>
          <View style={styles.card}>
            <View style={styles.versionRow}>
              <Text style={styles.rowTitle}>앱 버전</Text>
              <Text style={styles.versionText}>1.0.0</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.9}>
          <Text style={styles.logoutText}>로그아웃</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.withdrawBtn} onPress={() => setWithdrawVisible(true)} activeOpacity={0.9}>
          <Text style={styles.withdrawText}>회원 탈퇴</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={withdrawVisible} transparent animationType="fade" onRequestClose={() => setWithdrawVisible(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: '#fff', width: '85%', borderRadius: 12, padding: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 12 }}>회원 탈퇴</Text>
            <Text style={{ fontSize: 14, color: '#555', marginBottom: 12 }}>
              계정을 삭제하려면 비밀번호를 입력하세요.
            </Text>
            <TextInput
              value={withdrawPassword}
              onChangeText={setWithdrawPassword}
              placeholder="비밀번호"
              secureTextEntry
              style={{
                borderWidth: 1,
                borderColor: '#ddd',
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 10,
                marginBottom: 16,
              }}
            />

            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 12 }}>
              <TouchableOpacity
                onPress={() => {
                  if (withdrawing) return;
                  setWithdrawVisible(false);
                  setWithdrawPassword('');
                }}
                style={[styles.miniButton, { backgroundColor: '#e5e7eb' }]}
              >
                <Text style={[styles.miniButtonText, { color: '#111' }]}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  if (!withdrawPassword || withdrawing) return;
                  setWithdrawing(true);
                  try {
                    await deleteMe(withdrawPassword);
                    await clearStoredTokens();
                    Alert.alert('탈퇴 완료', '회원 탈퇴가 완료되었습니다.', [
                      { text: '확인', onPress: () => router.replace('/login') },
                    ]);
                  } catch (error) {
                    Alert.alert('탈퇴 실패', error instanceof Error ? error.message : '다시 시도해주세요.');
                  } finally {
                    setWithdrawing(false);
                    setWithdrawVisible(false);
                    setWithdrawPassword('');
                  }
                }}
                style={[styles.miniButton, { backgroundColor: '#ff5252' }]}
                disabled={withdrawing || !withdrawPassword}
              >
                <Text style={styles.miniButtonText}>{withdrawing ? '처리 중...' : '탈퇴'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default SettingScreen;
