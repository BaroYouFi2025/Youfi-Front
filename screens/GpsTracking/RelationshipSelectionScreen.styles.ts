import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

export const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: #ffffff;
`;

export const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom-width: 1px;
  border-bottom-color: #f2f3f4;
`;

export const BackButton = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: 0.7,
}))`
  padding: 4px;
`;

export const Title = styled.Text`
  font-size: 24px;
  font-weight: 700;
  color: #16171a;
`;

export const RelationshipOption = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: 0.7,
}))<{ $selected?: boolean }>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 8px;
  background-color: ${({ $selected }: { $selected?: boolean }) => ($selected ? '#e8f7fd' : '#f2f3f4')};
  border: 2px solid ${({ $selected }: { $selected?: boolean }) => ($selected ? '#25b2e2' : 'transparent')};
`;

export const RelationshipText = styled.Text<{ $selected?: boolean }>`
  font-size: 16px;
  font-weight: ${({ $selected }: { $selected?: boolean }) => ($selected ? '600' : '500')};
  color: ${({ $selected }: { $selected?: boolean }) => ($selected ? '#25b2e2' : '#16171a')};
`;

export const Footer = styled.View`
  flex-direction: row;
  gap: 12px;
  padding: 16px;
  border-top-width: 1px;
  border-top-color: #f2f3f4;
`;

export const CancelButton = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: 0.85,
}))`
  flex: 1;
  padding: 16px;
  border-radius: 16px;
  background-color: #f2f3f4;
  align-items: center;
  justify-content: center;
`;

export const CancelButtonText = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #848587;
`;

export const ConfirmButton = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: 0.85,
}))<{ $disabled?: boolean }>`
  flex: 1;
  padding: 16px;
  border-radius: 16px;
  background-color: ${({ $disabled }: { $disabled?: boolean }) => ($disabled ? '#d3d3d3' : '#25b2e2')};
  align-items: center;
  justify-content: center;
`;

export const ConfirmButtonText = styled.Text<{ $disabled?: boolean }>`
  font-size: 16px;
  font-weight: 600;
  color: ${({ $disabled }: { $disabled?: boolean }) => ($disabled ? '#848587' : '#ffffff')};
`;
