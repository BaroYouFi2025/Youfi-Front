import React from 'react';
import { Modal, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { styles } from './police_detail.style';
import { PoliceOffice } from '@/types/PoliceOfficeTypes';

type SuccessReportModalProps = {
  visible: boolean;
  onClose: () => void;
  onFindPolice: () => void;
  isFindingPolice: boolean;
  office?: PoliceOffice | null;
  errorMessage?: string | null;
};

const SuccessReportModal: React.FC<SuccessReportModalProps> = ({
  visible,
  onClose,
  onFindPolice,
  isFindingPolice,
  office,
  errorMessage,
}) => (
  <Modal
    animationType="fade"
    transparent
    visible={visible}
    onRequestClose={onClose}
  >
    <View style={styles.centeredView}>
      <TouchableOpacity
        style={styles.overlayDismissArea}
        activeOpacity={1}
        onPress={onClose}
      />

      <View style={styles.successModalView}>
        <Text style={styles.successMessageTitle}>신고해주셔서 감사합니다</Text>
        <Text style={styles.successMessageSubtitle}>필요 시 인근 경찰청으로 길안내해 드릴게요.</Text>

        {office ? (
          <View style={styles.officeCard}>
            <Text style={styles.officeTitle}>{office.officeName || office.station}</Text>
            <Text style={styles.officeSubtitle}>
              {office.officeType}
              {office.distanceKm !== undefined ? ` • 약 ${office.distanceKm.toFixed(1)}km` : ''}
            </Text>
            <Text style={styles.officeMeta}>{office.address}</Text>
            {office.phoneNumber ? <Text style={styles.officeMeta}>{office.phoneNumber}</Text> : null}
          </View>
        ) : (
          <Text style={styles.officePlaceholder}>버튼을 눌러 가까운 경찰청을 확인해 주세요.</Text>
        )}

        {errorMessage ? <Text style={styles.successErrorText}>{errorMessage}</Text> : null}

        <TouchableOpacity
          style={[styles.findPoliceButton, isFindingPolice && styles.findPoliceButtonDisabled]}
          onPress={onFindPolice}
          disabled={isFindingPolice}
        >
          {isFindingPolice ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.findPoliceButtonText}>가까운 경찰청 찾기</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

export default SuccessReportModal;
