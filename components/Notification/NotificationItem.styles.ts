import { LinearGradient } from 'expo-linear-gradient';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';

type NotificationContainerProps = {
  isUnread?: boolean;
  isSelected?: boolean;
  isLast?: boolean;
  index?: number;
  totalCount?: number;
};

export const NotificationItemContainer = styled.View<NotificationContainerProps>`
  height: 80px;
  padding: 16px 21px;
  flex-direction: row;
  align-items: center;
  background-color: ${({ isSelected, isUnread }: NotificationContainerProps) => {
    if (isSelected) return '#eaf7ff';
    if (isUnread) return '#f9fdfe';
    return '#f5f5f5';
  }};
  border-radius: 20px;
  position: absolute;
  left: 10px;
  right: 10px;
  overflow: hidden;
  border-width: ${({ isSelected }: NotificationContainerProps) => (isSelected ? 1 : 0)}px;
  border-color: #25b2e2;
  shadow-color: #969696;
  shadow-offset: 0px -1px;
  shadow-opacity: 0.25;
  shadow-radius: 4px;
  elevation: 3;
  top: ${({ index }: NotificationContainerProps) => `${10 - (index || 0) * 30}px`};
  opacity: ${({ isUnread }: NotificationContainerProps) => {
    // 읽은 알림은 약간 투명하게, 안 읽은 알림은 완전 불투명
    return isUnread ? 1 : 0.6;
  }};
  transform: ${({ isUnread, index, totalCount }: NotificationContainerProps) => {
    if (isUnread) return 'scale(1) translateY(0px)';
    // 읽은 알림은 뒤로 갈수록 작고 위로 밀려나게
    const readIndex = (index || 0) - (totalCount || 0);
    if (readIndex < 0) return 'scale(0.95) translateY(-2px)';
    if (readIndex === 0) return 'scale(0.93) translateY(-4px)';
    const scale = Math.max(0.85, 0.93 - readIndex * 0.03);
    const translateY = -(4 + readIndex * 2);
    return `scale(${scale}) translateY(${translateY}px)`;
  }};
  z-index: ${({ isSelected, isUnread, index }: NotificationContainerProps) => {
    if (isSelected) return 100;
    // 위에 있는 알림(작은 index)이 더 높은 z-index
    if (isUnread) return 50 - (index || 0);
    return 50 - (index || 0);
  }};
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
  margin-bottom: 0px;
`;

export const NotificationIconContainer = styled.View`
  width: 40.72px;
  height: 40.72px;
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
  width: 40.72px;
  height: 40.72px;
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
  align-items: flex-end;
  justify-content: space-between;
  height: 22px;
  margin-bottom: 8px;
`;

export const NotificationTitleText = styled.Text<{ isUnread?: boolean }>`
  font-size: 20px;
  font-weight: 700;
  color: ${({ isUnread }: { isUnread?: boolean }) => (isUnread ? '#16171a' : '#949494')};
  flex: 1;
  font-family: 'Wanted Sans';
  letter-spacing: -0.2px;
  line-height: 22px;
`;

export const NotificationTime = styled.Text`
  font-size: 10px;
  color: #949494;
  margin-left: 8px;
  font-family: 'Wanted Sans';
  font-weight: 400;
  line-height: 13px;
`;

export const NotificationMessage = styled.Text<{ isUnread?: boolean }>`
  font-size: 14px;
  font-weight: 500;
  color: ${({ isUnread }: { isUnread?: boolean }) => (isUnread ? '#16171a' : '#949494')};
  margin-bottom: 0px;
  line-height: 18px;
  font-family: 'Wanted Sans';
  letter-spacing: -0.14px;
`;

export const NotificationActions = styled.View`
  flex-direction: row;
  gap: 12px;
  align-items: center;
  margin-left: 16px;
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
  font-size: 13px;
  font-weight: 500;
  font-family: 'Wanted Sans';
  letter-spacing: -0.13px;
  line-height: 16px;
`;

// 실종자 발견 알림 전용 스타일
type FoundReportProps = {
  isSelected?: boolean;
  isLast?: boolean;
};

export const FoundReportContainer = styled.View<FoundReportProps & { index?: number; totalCount?: number; isUnread?: boolean }>`
  height: 80px;
  padding: 16px 21px;
  flex-direction: row;
  align-items: center;
  background-color: ${({ isSelected, isUnread }: { isSelected?: boolean; isUnread?: boolean }) => {
    if (isSelected) return '#eaf7ff';
    if (isUnread) return '#ffffff';
    return '#f5f5f5';
  }};
  border-radius: 20px;
  position: absolute;
  left: 10px;
  right: 10px;
  overflow: hidden;
  shadow-color: #969696;
  shadow-offset: 0px -1px;
  shadow-opacity: 0.25;
  shadow-radius: 4px;
  elevation: 3;
  border-width: ${({ isSelected }: FoundReportProps) => (isSelected ? 1 : 0)}px;
  border-color: #25b2e2;
  top: ${({ index = 0 }: { index?: number }) => `${10 - index * 30}px`};
  opacity: ${({ isUnread }: { isUnread?: boolean }) => {
    return isUnread ? 1 : 0.6;
  }};
  transform: ${({ isSelected, index = 0, totalCount = 0 }: { isSelected?: boolean; index?: number; totalCount?: number }) => {
    if (isSelected) return 'scale(1) translateY(0px)';
    const readIndex = index - totalCount;
    if (readIndex < 0) return 'scale(0.95) translateY(-2px)';
    if (readIndex === 0) return 'scale(0.93) translateY(-4px)';
    const scale = Math.max(0.85, 0.93 - readIndex * 0.03);
    const translateY = -(4 + readIndex * 2);
    return `scale(${scale}) translateY(${translateY}px)`;
  }};
  z-index: ${({ isSelected, index = 0 }: { isSelected?: boolean; index?: number }) => {
    if (isSelected) return 100;
    return 50 - index;
  }};
`;

export const FoundReportTitleRow = styled.View`
  flex-direction: row;
  align-items: flex-end;
  gap: 8px;
  height: 22px;
  margin-bottom: 8px;
`;

export const FoundReportIconContainer = styled.View`
  width: 40.72px;
  height: 40.72px;
  margin-right: 12px;
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
  margin-top: 0px;
  height: 18px;
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
  flex: 1;
  flex-direction: column;
  justify-content: center;
  height: 80px;
  padding-vertical: 16px;
`;


