import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import axios from 'axios';
import { styles } from './profileEdit.style';

export default function ProfileEdit() {
  const router = useRouter();

  const [titleModalVisible, setTitleModalVisible] = useState(false);
  const [backgroundModalVisible, setBackgroundModalVisible] = useState(false);

  // 상태
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [backgroundName, setBackgroundName] = useState('흰색');
  const [imageUri, setImageUri] = useState<string | null>(null);

  // 🔥 색상 목록 (색이름 + HEX)
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

  // 🔥 이미지 선택
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  // 🔥 저장하기 → API 연동
  const handleSave = async () => {
    try {
      const formData = new FormData();

      formData.append('name', name);
      formData.append('title', title);
      formData.append('backgroundColor', backgroundColor); // HEX만 전달됨

      if (imageUri) {
        formData.append('profileImage', {
          uri: imageUri,
          name: 'profile.jpg',
          type: 'image/jpeg',
        } as any);
      }

      await axios.put('https://jjm.jojaemin.com/User/updateProfile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer YOUR_JWT_TOKEN`, // 🔥 로그인 토큰 주입
        },
      });

      alert('프로필이 저장되었습니다!');
      router.back();
    } catch (e) {
      console.error('프로필 저장 실패:', e);
      alert('프로필 저장에 실패했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* 프로필 이미지 */}
        <View style={styles.profileImageSection}>
          <Image
            source={imageUri ? { uri: imageUri } : require('../../assets/images/profile.png')}
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
            <View style={[styles.backgroundBox, { backgroundColor: '#F1F5F9' }]}>
              <Text style={{ color: '#333' }}>{title || '칭호 선택'}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* 프로필 배경색 */}
        <View style={styles.backgroundSection}>
          <Text style={styles.label}>프로필 배경</Text>

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

        {/* 저장 버튼 */}
        <TouchableOpacity
          style={[styles.changeBackgroundButton, { marginTop: 20, borderColor: '#4FC3F7' }]}
          onPress={handleSave}
        >
          <Text style={[styles.changeBackgroundButtonText, { color: '#4FC3F7' }]}>
            저장하기
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ===================================================== */}
      {/* 칭호 모달 */}
      {/* ===================================================== */}
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
              {['마스터', '정예 헌터', '탐험가', '스카우트', '전설'].map((t, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.titleItem}
                  onPress={() => {
                    setTitle(t);
                    setTitleModalVisible(false);
                  }}
                >
                  <Text style={{ fontSize: 16 }}>{t}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity style={styles.closeButton} onPress={() => setTitleModalVisible(false)}>
              <Text style={styles.closeButtonText}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ===================================================== */}
      {/* 배경색 모달 */}
      {/* ===================================================== */}
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
