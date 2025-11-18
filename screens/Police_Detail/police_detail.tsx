import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, SafeAreaView, Modal } from 'react-native';
import { styles } from './police_detail.style';

const PERSON_IMAGE = require('../../assets/images/people.png');

const personData = {
  name: '아르쿠',
  ageAtTime: '32세',
  currentAge: '52세',
  date: '20050821',
  clothing: '캐주얼차림',
  category: '가출인',
  gender: '남자',
  location: '부산소프트웨어마이스터고등학교',
  description: '수염이 있음, 평소 집을 자주 나감, 금일도 식재료를 사기 위해 집을 나갔다가 실종됨, 아내가 계속해서 112에 신고함',
};

const infoFields = [
  { label: '이름', value: personData.name },
  { label: '나이(당시)', value: personData.ageAtTime },
  { label: '나이(현재)', value: personData.currentAge },
  { label: '발생일시', value: personData.date },
  { label: '착의사항', value: personData.clothing },
  { label: '대상구분', value: personData.category },
  { label: '성별구분', value: personData.gender },
  { label: '발생장소', value: personData.location },
];

const PoliceDetailScreen = () => {
  // 상태 변수 변경: isModalVisible -> isConfirmModalVisible 로 변경하여 명확하게 구분
  const [isConfirmModalVisible, setConfirmModalVisible] = useState(false);
  // 새로운 상태 추가: 신고 완료 모달 관리
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);

  const handleGoBack = () => {
    console.log('뒤로가기');
  };

  // 신고하기 버튼 핸들러 -> 첫 번째 모달 (확인) 오픈
  const handleReport = () => {
    setConfirmModalVisible(true);
  };

  // 첫 번째 모달: 취소 버튼 핸들러
  const handleCancel = () => {
    setConfirmModalVisible(false);
  };

  // ⭐️ 핵심 수정: '확인' 클릭 시 첫 번째 모달을 닫고, 두 번째 모달을 엽니다.
  const handleConfirm = () => {
    setConfirmModalVisible(false);
    setSuccessModalVisible(true); // 두 번째 모달 열기
    console.log('확인 클릭: 182로 연결');
  };

  // 두 번째 모달: 닫기 핸들러 (빈 곳 클릭 시)
  const handleSuccessClose = () => {
    setSuccessModalVisible(false);
    console.log('신고 완료 모달 닫기');
  };

  const renderConfirmModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isConfirmModalVisible}
      onRequestClose={handleCancel}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>정말 신고하시겠습니까?</Text>

          <View style={styles.modalPersonInfoRow}>
            <Image source={PERSON_IMAGE} style={styles.modalProfileImage} />
            <View style={styles.modalTextGroup}>
                <Text style={styles.modalNameText}>{personData.name}(남)</Text>
                <Text style={styles.modalAgeText}>{personData.ageAtTime}(당시)</Text>
            </View>
          </View>

          <Text style={styles.modalDescription}>
            확인 시 실종자 발견 점수를 위해 182번으로 연결됩니다.
          </Text>

          <View style={styles.modalButtonContainer}>
            <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={handleCancel}
            >
              <Text style={styles.cancelButtonText}>취소</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]} 
                onPress={handleConfirm}
            >
              <Text style={styles.confirmButtonText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderSuccessModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isSuccessModalVisible}
      onRequestClose={handleSuccessClose}
    >
      <View style={styles.centeredView}>
        <TouchableOpacity
          style={{ position: 'absolute', inset: 0 }}
          activeOpacity={1}
          onPress={handleSuccessClose}
        />
        
        <View style={styles.successModalView}>
          <Text style={styles.successMessageTitle}>신고 해주셔서 감사합니다</Text>
          <Text style={styles.successMessageSubtitle}>빈곳을 클릭해주세요</Text>
        </View>
      </View>
    </Modal>
  );
  

  return (
    <SafeAreaView style={styles.container}>
      {renderConfirmModal()}
      {renderSuccessModal()}

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.imageContainer}>
          <Image source={PERSON_IMAGE} style={styles.profileImage} />
        </View>

        <View style={styles.infoSection}>
          {infoFields.map((item, index) => (
            <View key={index} style={styles.infoRow}>
              <Text style={styles.infoLabel}>{item.label} : </Text>
              <Text style={styles.infoValue}>{item.value}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>기타사항 : </Text>
            <Text style={styles.infoValue}>{personData.description}</Text>
        </View>

        <View style={styles.spacer} />
      </ScrollView>

      <TouchableOpacity style={styles.reportButton} onPress={handleReport}>
        <Text style={styles.reportButtonText}>신고하기</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default PoliceDetailScreen;