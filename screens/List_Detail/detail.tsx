import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Modal } from 'react-native';
import { detailStyles } from './detail.styles';

const mapImageSource = 'path/to/map_image.png';
const originalLookImageSource = 'path/to/original_look_image.png';
const currentLookImageSource = 'path/to/current_look_image.png';
const userAvatarSource = 'path/to/user_avatar.png';

const DetailScreen: React.FC = () => {
  const [isConfirmModalVisible, setConfirmModalVisible] = useState(false);
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);

  // 하드코딩 데이터
  const details = {
    name: '아트쿠(남)',
    ageAtTime: 32,
    birthDate: '2005년 8월 21일 오후 7:22',
    height: '175cm',
    weight: '60kg',
    topWear: '흰 티셔츠',
    bottomWear: '청바지',
    bodyType: '보통 체형',
    otherFeature: '왼쪽 귀 뒤에 점이 있음',
    currentAge: 52,
  };

  // 신고 버튼 → 첫 번째 모달 열기
  const handleReport = () => {
    setConfirmModalVisible(true);
  };

  const handleCancel = () => {
    setConfirmModalVisible(false);
  };

  const handleConfirm = () => {
    setConfirmModalVisible(false);

    // 첫 번째 모달 완전히 닫힌 뒤 두 번째 모달 열기 (겹침 없음)
    setTimeout(() => setSuccessModalVisible(true), 70);
  };

  const handleSuccessClose = () => setSuccessModalVisible(false);

  // --- 첫 번째 모달 ---
  const renderConfirmModal = () => (
    <Modal animationType="fade" transparent visible={isConfirmModalVisible}>
      <View style={detailStyles.modalOverlay}>
        <View style={detailStyles.modalBox}>
          <Text style={detailStyles.modalTitle}>정말 신고하시겠습니까?</Text>

          <Text style={detailStyles.modalDesc}>
            확인 시 실종자 발견 점수를 위해 182번으로 연결됩니다.
          </Text>

          <View style={detailStyles.modalButtonRow}>
            <TouchableOpacity
              style={[detailStyles.modalButton, detailStyles.cancelButton]}
              onPress={handleCancel}
            >
              <Text style={detailStyles.modalButtonText}>취소</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[detailStyles.modalButton, detailStyles.confirmButton]}
              onPress={handleConfirm}
            >
              <Text style={detailStyles.modalButtonText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  // --- 두 번째 모달 (오버레이 한 겹만 유지) ---
  const renderSuccessModal = () => (
    <Modal animationType="fade" transparent visible={isSuccessModalVisible}>
      {/* 이 overlay 하나만 → 겹침 없음 */}
      <TouchableOpacity
        style={detailStyles.modalOverlay}
        activeOpacity={1}
        onPress={handleSuccessClose}
      >
        <TouchableOpacity style={detailStyles.successModalBox} activeOpacity={1}>
          <Text style={detailStyles.successTitle}>신고 해주셔서 감사합니다</Text>
          <Text style={detailStyles.successSubtitle}>빈 곳을 클릭해주세요</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <>
      {renderConfirmModal()}
      {renderSuccessModal()}

      <ScrollView style={detailStyles.container}>
        {/* ------- 기존 코드 그대로 ------- */}
        <View style={detailStyles.mapContainer}>
          <Image source={{ uri: mapImageSource }} style={detailStyles.mapImage} />
          <View style={detailStyles.mapAvatarOverlay}>
            <Image source={{ uri: userAvatarSource }} style={detailStyles.mapAvatar} />
          </View>
        </View>

        <View style={detailStyles.infoSection}>
          <Image source={{ uri: userAvatarSource }} style={detailStyles.avatar} />

          <View style={detailStyles.nameAgeContainer}>
            <Text style={detailStyles.nameText}>
              {details.name} • {details.ageAtTime}세(당시)
            </Text>
            <Text style={detailStyles.dateText}>{details.birthDate}</Text>
          </View>
        </View>

        <View style={detailStyles.divider} />

        {/* 인상착의 */}
        <View style={detailStyles.section}>
          <Text style={detailStyles.sectionTitle}>인상착의</Text>
          <View style={detailStyles.descriptionContent}>
            <Image source={{ uri: originalLookImageSource }} style={detailStyles.descriptionImage} />
            <View style={detailStyles.descriptionDetails}>
              <Text style={detailStyles.detailLine}><Text style={detailStyles.detailLabel}>상의 :</Text> {details.topWear}</Text>
              <Text style={detailStyles.detailLine}><Text style={detailStyles.detailLabel}>하의 :</Text> {details.bottomWear}</Text>
              <Text style={detailStyles.detailLine}><Text style={detailStyles.detailLabel}>체형 :</Text> {details.bodyType}</Text>
              <Text style={detailStyles.detailLine}><Text style={detailStyles.detailLabel}>기타 :</Text> {details.otherFeature}</Text>

              <View style={detailStyles.separatorLine} />

              <Text style={detailStyles.detailLine}><Text style={detailStyles.detailLabel}>키 :</Text> {details.height}</Text>
              <Text style={detailStyles.detailLine}><Text style={detailStyles.detailLabel}>몸무게 :</Text> {details.weight}</Text>
            </View>
          </View>
        </View>

        {/* 현재 모습 예측 */}
        <View style={detailStyles.section}>
          <Text style={detailStyles.sectionTitle}>현재 모습 예측</Text>
          <View style={detailStyles.descriptionContent}>
            <Image source={{ uri: currentLookImageSource }} style={detailStyles.currentLookImage} />
            <View style={detailStyles.currentLookDetails}>
              <Text style={detailStyles.currentLookLine}>
                <Text style={detailStyles.detailLabel}>나이 :</Text> {details.currentAge}세
              </Text>
            </View>
          </View>
        </View>

        <View style={{ height: 100 }} />

        {/* 신고 버튼 */}
        <View style={detailStyles.reportButtonContainer}>
          <TouchableOpacity style={detailStyles.reportButton} onPress={handleReport}>
            <Text style={detailStyles.reportButtonText}>신고하기</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
};

export default DetailScreen;
