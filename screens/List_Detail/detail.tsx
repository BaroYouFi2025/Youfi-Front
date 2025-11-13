// detail.tsx
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View, Modal } from 'react-native';
import { styles } from './detail.styles';

// 더미 데이터 (파라미터가 없는 경우 대비)
const DUMMY_DATA = {
  name: '아르쿠',
  ageAtTime: '32세',
  currentAge: '52세',
  date: '2005년 8월 21일 오후 7:22',
  clothing: '한 티셔츠, 청바지',
  category: '가출인',
  gender: '남',
  location: '부산소프트웨어마이스터고등학교',
  description: '수염이 있음, 평소 집을 자주 나감, 금일도 식재료를 사기 위해 집을 나갔다가 실종됨, 아내가 계속해서 112에 신고함',
  height: '175cm',
  weight: '60kg',
  bodyType: '보통 체형',
  feature: '왼쪽 귀 뒤에 점이 있음',
};

// 이미지 경로 설정 (people.png는 아바타, 나머지는 인상착의 및 예측 이미지로 가정)
// 실제 파일명에 맞게 조정이 필요합니다. 여기서는 더미 URL을 사용하여 대체합니다.
const AVATAR_URL = 'https://via.placeholder.com/84'; // params.avatar 대신 사용 가능
const STYLE_IMAGE_URL = 'https://via.placeholder.com/150x200?text=Style';
const OLD_IMAGE_URL = 'https://via.placeholder.com/150x200?text=Old';
const MAP_URL = 'https://static-map.roadgoat.com/placeholder-map.png';

export default function MissingDetail() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    id: string;
    name?: string;
    age?: string; // 당시 나이
    currentAge?: string; // 현재 나이
    appearance?: string;
    foundAt?: string;
    avatar?: string;
  }>();
  
  // --- 상태 및 핸들러 ---
  const [isConfirmModalVisible, setConfirmModalVisible] = useState(false);
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);

  // 파라미터 또는 더미 데이터 사용
  const name = params.name ?? DUMMY_DATA.name;
  const ageAtTime = params.age ?? DUMMY_DATA.ageAtTime;
  const currentAge = params.currentAge ?? DUMMY_DATA.currentAge;
  const foundAt = params.foundAt ?? DUMMY_DATA.location;
  const avatar = params.avatar ?? AVATAR_URL;

  const handleReport = () => {
    setConfirmModalVisible(true);
  };

  const handleCancel = () => {
    setConfirmModalVisible(false);
  };

  const handleConfirm = () => {
    setConfirmModalVisible(false);
    setSuccessModalVisible(true); // 완료 모달 열기
    console.log('확인 클릭: 182로 연결');
  };

  const handleSuccessClose = () => {
    setSuccessModalVisible(false);
    // 모달 닫은 후 페이지를 이전으로 되돌릴 수도 있습니다. (선택 사항)
    // router.back();
  };

  // --- 모달 렌더링 함수 ---
  const renderConfirmModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isConfirmModalVisible}
      onRequestClose={handleCancel}
    >
      <View style={styles.modalCenteredView}>
        <View style={styles.modalConfirmView}>
          <Text style={styles.modalTitle}>정말 신고하시겠습니까?</Text>

          <View style={styles.modalPersonInfoRow}>
            <Image source={{ uri: avatar }} style={styles.modalProfileImage} />
            <View style={styles.modalTextGroup}>
                <Text style={styles.modalNameText}>{name}({DUMMY_DATA.gender})</Text>
                <Text style={styles.modalAgeText}>{ageAtTime}(당시)</Text>
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
      <View style={styles.modalCenteredView}>
        <TouchableOpacity 
            style={styles.modalCenteredView} 
            activeOpacity={1} 
            onPress={handleSuccessClose} 
        >
            <TouchableOpacity 
                style={styles.modalSuccessView} 
                activeOpacity={1}
            >
                <Text style={styles.successMessageTitle}>신고 해주셔서 감사합니다</Text>
                <Text style={styles.successMessageSubtitle}>빈곳을 클릭해주세요</Text>
            </TouchableOpacity>
        </TouchableOpacity>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.safe}>
      {renderConfirmModal()}
      {renderSuccessModal()}

      <ScrollView contentContainerStyle={styles.container}>

        <View style={styles.mapContainer}>
          <Image
            source={{ uri: MAP_URL }}
            style={styles.mapBox}
            resizeMode="cover"
          />
          <View style={styles.infoSummaryBox}>
            <Image source={{ uri: avatar }} style={styles.infoSummaryImage} />
            <View style={styles.infoSummaryTextGroup}>
                <Text style={styles.infoSummaryName}>{name}({DUMMY_DATA.gender})</Text>
                <Text style={styles.infoSummaryDate}>{DUMMY_DATA.date}</Text>
            </View>
            <Text style={styles.infoSummaryAge}>{ageAtTime}(당시)</Text>
          </View>
        </View>
        
        <Text style={styles.sectionTitle}>인상착의</Text>
        <View style={styles.styleContainer}>
          <Image source={{ uri: STYLE_IMAGE_URL }} style={styles.styleImage} />
          <View style={styles.styleDetailGroup}>
            <Text style={styles.styleDetailRow}><Text style={styles.styleLabel}>상/하의:</Text> {DUMMY_DATA.clothing}</Text>
            <Text style={styles.styleDetailRow}><Text style={styles.styleLabel}>키:</Text> {DUMMY_DATA.height}</Text>
            <Text style={styles.styleDetailRow}><Text style={styles.styleLabel}>체형:</Text> {DUMMY_DATA.bodyType}</Text>
            <Text style={styles.styleDetailRow}><Text style={styles.styleLabel}>몸무게:</Text> {DUMMY_DATA.weight}</Text>
            <Text style={styles.styleDetailRow}><Text style={styles.styleLabel}>기타:</Text> {DUMMY_DATA.feature}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>현재 모습 예측</Text>
        <View style={styles.styleContainer}>
          <Image source={{ uri: OLD_IMAGE_URL }} style={styles.styleImage} />
          <View style={styles.styleDetailGroup}>
            <Text style={styles.styleDetailRow}><Text style={styles.styleLabel}>나이:</Text> {currentAge}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.itemLine}><Text style={styles.itemLabel}>대상구분: </Text>{DUMMY_DATA.category}</Text>
          <Text style={styles.itemLine}><Text style={styles.itemLabel}>성별구분: </Text>{DUMMY_DATA.gender}</Text>
          <Text style={styles.itemLine}><Text style={styles.itemLabel}>발생장소: </Text>{foundAt}</Text>
          <Text style={styles.itemLine}><Text style={styles.itemLabel}>기타사항: </Text>{DUMMY_DATA.description}</Text>
        </View>

        <View style={styles.spacer} />
      </ScrollView>

      <TouchableOpacity style={styles.reportBtnFixed} activeOpacity={0.9} onPress={handleReport}>
        <Text style={styles.reportBtnText}>신고하기</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}