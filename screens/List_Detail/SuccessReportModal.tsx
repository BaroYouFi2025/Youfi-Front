import React from 'react';
import { Modal, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { detailStyles } from './detail.styles';
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
    <View style={detailStyles.centeredView}>
      <TouchableOpacity
        style={detailStyles.overlayDismissArea}
        activeOpacity={1}
        onPress={onClose}
      />

      <View style={detailStyles.successModalView}>
        <Text style={detailStyles.successMessageTitle}>신고해주셔서 감사합니다</Text>
        <Text style={detailStyles.successMessageSubtitle}>필요 시 인근 경찰청으로 길안내해 드릴게요.</Text>

        {office ? (
          <View style={detailStyles.officeCard}>
            <Text style={detailStyles.officeTitle}>{office.officeName || office.station}</Text>
            <Text style={detailStyles.officeSubtitle}>
              {office.officeType}
              {office.distanceKm !== undefined ? ` • 약 ${office.distanceKm.toFixed(1)}km` : ''}
            </Text>
            <Text style={detailStyles.officeMeta}>{office.address}</Text>
            {office.phoneNumber ? <Text style={detailStyles.officeMeta}>{office.phoneNumber}</Text> : null}
          </View>
        ) : (
          <Text style={detailStyles.officePlaceholder}>버튼을 눌러 가까운 경찰청을 확인해 주세요.</Text>
        )}

        {errorMessage ? <Text style={detailStyles.successErrorText}>{errorMessage}</Text> : null}

        <TouchableOpacity
          style={[detailStyles.findPoliceButton, isFindingPolice && detailStyles.findPoliceButtonDisabled]}
          onPress={onFindPolice}
          disabled={isFindingPolice}
        >
          {isFindingPolice ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={detailStyles.findPoliceButtonText}>가까운 경찰청 찾기</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

export default SuccessReportModal;
