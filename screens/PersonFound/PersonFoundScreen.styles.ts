import { Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

export const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: #ffffff;
`;

export const Header = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 16px 0 0 0;
  padding-left: 32px;
  position: relative;
`;

export const BackButton = styled(TouchableOpacity)`
  width: 40px;
  height: 40px;
  justify-content: center;
  align-items: center;
`;

export const ContentContainer = styled.View`
  align-items: center;
  padding-top: 74px;
  width: 100%;
`;

export const PersonImageContainer = styled.View`
  width: 209px;
  height: 209px;
  border-radius: 32px;
  overflow: hidden;
  shadow-color: #000000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.12;
  shadow-radius: 4px;
  elevation: 4;
  background-color: #e5e7eb;
`;

export const PersonImage = styled(Image)`
  width: 100%;
  height: 100%;
  border-radius: 32px;
`;

export const FoundTitleText = styled.Text`
  font-size: 26px;
  font-weight: 800;
  color: #16171a;
  font-family: 'Wanted Sans';
  letter-spacing: -0.26px;
  line-height: 30px;
  text-align: center;
  margin-top: 90px;
`;

export const FoundPersonText = styled.Text`
  font-size: 24px;
  font-weight: 700;
  color: #16171a;
  font-family: 'Wanted Sans';
  letter-spacing: -0.24px;
  line-height: 27px;
  text-align: center;
  margin-top: 16px;
`;

export const FoundLocationText = styled.Text`
  font-size: 24px;
  font-weight: 700;
  color: #16171a;
  font-family: 'Wanted Sans';
  letter-spacing: -0.24px;
  line-height: 27px;
  text-align: center;
  margin-top: 8px;
`;

