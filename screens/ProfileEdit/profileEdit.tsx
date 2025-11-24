import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import React, { useState, useEffect } from 'react';
import {
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator, 
} from 'react-native';
import { isAxiosError } from 'axios';
import apiClient from '@/services/apiClient';
import { styles } from './profileEdit.style'; 
import { getAccessToken } from '@/utils/authStorage';

// 기본 프로필 이미지
const defaultProfile = require('../../assets/images/default_profile.png');

const titleGradeMap: Record<string, string> = {
  "수색 초보자": "common",
  "수색 대원": "uncommon",
  "수색 전문가": "rare",
};

const TITLE_LIST = Object.keys(titleGradeMap); 

const getTitleImageSource = (title: string) => {
  const grade = titleGradeMap[title];
  if (grade) {
    switch (grade) {
      case 'common':
        return require('../../assets/images/badge/common.png');
      case 'uncommon':
        return require('../../assets/images/badge/uncommon.png');
      case 'rare':
        return require('../../assets/images/badge/rare.png');
      default:
        return null;
    }
  }
  return null;
};

// 배경색 옵션
const colorOptions = [
    { name: '흰색', color: '#FFFFFF' },
    { name: '연회색', color: '#F8F9FA' },
    { name: '연하늘색', color: '#E3F2FD' },
    { name: '하늘색', color: '#BBDEFB' },
    { name: '민트색', color: '#E0F7FA' },
    { name: '연노랑색', color: '#FFF9C4' },
    { name: '연주황색', color: '#FFE8D6' },
    { name: '연분홍색', color: '#F8BBD0' },
    { name: '연보라색', color: '#E1BEE7' },
];

export default function ProfileEdit() {
  const router = useRouter();

  const [titleModalVisible, setTitleModalVisible] = useState(false);
  const [backgroundModalVisible, setBackgroundModalVisible] = useState(false);

  // State 초기값
  const [name, setName] = useState('');
  const [title, setTitle] = useState('수색 초보자');
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [backgroundName, setBackgroundName] = useState('흰색');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchCurrentProfile = async () => {
      setLoading(true); 
      try {
        const token = await getAccessToken();
        if (!token) {
            setLoading(false);
            return router.replace('/login');
        }

        const res = await apiClient.get('/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data;
        
        // 불러온 데이터로 State 값 초기화
        setName(data.name || ''); 
        setTitle(data.title || '수색 초보자'); 
        setImageUri(data.profileUrl || null);
        
        // 배경색과 이름 설정
        const currentBgColor = data.profileBackgroundColor || '#FFFFFF';
        setBackgroundColor(currentBgColor);
        const currentBgOption = colorOptions.find(opt => opt.color === currentBgColor);
        setBackgroundName(currentBgOption ? currentBgOption.name : '기본 색상');

      } catch (e) {
        console.error("❌ 프로필 초기 데이터 로딩 실패:", e);
        Alert.alert('오류', '프로필 정보를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false); 
      }
    };
    fetchCurrentProfile();
  }, []); 

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  // 🔥 저장 로직 (PATCH 요청)
  const handleSave = async () => {
    // ... (로직 생략 - 이전과 동일)
    try {
      const token = await getAccessToken();
      if (!token) {
        Alert.alert('오류', '로그인이 필요합니다.');
        return;
      }

      const body: any = {};

      if (name.trim() !== '') body.name = name.trim();
      if (title.trim() !== '') body.title = title.trim();
      if (imageUri) body.profileUrl = imageUri;
      if (backgroundColor) body.profileBackgroundColor = backgroundColor; 


      await apiClient.patch('/users/me', body, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      Alert.alert('성공', '프로필이 저장되었습니다!');
      router.back(); 

    } catch (e) {
      if (isAxiosError(e) && e.response) {
        console.error('❌ PATCH 에러 상태 코드:', e.response.status); 
        console.error('❌ PATCH 에러 응답 데이터:', e.response.data);
        Alert.alert('저장 실패', `프로필 저장에 실패했습니다. (코드: ${e.response.status})`);
      } else {
        console.error('❌ 프로필 저장 실패:', e);
        Alert.alert('저장 실패', '프로필 저장 중 네트워크 오류가 발생했습니다.');
      }
    }
  };

  // 로딩 화면 표시
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4FC3F7" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* 프로필 이미지 */}
        <View style={styles.profileImageSection}>
          <Image
            source={imageUri ? { uri: imageUri } : defaultProfile} 
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.changePhotoButton} onPress={pickImage}>
            <Text style={styles.changePhotoButtonText}>프로필 사진 변경</Text>
          </TouchableOpacity>
        </View>

        {/* 이름 */}
        <View style={styles.inputSection}>
          <Text style={styles.label}>이름</Text>
          <TextInput
            style={styles.input}
            placeholder="이름을 입력하세요"
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* 칭호 */}
        <View style={styles.badgeSection}>
          <Text style={styles.label}>칭호</Text>
          <TouchableOpacity onPress={() => setTitleModalVisible(true)}>
            <View style={styles.titleContainer}> 
              {getTitleImageSource(title) ? (
                <Image
                  source={getTitleImageSource(title)}
                  style={styles.badgeImage}
                />
              ) : (
                <Text style={[styles.titleBackgroundBox, {textAlign: 'center'}]}>
                    {title || '칭호 선택'}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* 배경색 */}
        <View style={styles.backgroundSection}>
          <Text style={styles.label}>프로필 배경</Text>

          {/* 배경색은 동적으로 변하므로 인라인 스타일 유지 */}
          <View style={[styles.backgroundBox, { backgroundColor }]}> 
            <Text style={styles.backgroundLabel}>{backgroundName}</Text>
          </View>

          <TouchableOpacity
            style={styles.changeBackgroundButton}
            onPress={() => setBackgroundModalVisible(true)}
          >
            <Text style={styles.changeBackgroundButtonText}>프로필 배경 변경</Text>
          </TouchableOpacity>
        </View>

        {/* 저장 */}
        <TouchableOpacity
          // 인라인 스타일 제거: styles.changeBackgroundButton과 styles.saveButton 병합 적용
          style={[styles.changeBackgroundButton, styles.saveButton]}
          onPress={handleSave}
        >
          {/* 인라인 스타일 제거: styles.changeBackgroundButtonText와 styles.saveButtonText 병합 적용 */}
          <Text style={[styles.changeBackgroundButtonText, styles.saveButtonText]}> 
            저장하기
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* 칭호 모달 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={titleModalVisible}
        onRequestClose={() => setTitleModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>칭호 선택</Text>

            <ScrollView>
              {/* 칭호 모달 목록 */}
              {TITLE_LIST.map((t, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.titleItem}
                  onPress={() => {
                    setTitle(t);
                    setTitleModalVisible(false);
                  }}
                >
                  {getTitleImageSource(t) ? (
                    <Image
                      source={getTitleImageSource(t)}
                      style={styles.titleBadgeImage} // styles.titleBadgeImage 적용
                    />
                  ) : (
                    <Text style={{ fontSize: 16 }}>{t}</Text>
                  )}
                  
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity style={styles.closeButton} onPress={() => setTitleModalVisible(false)}>
              <Text style={styles.closeButtonText}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={backgroundModalVisible}
        onRequestClose={() => setBackgroundModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>프로필 배경 선택</Text>

            <ScrollView
              contentContainerStyle={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
              }}
            >
              {colorOptions.map((opt, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[styles.backgroundItem, { backgroundColor: opt.color }]} 
                  onPress={() => {
                    setBackgroundColor(opt.color);
                    setBackgroundName(opt.name);
                    setBackgroundModalVisible(false);
                  }}
                >
                  <Text style={styles.backgroundLabel}>{opt.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity style={styles.closeButton} onPress={() => setBackgroundModalVisible(false)}>
              <Text style={styles.closeButtonText}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
}
