import React from 'react';
import { Modal, View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { styles } from './police_detail.style';

type ConfirmReportModalProps = {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  name?: string;
  ageAtTime?: string;
  avatar?: any;
  isSubmitting?: boolean;
  errorMessage?: string | null;
};

const PERSON_IMAGE = require('../../assets/images/people.png');

const ConfirmReportModal: React.FC<ConfirmReportModalProps> = ({
  visible,
  onCancel,
  onConfirm,
  name,
  ageAtTime,
  avatar,
  isSubmitting,
  errorMessage,
}) => (
  <Modal
    animationType="fade"
    transparent
    visible={visible}
    onRequestClose={onCancel}
  >
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        <Text style={styles.modalTitle}>정말 신고하시겠습니까?</Text>

        <View style={styles.modalPersonInfoRow}>
          <Image source={avatar || PERSON_IMAGE} style={styles.modalProfileImage} />
          <View style={styles.modalTextGroup}>
            <Text style={styles.modalNameText}>{name || '이름 미상'}(남)</Text>
            <Text style={styles.modalAgeText}>{ageAtTime || ''}(당시)</Text>
          </View>
        </View>

        <Text style={styles.modalDescription}>
          확인 시 실종자 발견 점수를 위해 182번으로 연결됩니다.
        </Text>

        {errorMessage ? (
          <Text style={styles.modalErrorText}>{errorMessage}</Text>
        ) : null}

        <View style={styles.modalButtonContainer}>
          <TouchableOpacity
            style={[styles.modalButton, styles.cancelButton]}
            onPress={onCancel}
            disabled={isSubmitting}
          >
            <Text style={styles.cancelButtonText}>취소</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modalButton, styles.confirmButton]}
            onPress={onConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.confirmButtonText}>확인</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

export default ConfirmReportModal;
