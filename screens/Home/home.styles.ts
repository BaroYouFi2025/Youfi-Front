 
import { ImageBackground, SafeAreaView, ScrollView } from 'react-native';
// eslint-disable-next-line import/no-named-as-default
import styled from 'styled-components/native';

export const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: #ffffff;
`;

export const ScrollContainer = styled(ScrollView)`
  flex: 1;
`;

export const HeaderContainer = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 16px;
  padding-top: 16px;
`;

export const LogoContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const LogoSquareContainer = styled.View`
  width: 28.8px;
  height: 28.8px;
  margin-right: 8px;
`;

export const LogoSquare1 = styled.View`
  position: absolute;
  width: 28.8px;
  height: 28.8px;
  background: linear-gradient(180deg, #cef1fc 0%, #2ccbff 100%);
  border-radius: 6px;
  transform: rotate(314.314deg);
`;

export const LogoSquare2 = styled.View`
  position: absolute;
  width: 22.629px;
  height: 22.628px;
  background: linear-gradient(180deg, #cef1fc 0%, #2ccbff 100%);
  border-radius: 6px;
  transform: rotate(314.314deg);
  left: 4.42px;
  top: 8.73px;
`;

export const LogoSquare3 = styled.View`
  position: absolute;
  width: 18.514px;
  height: 18.514px;
  background: linear-gradient(180deg, #cef1fc 0%, #2ccbff 100%);
  border-radius: 6px;
  transform: rotate(314.314deg);
  left: 7.36px;
  top: 14.55px;
`;

export const LogoSquare4 = styled.View`
  position: absolute;
  width: 14.4px;
  height: 14.4px;
  background: linear-gradient(180deg, #cef1fc 0%, #2ccbff 100%);
  border-radius: 4.8px;
  transform: rotate(314.314deg);
  left: 10.3px;
  top: 20.36px;
`;

export const YouFiText = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #16171a;
  margin-left: 8px;
`;

export const NotificationTitle = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #16171a;
  letter-spacing: -0.24px;
  line-height: 27px;
  margin-left: 37px;
  margin-top: 20px;
  margin-bottom: 20px;
`;

export const ContentArea = styled.View`
  padding: 0 16px;
  flex: 1;
`;

export const NotificationBox = styled.View`
  width: 100%;
  height: 132px;
  border: 1px solid #000000;
  margin-bottom: 20px;
`;

export const MapContainer = styled.View`
  width: 100%;
  height: 371px;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 20px;
  elevation: 4;
`;

export const MapImage = styled(ImageBackground)`
  width: 100%;
  height: 100%;
  position: relative;
`;

export const MapOverlay = styled.View`
  position: absolute;
  left: 130px;
  top: 65px;
  width: 172px;
  height: 172px;
  background-color: rgba(37, 178, 226, 0.3);
  border-radius: 86px;
`;

export const MapMarker = styled.View`
  position: absolute;
  left: 201px;
  top: 132px;
  width: 29.752px;
  height: 37.5px;
`;

export const MarkerIcon = styled.View`
  width: 23.554px;
  height: 23.554px;
  background-color: #ff6f61;
  border-radius: 11.777px;
  position: absolute;
  left: 3.1px;
  top: 3.1px;
`;

export const MissingPersonCard = styled.View`
  background-color: white;
  border-radius: 16px;
  padding: 16px;
  elevation: 4;
  margin-bottom: 100px;
`;

export const CardTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #16171a;
  letter-spacing: -0.2px;
  line-height: 22px;
  text-align: center;
  margin-bottom: 16px;
`;

export const PersonItem = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 16px 0;
  border-bottom-width: 1px;
  border-bottom-color: #f2f3f4;
`;

export const PersonImage = styled.View`
  width: 48px;
  height: 48px;
  background-color: #545454;
  border-radius: 4px;
  margin-right: 16px;
`;

export const PersonInfo = styled.View`
  flex: 1;
  gap: 8px;
`;

export const PersonMainInfo = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;

export const PersonText = styled.Text`
  font-size: 15px;
  font-weight: 500;
  color: #16171a;
  letter-spacing: -0.3px;
  line-height: 17px;
`;

export const Dot = styled.View`
  width: 4px;
  height: 4px;
  background-color: #16171a;
  border-radius: 2px;
`;

export const PersonDescription = styled.Text`
  font-size: 10px;
  font-weight: 500;
  color: #16171a;
  letter-spacing: -0.2px;
  line-height: 13px;
`;

export const ReportButton = styled.TouchableOpacity`
  background-color: #ff6f61;
  padding: 5px 12px;
  border-radius: 8px;
`;

export const ReportButtonText = styled.Text`
  font-size: 10px;
  font-weight: 500;
  color: white;
  letter-spacing: -0.2px;
  line-height: 13px;
`;

export const BottomNavContainer = styled.View`
  background-color: white;
  height: 80px;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  border-top-width: 1px;
  border-top-color: #f2f3f4;
  padding-bottom: 20px;
`;

export const NavItem = styled.TouchableOpacity<{ isActive?: boolean }>`
  align-items: center;
  justify-content: center;
  flex: 1;
`;

export const NavIcon = styled.View<{ isActive?: boolean }>`
  width: 24px;
  height: 24px;
  background-color: ${(props: { isActive?: boolean }) => props.isActive ? '#25b2e2' : '#bbbcbe'};
  margin-bottom: 4px;
`;

export const NavText = styled.Text<{ isActive?: boolean }>`
  font-size: 10px;
  font-weight: 500;
  color: ${(props: { isActive?: boolean }) => props.isActive ? '#25b2e2' : '#bbbcbe'};
  text-align: center;
`;

export const HomeIndicator = styled.View`
  height: 34px;
  justify-content: center;
  align-items: center;
`;

export const HomeIndicatorBar = styled.View`
  width: 144px;
  height: 5px;
  background-color: #000000;
  border-radius: 100px;
`;