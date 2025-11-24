import { LinearGradient } from 'expo-linear-gradient';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';

type NotificationContainerProps = {
  isUnread?: boolean;
  isSelected?: boolean;
};

export const NotificationItemContainer = styled.View<NotificationContainerProps>`
  padding: 20px;
  background-color: ${({ isSelected, isUnread }: NotificationContainerProps) => {
    if (isSelected) return '#f4f4f4';
    if (isUnread) return '#ffffff';
    return '#ffffff';
  }};
  border-radius: 20px;
  position: relative;
  overflow: hidden;
  border-width: ${({ isSelected }: NotificationContainerProps) => (isSelected ? 1 : 0)}px;
  border-color: #25b2e2;
  shadow-color: #969696;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 4px;
  elevation: 3;
  margin-bottom: 12px;
`;

export const ReadNotificationOverlay = styled(LinearGradient).attrs({
  colors: ['rgba(0, 0, 0, 0.03)', 'transparent'],
  start: { x: 0, y: 0 },
  end: { x: 0, y: 1 },
})`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  z-index: 1;
`;

export const NotificationHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;

export const NotificationIconContainer = styled.View`
  width: 40px;
  height: 40px;
  margin-right: 12px;
  position: relative;
  justify-content: center;
  align-items: center;
`;

export const NotificationIcon = styled(LinearGradient).attrs({
  colors: ['#cef1fc', '#2ccbff'],
  start: { x: 0, y: 0 },
  end: { x: 0, y: 1 },
})`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

export const NotificationUnreadDot = styled.View`
  position: absolute;
  top: 0;
  right: 0;
  width: 8px;
  height: 8px;
  background-color: #25b2e2;
  border-radius: 4px;
  border-width: 2px;
  border-color: #ffffff;
`;

export const NotificationHeaderText = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const NotificationTitleText = styled.Text`
  font-size: 14px;
  font-weight: 700;
  color: #16171a;
  flex: 1;
  font-family: 'Wanted Sans';
  letter-spacing: -0.14px;
`;

export const NotificationTime = styled.Text`
  font-size: 12px;
  color: #949494;
  margin-left: 8px;
  font-family: 'Wanted Sans';
  font-weight: 400;
`;

export const NotificationMessage = styled.Text`
  font-size: 12px;
  font-weight: 400;
  color: #16171a;
  margin-bottom: 8px;
  line-height: 18px;
  font-family: 'Wanted Sans';
  letter-spacing: -0.12px;
`;

export const NotificationActions = styled.View`
  flex-direction: row;
  gap: 12px;
  align-self: flex-end;
  margin-top: 6px;
`;

export const AcceptButton = styled(TouchableOpacity)`
  padding-vertical: 4px;
`;

export const RejectButton = styled(TouchableOpacity)`
  padding-vertical: 4px;
`;

export const DetailButton = styled(TouchableOpacity)`
  background-color: #f9fdfe;
  border: 1px solid #25b2e2;
  border-radius: 8px;
  padding: 8px 16px;
  align-self: flex-end;
  margin-top: 4px;
`;

export const ActionButtonText = styled.Text`
  font-size: 12px;
  font-weight: 600;
  font-family: 'Wanted Sans';
  letter-spacing: -0.12px;
`;

// 실종자 발견 알림 전용 스타일
type FoundReportProps = {
  isSelected?: boolean;
};

export const FoundReportContainer = styled.View<FoundReportProps>`
  background-color: ${({ isSelected }: FoundReportProps) => (isSelected ? '#f4f4f4' : '#ffffff')};
  border-radius: 20px;
  padding: 16px 21px;
  margin-bottom: 12px;
  shadow-color: #969696;
  position: relative;
  overflow: hidden;
  shadow-offset: 0px -1px;
  shadow-opacity: 0.25;
  shadow-radius: 4px;
  elevation: 3;
  border-width: ${({ isSelected }: FoundReportProps) => (isSelected ? 1 : 0)}px;
  border-color: #25b2e2;
`;

export const FoundReportTitleRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
`;

export const FoundReportIconContainer = styled.View`
  width: 28.8px;
  height: 28.8px;
  position: relative;
  justify-content: center;
  align-items: center;
`;

export const FoundReportIconGradient = styled.View`
  width: 28.8px;
  height: 28.8px;
  position: relative;
  transform: rotate(314.314deg);
`;


export const FoundReportMessageRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 16px;
  margin-left: 40.8px;
  flex-wrap: wrap;
`;

// 관계 선택 모달 스타일
export const RelationModalOverlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

export const RelationModalContent = styled.View`
  background-color: #ffffff;
  border-radius: 20px;
  padding: 24px;
  width: 100%;
  max-width: 400px;
  max-height: 80%;
`;

export const RelationModalTitle = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: #16171a;
  margin-bottom: 20px;
  text-align: center;
  font-family: 'Wanted Sans';
  letter-spacing: -0.2px;
`;

export const RelationOption = styled(TouchableOpacity)`
  padding: 16px;
  border-bottom-width: 1px;
  border-bottom-color: #f2f3f4;
`;

export const RelationOptionText = styled.Text`
  font-size: 16px;
  color: #16171a;
  font-family: 'Wanted Sans';
  font-weight: 500;
`;

export const RelationModalCloseButton = styled(TouchableOpacity)`
  margin-top: 20px;
  padding: 12px;
  background-color: #f2f3f4;
  border-radius: 8px;
  align-items: center;
`;

export const RelationModalCloseText = styled.Text`
  font-size: 16px;
  color: #16171a;
  font-family: 'Wanted Sans';
  font-weight: 600;
`;

export const NotificationSelectableArea = styled(TouchableOpacity)`
  width: 100%;
  padding-vertical: 4px;
`;


