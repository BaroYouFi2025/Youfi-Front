import React from 'react';
import { Modal, Text, TouchableOpacity } from 'react-native';
import { detailStyles } from './detail.styles';

type SuccessReportModalProps = {
  visible: boolean;
  onClose: () => void;
};

const SuccessReportModal: React.FC<SuccessReportModalProps> = ({ visible, onClose }) => (
  <Modal animationType="fade" transparent visible={visible}>
    <TouchableOpacity
      style={detailStyles.modalOverlay}
      activeOpacity={1}
      onPress={onClose}
    >
      <TouchableOpacity style={detailStyles.successModalBox} activeOpacity={1}>
        <Text style={detailStyles.successTitle}>신고 해주셔서 감사합니다</Text>
        <Text style={detailStyles.successSubtitle}>빈 곳을 클릭해주세요</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  </Modal>
);

export default SuccessReportModal;
