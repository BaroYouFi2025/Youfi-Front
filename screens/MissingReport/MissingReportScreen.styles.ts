import styled from 'styled-components/native';
import { TouchableOpacity, Image, View, Text } from 'react-native';

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

export const StatusIcon = styled.Image`
  width: auto;
  height: 12px;
`;

export const ContentContainer = styled.View`
  flex: 1;
  background-color: #ffffff;
  border-top-left-radius: 32px;
  border-top-right-radius: 32px;
  margin-top: 74px;
  shadow-color: #000000;
  shadow-offset: 0px -2px;
  shadow-opacity: 0.25;
  shadow-radius: 8px;
  elevation: 8;
  overflow: hidden;
`;

export const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding-horizontal: 16px;
  padding-top: 24px;
  position: relative;
`;

export const BackButton = styled(TouchableOpacity)`
  position: absolute;
  left: 185px;
  top: 8px;
  width: 32px;
  height: 32px;
  justify-content: center;
  align-items: center;
`;

export const BackIcon = styled.View`
  width: 32px;
  height: 3px;
  background-color: #000000;
  border-radius: 1.5px;
`;

export const Title = styled.Text`
  font-family: 'Wanted Sans';
  font-weight: 700;
  font-size: 20px;
  color: #000000;
  letter-spacing: -0.2px;
`;

export const PersonItem = styled.View`
  flex-direction: row;
  align-items: center;
  padding-horizontal: 16px;
  padding-vertical: 16px;
  gap: 12px;
`;

export const PersonImage = styled(Image)`
  width: 55px;
  height: 55px;
  border-radius: 32px;
  shadow-color: #000000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.12;
  shadow-radius: 4px;
  elevation: 4;
`;

export const PersonInfo = styled.View`
  flex: 1;
  gap: 8px;
`;

export const PersonName = styled.Text`
  font-family: 'Wanted Sans';
  font-weight: 700;
  font-size: 20px;
  color: #16171a;
  letter-spacing: -0.2px;
`;

export const PersonRelation = styled.Text`
  background-color: #ffffff;
  border: 1px solid #4dc0e7;
  border-radius: 15px;
  padding-horizontal: 12px;
  padding-vertical: 3px;
  align-self: flex-start;
  font-family: 'Wanted Sans';
  font-weight: 500;
  font-size: 10px;
  color: #000000;
  letter-spacing: -0.2px;
  text-align: center;
  include-font-padding: false;
  text-align-vertical: center;
`;

export const PersonButton = styled(TouchableOpacity)`
  background-color: #f9fdfe;
  border: 1.5px solid #ff6f61;
  border-radius: 12px;
  padding-horizontal: 16px;
  padding-vertical: 6px;
`;

export const ReportButtonText = styled.Text`
  font-family: 'Wanted Sans';
  font-weight: 500;
  font-size: 10px;
  color: #000000;
  letter-spacing: -0.2px;
  text-align: center;
`;

export const Divider = styled.View`
  height: 1px;
  background-color: #bbbcbe;
  margin-horizontal: 16px;
`;

export const BottomContainer = styled.View`
  background-color: #ffffff;
  border-radius: 21px;
  shadow-color: #000000;
  shadow-offset: 0px -1px;
  shadow-opacity: 0.25;
  shadow-radius: 4px;
  elevation: 4;
  padding-horizontal: 16px;
  padding-top: 23px;
  padding-bottom: 56px;
`;

export const ReportButton = styled(TouchableOpacity)`
  background-color: #ff6f61;
  border-radius: 16px;
  padding-vertical: 13px;
  align-items: center;
`;

export const HomeIndicator = styled.View`
  position: absolute;
  bottom: 8px;
  left: 50%;
  margin-left: -72px;
  width: 144px;
  height: 5px;
  background-color: #000000;
  border-radius: 100px;
`;