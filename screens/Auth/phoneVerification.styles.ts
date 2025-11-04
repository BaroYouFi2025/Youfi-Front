import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

export const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: #ffffff;
`;

export const ScrollContainer = styled.ScrollView`
  flex: 1;
  padding-horizontal: 32px;
`;

export const Content = styled.View`
  flex: 1;
  padding-vertical: 48px;
  gap: 32px;
`;

export const HeaderArea = styled.View`
  gap: 12px;
`;

export const Title = styled.Text`
  font-size: 26px;
  font-weight: 800;
  color: #000000;
  letter-spacing: -0.26px;
  line-height: 30px;
`;

export const Description = styled.Text`
  font-size: 15px;
  color: #4b5563;
  line-height: 22px;
`;

export const InputSection = styled.View`
  gap: 20px;
`;

export const InputLabel = styled.Text`
  font-size: 15px;
  color: #bbbcbe;
  font-weight: 500;
  letter-spacing: -0.3px;
  margin-bottom: 8px;
`;

export const PhoneInput = styled.TextInput`
  font-size: 16px;
  color: #000000;
  border-bottom-width: 1px;
  border-bottom-color: #bbbcbe;
  padding-vertical: 8px;
`;

export const Button = styled.TouchableOpacity<{ disabled?: boolean }>`
  height: 48px;
  border-radius: 8px;
  justify-content: center;
  align-items: center;
  background-color: ${({ disabled }) => (disabled ? '#9ca3af' : '#25b2e2')};
`;

export const ButtonText = styled.Text`
  color: #ffffff;
  font-size: 18px;
  font-weight: bold;
`;

export const TokenContainer = styled.View`
  padding: 16px;
  border-radius: 12px;
  background-color: #f1f5f9;
  gap: 8px;
`;

export const TokenLabel = styled.Text`
  font-size: 14px;
  color: #4b5563;
`;

export const TokenValue = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  letter-spacing: 4px;
`;

export const HelperText = styled.Text`
  font-size: 13px;
  color: #6b7280;
  line-height: 18px;
`;

export const ActionGroup = styled.View`
  gap: 16px;
`;

export const SecondaryButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  height: 48px;
  border-radius: 8px;
  justify-content: center;
  align-items: center;
  background-color: ${({ disabled }) => (disabled ? '#d1d5db' : '#111827')};
`;

export const SecondaryButtonText = styled.Text`
  color: #ffffff;
  font-size: 18px;
  font-weight: bold;
`;
