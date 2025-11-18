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
`;

export const TitleRow = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 0 16px;
  margin-bottom: 20px;
`;

export const Title = styled.Text`
  font-size: 24px;
  font-weight: 700;
  color: #16171a;
  margin-right: 4px;
`;

export const MapCard = styled.View`
  margin: 0 16px 24px;
  border-radius: 20px;
  overflow: hidden;
  background-color: #eaf6ff;
  height: 280px;
  shadow-color: #000000;
  shadow-opacity: 0.12;
  shadow-radius: 12px;
  shadow-offset: 0px 8px;
  elevation: 6;
`;

export const PersonSection = styled.View`
  margin: 0 16px;
  border-radius: 16px;
  background-color: #ffffff;
`;

export const PersonRow = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 16px;
`;

export const Avatar = styled.View`
  width: 52px;
  height: 52px;
  border-radius: 12px;
  background-color: #545454;
  margin-right: 16px;
`;

export const PersonContent = styled.View`
  flex: 1;
`;

export const NameRow = styled.View`
  flex-direction: row;
  align-items: baseline;
  margin-bottom: 8px;
`;

export const PersonName = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #16171a;
`;

export const SeparatorDot = styled.Text`
  margin: 0 6px;
  font-size: 14px;
  color: #848587;
`;

export const DistanceText = styled.Text`
  font-size: 14px;
  font-weight: 500;
  color: #848587;
`;

export const BatteryChip = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 4px 10px;
  border-radius: 14px;
  background-color: rgba(36, 200, 121, 0.12);
  align-self: flex-start;
`;

export const BatteryText = styled.Text`
  margin-left: 6px;
  font-size: 12px;
  font-weight: 600;
  color: #24c879;
`;

export const Divider = styled.View`
  height: 1px;
  background-color: #f2f3f4;
  margin: 0 16px;
`;

export const Spacer = styled.View`
  height: 48px;
`;
