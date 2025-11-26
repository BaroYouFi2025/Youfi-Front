import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// eslint-disable-next-line import/no-named-as-default
import styled from 'styled-components/native';

export const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: #ffffff;
`;

export const ScrollContainer = styled(ScrollView)`
  flex: 1;
`;

export const StatusBarSpace = styled.View`
  height: 54px;
`;

export const HeaderContainer = styled.View`
  align-items: center;
  margin-top: 22px;
  margin-bottom: 61px;
`;

export const HeaderTitle = styled.Text`
  font-size: 26px;
  font-weight: 800;
  color: #000000;
  letter-spacing: -0.26px;
  line-height: 30px;
`;

export const FormContainer = styled.View`
  padding-horizontal: 33px;
  gap: 24px;
`;

export const CalendarIcon = styled.Text`
  font-size: 24px;
`;

export const ButtonContainer = styled.View`
  padding-horizontal: 33px;
  margin-top: 34px;
  margin-bottom: 40px;
`;

export const SignupButton = styled.TouchableOpacity`
  background-color: #25b2e2;
  height: 48px;
  border-radius: 8px;
  justify-content: center;
  align-items: center;
`;

export const SignupButtonText = styled.Text`
  color: #f9fdfe;
  font-size: 20px;
  font-weight: bold;
  letter-spacing: -0.2px;
  line-height: 22px;
`;

export const WarningText = styled.Text`
  color: #ef4444;
  font-size: 14px;
  margin-bottom: 16px;
`;

export const BottomSpace = styled.View`
  height: 100px;
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

export const PickerOverlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.35);
  justify-content: flex-end;
`;

export const PickerContainer = styled.View`
  background-color: #ffffff;
  padding: 12px;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
`;

export const PickerActions = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 8px;
`;

export const PickerActionText = styled.Text`
  font-weight: 600;
  font-size: 14px;
  color: #0f172a;
`;
