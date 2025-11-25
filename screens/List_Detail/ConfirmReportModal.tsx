import React from 'react';
import { Modal, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { detailStyles } from './detail.styles';

type ConfirmReportModalProps = {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  isSubmitting?: boolean;
  errorMessage?: string | null;
};

const ConfirmReportModal: React.FC<ConfirmReportModalProps> = ({ 
  visible, 
  onCancel, 
  onConfirm,
  isSubmitting = false,
  errorMessage,
}) => (
  <Modal animationType="fade" transparent visible={visible}>
    <View style={detailStyles.modalOverlay}>
      <View style={detailStyles.modalBox}>
        <Text style={detailStyles.modalTitle}>정말 신고하시겠습니까?</Text>

        <Text style={detailStyles.modalDesc}>
          확인 시 실종자 발견 점수를 위해 182번으로 연결됩니다.
        </Text>

        {errorMessage ? (
          <Text style={{ color: '#ff6347', fontSize: 13, marginBottom: 10, textAlign: 'center' }}>
            {errorMessage}
          </Text>
        ) : null}

        <View style={detailStyles.modalButtonRow}>
          <TouchableOpacity
            style={[detailStyles.modalButton, detailStyles.cancelButton]}
            onPress={onCancel}
            disabled={isSubmitting}
          >
            <Text style={detailStyles.modalButtonText}>취소</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[detailStyles.modalButton, detailStyles.confirmButton]}
            onPress={onConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={detailStyles.modalButtonText}>확인</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

export default ConfirmReportModal;
