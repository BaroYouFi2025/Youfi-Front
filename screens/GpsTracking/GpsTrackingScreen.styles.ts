import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

export const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: #ffffff;
`;

export const ScreenScroll = styled(ScrollView).attrs(() => ({
  contentContainerStyle: {
    paddingBottom: 32,
  },
  showsVerticalScrollIndicator: false,
}))`
  flex: 1;
`;

export const Header = styled.View`
  padding: 20px 16px 12px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const AddButton = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: 0.85,
}))`
  width: 40px;
  height: 40px;
  border-radius: 16px;
  background-color: #25b2e2;
  align-items: center;
  justify-content: center;
  shadow-color: #000000;
  shadow-opacity: 0.12;
  shadow-radius: 8px;
  shadow-offset: 0px 4px;
  elevation: 4;
`;

export const MapCard = styled.View`
  margin: 0 16px 20px;
  border-radius: 16px;
  overflow: hidden;
  background-color: #eaf6ff;
  height: 371px;
  shadow-color: #000000;
  shadow-opacity: 0.12;
  shadow-radius: 12px;
  shadow-offset: 0px 8px;
  elevation: 6;
`;

export const PersonSection = styled.View`
  margin: 0 16px;
  padding: 12px 0 4px;
  background-color: #ffffff;
`;

export const PersonRow = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 8px 0;
`;

export const Avatar = styled.View`
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background-color: #545454;
  margin-right: 16px;
`;

export const PersonContent = styled.View`
  flex: 1;
`;

export const NameRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

export const NameGroup = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const PersonName = styled.Text`
  font-size: 15px;
  font-weight: 500;
  color: #16171a;
`;

export const LabelBadge = styled.View`
  margin-left: 8px;
  padding: 2px 10px;
  height: 20px;
  border-radius: 15px;
  border: 1px solid #4dc0e7;
  align-items: center;
  justify-content: center;
`;

export const LabelText = styled.Text`
  font-size: 10px;
  font-weight: 500;
  color: #000000;
`;

export const DistanceText = styled.Text`
  font-size: 15px;
  font-weight: 500;
  color: #848587;
`;

export const BatteryRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const BatteryText = styled.Text`
  margin-left: 8px;
  font-size: 10px;
  font-weight: 500;
  color: #16171a;
`;

export const Divider = styled.View`
  height: 1px;
  background-color: #f2f3f4;
  margin: 12px 16px 0;
`;

export const ActionsContainer = styled.View`
  margin: 24px 16px 0;
`;

export const ActionButton = styled.TouchableOpacity.attrs<{ $variant: 'alert' | 'refresh' }>(() => ({
  activeOpacity: 0.9,
}))<{ $variant: 'alert' | 'refresh' }>`
  padding: 13px 16px;
  border-radius: 16px;
  background-color: ${({ $variant }) => ($variant === 'alert' ? '#ff6f61' : '#25b2e2')};
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
`;

export const ActionButtonText = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
`;

export const Spacer = styled.View`
  height: 24px;
`;
