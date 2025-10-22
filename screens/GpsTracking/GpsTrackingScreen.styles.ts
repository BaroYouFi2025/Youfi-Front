import styled from 'styled-components/native';
import { ImageBackground, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
  shadow-color: #000000;
  shadow-opacity: 0.12;
  shadow-radius: 12px;
  shadow-offset: 0px 8px;
  elevation: 6;
`;

export const MapImage = styled(ImageBackground)`
  width: 100%;
  height: 280px;
  justify-content: center;
  align-items: center;
`;

export const MarkerWrapper = styled.View`
  width: 140px;
  height: 140px;
  align-items: center;
  justify-content: center;
`;

export const MarkerPulse = styled.View`
  position: absolute;
  width: 140px;
  height: 140px;
  border-radius: 70px;
  background-color: rgba(37, 178, 226, 0.25);
`;

export const MarkerIcon = styled.View`
  width: 64px;
  height: 64px;
  border-radius: 24px;
  background-color: #25b2e2;
  align-items: center;
  justify-content: center;
  shadow-color: #25b2e2;
  shadow-opacity: 0.32;
  shadow-radius: 10px;
  shadow-offset: 0px 6px;
  elevation: 8;
`;

export const MarkerCallout = styled.View`
  position: absolute;
  right: -50px;
  top: -10px;
  width: 72px;
  height: 56px;
  border-radius: 18px;
  background-color: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(22, 23, 26, 0.1);
  shadow-color: #000000;
  shadow-opacity: 0.12;
  shadow-radius: 6px;
  shadow-offset: 0px 3px;
  elevation: 4;
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
