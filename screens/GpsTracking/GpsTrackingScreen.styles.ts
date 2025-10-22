import styled from 'styled-components/native';
import { TouchableOpacity, ImageBackground, Text, View, Image } from 'react-native';

export const Container = styled.View`
  flex: 1;
  background-color: #ffffff;
`;

export const StatusBarContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-horizontal: 16px;
  padding-top: 21px;
  height: 54px;
  background-color: #ffffff;
`;

export const StatusBarTime = styled.Text`
  font-family: 'SF Pro';
  font-weight: 600;
  font-size: 17px;
  color: #000000;
`;

export const StatusBarIcons = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 7px;
`;

export const StatusIcon = styled(Image)`
  width: 20px;
  height: 12px;
`;

export const HeaderContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-horizontal: 24px;
  padding-vertical: 8px;
`;

export const AddButton = styled(TouchableOpacity)`
  background-color: #25b2e2;
  border-radius: 16px;
  padding-horizontal: 8px;
  padding-vertical: 2px;
  align-items: center;
  justify-content: center;
`;

export const AddIcon = styled(Text)`
  font-weight: 300;
  font-size: 24px;
  color: #ffffff;
  line-height: 24px;
`;

export const ContentArea = styled.View`
  flex: 1;
  padding-horizontal: 16px;
`;

export const MapContainer = styled.View`
  height: 371px;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 20px;
  shadow-color: #000000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.12;
  shadow-radius: 4px;
  elevation: 4;
  position: relative;
`;

export const MapImage = styled(ImageBackground)`
  width: 100%;
  height: 100%;
`;

export const PersonCard = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 16px;
  height: 80px;
  background-color: #ffffff;
  border-bottom-width: 1px;
  border-bottom-color: #f2f3f4;
  gap: 16px;
`;

export const PersonImage = styled(View)`
  width: 48px;
  height: 48px;
  background-color: #545454;
`;

export const PersonInfo = styled.View`
  flex: 1;
  gap: 8px;
`;

export const PersonName = styled(Text)`
  font-weight: 500;
  font-size: 15px;
  color: #16171a;
  line-height: 17px;
`;

export const PersonRelation = styled(Text)`
  background-color: #ffffff;
  border: 1px solid #4dc0e7;
  border-radius: 15px;
  padding-horizontal: 12px;
  padding-vertical: 3px;
  align-self: flex-start;
  font-weight: 500;
  font-size: 10px;
  color: #000000;
  text-align: center;
  line-height: 13px;
`;

export const BatterySection = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

export const BatteryIcon = styled(Image)`
  width: 27px;
  height: 13px;
`;

export const BatteryText = styled(Text)`
  font-weight: 500;
  font-size: 10px;
  color: #16171a;
  line-height: 13px;
`;

export const Distance = styled(Text)`
  font-weight: 500;
  font-size: 15px;
  color: #848587;
  line-height: 17px;
`;

export const ReportButton = styled(TouchableOpacity)`
  background-color: #ff6f61;
  border-radius: 16px;
  height: 48px;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
`;

export const ReportButtonText = styled(Text)`
  font-weight: 700;
  font-size: 20px;
  color: #ffffff;
  line-height: 22px;
`;

export const RefreshButton = styled(TouchableOpacity)`
  background-color: #25b2e2;
  border-radius: 16px;
  height: 48px;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

export const RefreshButtonText = styled(Text)`
  font-weight: 700;
  font-size: 20px;
  color: #ffffff;
  line-height: 22px;
`;

export const TabBar = styled.View`
  height: 83px;
  background-color: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(25px);
  border-top-width: 0.333px;
  border-top-color: rgba(0, 0, 0, 0.3);
`;

export const TabBarContent = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-top: 7px;
  height: 47px;
`;

export const TabButton = styled(TouchableOpacity)<{ active?: boolean }>`
  flex: 1;
  align-items: center;
  justify-content: center;
  height: 40px;
`;

export const TabIcon = styled(Text)`
  font-weight: 300;
  font-size: 24px;
  margin-bottom: 2px;
`;

export const TabText = styled(Text)<{ active?: boolean }>`
  font-weight: ${(props: { active?: boolean }) => props.active ? '400' : '500'};
  font-size: 10px;
  color: ${(props: { active?: boolean }) => props.active ? '#25b2e2' : '#848587'};
  text-align: center;
  line-height: 10px;
`;