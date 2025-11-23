import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { styles } from './police_detail.style';
import ConfirmReportModal from './ConfirmReportModal';
import SuccessReportModal from './SuccessReportModal';

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

  return (
    <SafeAreaView style={styles.container}>
      <ConfirmReportModal
        visible={isConfirmModalVisible}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
        name={personData.name}
        ageAtTime={personData.ageAtTime}
        avatar={PERSON_IMAGE}
      />
      <SuccessReportModal
        visible={isSuccessModalVisible}
        onClose={handleSuccessClose}
      />

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
