import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { styles } from './police_detail.style';

type SuccessReportModalProps = {
  visible: boolean;
  onClose: () => void;
};

const SuccessReportModal: React.FC<SuccessReportModalProps> = ({ visible, onClose }) => (
  <Modal
    animationType="fade"
    transparent
    visible={visible}
    onRequestClose={onClose}
  >
    <View style={styles.centeredView}>
      <TouchableOpacity
        style={{ position: 'absolute', inset: 0 }}
        activeOpacity={1}
        onPress={onClose}
      />

      <View style={styles.successModalView}>
        <Text style={styles.successMessageTitle}>신고 해주셔서 감사합니다</Text>
        <Text style={styles.successMessageSubtitle}>빈곳을 클릭해주세요</Text>
      </View>
    </View>
  </Modal>
);

export default SuccessReportModal;
