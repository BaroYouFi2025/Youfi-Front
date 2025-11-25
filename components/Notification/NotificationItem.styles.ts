import { LinearGradient } from 'expo-linear-gradient';
import { TouchableOpacity } from 'react-native';
import styledComponents from 'styled-components/native';

type NotificationContainerProps = {
  isUnread?: boolean;
  isSelected?: boolean;
  isLast?: boolean;
  index?: number;
  totalCount?: number;
  isActive?: boolean;
};

export const NotificationItemContainer = styledComponents.View<NotificationContainerProps>`
  padding: 20px;
  background-color: ${({ isSelected, isUnread }: NotificationContainerProps) => {
    if (isSelected) return '#eaf7ff';
    if (isUnread) return '#f9fdfe';
    return '#f5f5f5';
  }};
  border-radius: 12px;
  position: relative;
  width: 100%;
  overflow: visible;
  border-width: 1px;
  border-color: #e5e7eb;
  shadow-color: #000000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 2;
`;

export const ReadNotificationOverlay = styledComponents(LinearGradient).attrs({
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

export const NotificationHeader = styledComponents.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 0px;
`;

export const NotificationIconContainer = styledComponents.View`
  width: 40px;
  height: 40px;
  margin-right: 12px;
  position: relative;
  justify-content: center;
  align-items: center;
`;

export const NotificationIcon = styledComponents(LinearGradient).attrs({
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

export const NotificationUnreadDot = styledComponents.View`
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

export const NotificationHeaderText = styledComponents.View`
  flex: 1;
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 4px;
`;

export const NotificationTitleText = styledComponents.Text<{ isUnread?: boolean }>`
  font-size: 14px;
  font-weight: 700;
  color: ${({ isUnread }: { isUnread?: boolean }) => (isUnread ? '#16171a' : '#949494')};
  font-family: 'Wanted Sans';
  letter-spacing: -0.2px;
  line-height: 22px;
  flex-shrink: 1;
`;

export const NotificationTime = styledComponents.Text`
  font-size: 12px;
  color: #949494;
  margin-left: 8px;
  font-family: 'Wanted Sans';
  font-weight: 400;
  line-height: 13px;
`;

export const NotificationMessage = styledComponents.Text`
  font-size: 12px;
  font-weight: 400;
  color: #16171a;
  margin-bottom: 8px;
  line-height: 18px;
  font-family: 'Wanted Sans';
  letter-spacing: -0.14px;
  flex-shrink: 1;
`;

export const NotificationActions = styledComponents.View`
  flex-direction: row;
  gap: 12px;
  align-items: center;
  margin-left: 16px;
`;

export const AcceptButton = styledComponents(TouchableOpacity)`
  padding-vertical: 4px;
`;

export const RejectButton = styledComponents(TouchableOpacity)`
  padding-vertical: 4px;
`;

export const DetailButton = styledComponents(TouchableOpacity)`
  background-color: #f9fdfe;
  border: 1px solid #25b2e2;
  border-radius: 8px;
  padding: 8px 16px;
  align-self: flex-end;
  margin-top: 4px;
`;

export const ActionButtonText = styledComponents.Text`
  font-size: 12px;
  font-weight: 600;
  font-family: 'Wanted Sans';
  letter-spacing: -0.13px;
  line-height: 16px;
`;

// 실종자 발견 알림 전용 스타일
type FoundReportProps = {
  isSelected?: boolean;
  isLast?: boolean;
};

export const FoundReportContainer = styledComponents.View<FoundReportProps & { index?: number; totalCount?: number; isUnread?: boolean }>`
  padding: 16px 21px;
  flex-direction: row;
  align-items: flex-start;
  background-color: ${({ isUnread }: { isUnread?: boolean }) => {
    return isUnread ? '#ffffff' : '#f5f5f5';
  }};
  border-radius: 12px;
  position: relative;
  width: 100%;
  overflow: visible;
  border-width: 1px;
  border-color: #e5e7eb;
  shadow-color: #000000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 2;
`;

export const FoundReportTitleRow = styledComponents.View`
  flex-direction: row;
  align-items: flex-end;
  gap: 8px;
  margin-bottom: 8px;
  min-height: 22px;
`;

export const FoundReportIconContainer = styledComponents.View`
  width: 28.8px;
  height: 28.8px;
  position: relative;
  justify-content: center;
  align-items: center;
`;

export const FoundReportIconGradient = styledComponents.View`
  width: 28.8px;
  height: 28.8px;
  position: relative;
  transform: rotate(314.314deg);
`;


export const FoundReportMessageRow = styledComponents.View`
  flex-direction: row;
  align-items: center;
  gap: 16px;
  margin-top: 0px;
  height: 18px;
  flex-wrap: wrap;
`;

// 관계 선택 모달 스타일
export const RelationModalOverlay = styledComponents.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

export const RelationModalContent = styledComponents.View`
  background-color: #ffffff;
  border-radius: 20px;
  padding: 24px;
  width: 100%;
  max-width: 400px;
  max-height: 80%;
`;

export const RelationModalTitle = styledComponents.Text`
  font-size: 20px;
  font-weight: 700;
  color: #16171a;
  margin-bottom: 20px;
  text-align: center;
  font-family: 'Wanted Sans';
  letter-spacing: -0.2px;
`;

export const RelationOption = styledComponents(TouchableOpacity)`
  padding: 16px;
  border-bottom-width: 1px;
  border-bottom-color: #f2f3f4;
`;

export const RelationOptionText = styledComponents.Text`
  font-size: 16px;
  color: #16171a;
  font-family: 'Wanted Sans';
  font-weight: 500;
`;

export const RelationModalCloseButton = styledComponents(TouchableOpacity)`
  margin-top: 20px;
  padding: 12px;
  background-color: #f2f3f4;
  border-radius: 8px;
  align-items: center;
`;

export const RelationModalCloseText = styledComponents.Text`
  font-size: 16px;
  color: #16171a;
  font-family: 'Wanted Sans';
  font-weight: 600;
`;

export const NotificationSelectableArea = styledComponents(TouchableOpacity)`
  width: 100%;
  padding-vertical: 4px;
`;
