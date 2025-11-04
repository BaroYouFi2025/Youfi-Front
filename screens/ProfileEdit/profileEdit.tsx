import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, ScrollView, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { styles } from './profileEdit.style';

export default function ProfileEdit() {
  const router = useRouter();
  const [titleModalVisible, setTitleModalVisible] = useState(false);
  const [backgroundModalVisible, setBackgroundModalVisible] = useState(false);

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>프로필 카드 수정</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.profileImageSection}>
          <Image source={require('../../assets/images/profile.png')} style={styles.profileImage} />
          <TouchableOpacity style={styles.changePhotoButton}>
            <Text style={styles.changePhotoButtonText}>프로필 사진 변경</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.label}>이름</Text>
          <TextInput style={styles.input} placeholder="이름을 입력하세요" />
        </View>

        <View style={styles.badgeSection}>
          <Text style={styles.label}>칭호</Text>
          <TouchableOpacity onPress={() => setTitleModalVisible(true)}>
            <Image 
              source={require('../../assets/images/title_badge.png')} 
              style={styles.badgeImage} 
              resizeMode="contain" 
            />
          </TouchableOpacity>
        </View>

        <View style={styles.backgroundSection}>
          <Text style={styles.label}>프로필 배경</Text>
          <View style={styles.backgroundBox}>
            <Text style={styles.backgroundLabel}>기본(흰색)</Text>
          </View>
          <TouchableOpacity 
            style={styles.changeBackgroundButton} 
            onPress={() => setBackgroundModalVisible(true)}
          >
            <Text style={styles.changeBackgroundButtonText}>프로필 배경 변경</Text>
          </TouchableOpacity>
        </View>
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
            <Text style={styles.modalTitle}>칭호 목록</Text>
            <ScrollView>
              {[1,2,3,4,5].map((_, idx) => (
                <TouchableOpacity key={idx} style={styles.titleItem} onPress={() => setTitleModalVisible(false)}>
                  <Image 
                    source={require('../../assets/images/title_badge.png')} 
                    style={styles.titleBadgeImage} 
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.closeButton} onPress={() => setTitleModalVisible(false)}>
              <Text style={styles.closeButtonText}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      {/* 프로필 배경 모달 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={backgroundModalVisible}
        onRequestClose={() => setBackgroundModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>프로필 배경 목록</Text>
            <ScrollView contentContainerStyle={{flexDirection:'row', flexWrap:'wrap', justifyContent:'space-between'}}>
              {[1,2,3,4,5,6,7,8,9].map((_, idx) => (
                <TouchableOpacity 
                  key={idx} 
                  style={styles.backgroundItem} 
                  onPress={() => setBackgroundModalVisible(false)}
                >
                  <Text style={styles.backgroundLabel}>기본(흰색)</Text>
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