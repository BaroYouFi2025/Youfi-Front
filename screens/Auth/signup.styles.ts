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
`;

export const InputGroup = styled.View`
  margin-bottom: 32px;
`;

export const InputLabel = styled.Text`
  font-size: 15px;
  color: #bbbcbe;
  margin-bottom: 8px;
  font-weight: 500;
  letter-spacing: -0.3px;
`;

export const InputContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const TextInput = styled.TextInput`
  flex: 1;
  font-size: 16px;
  padding-vertical: 8px;
  color: #000000;
`;

export const InputLine = styled.View`
  height: 1px;
  background-color: #bbbcbe;
  margin-top: 4px;
`;

export const PhoneContainer = styled.View`
  position: relative;
  margin-bottom: 32px;
`;

export const PhoneInput = styled(TextInput)`
  padding-right: 80px;
`;

export const VerifyButton = styled.TouchableOpacity`
  position: absolute;
  right: 0px;
  top: 32px;
  width: 74px;
  height: 26px;
  border-width: 1px;
  border-color: #848587;
  border-radius: 4px;
  justify-content: center;
  align-items: center;
`;

export const VerifyButtonText = styled.Text`
  font-size: 15px;
  color: #848587;
  font-weight: 500;
  letter-spacing: -0.3px;
`;

export const RightIconContainer = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 12px;
  margin-left: 8px;
`;

export const CheckIcon = styled.Text`
  font-size: 24px;
  color: #4CAF50;
`;

export const CancelIcon = styled.Text`
  font-size: 24px;
  color: #F44336;
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
