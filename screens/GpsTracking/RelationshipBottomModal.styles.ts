import styled from 'styled-components/native';

export const ModalContainer = styled.TouchableOpacity`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: flex-end;
`;

export const Container = styled.TouchableOpacity`
  background-color: #ffffff;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  padding: 24px 20px 32px;
  shadow-color: #000;
  shadow-offset: 0px -2px;
  shadow-opacity: 0.1;
  shadow-radius: 8px;
  elevation: 5;
`;

export const CloseButton = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: 0.7,
}))`
  align-self: flex-end;
  padding: 4px;
  margin-bottom: 12px;
`;

export const Title = styled.Text`
  font-size: 26px;
  font-weight: 700;
  color: #16171a;
  margin-bottom: 24px;
  line-height: 34px;
`;

export const OptionsContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 32px;
`;

export const RelationshipPill = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: 0.7,
}))<{ $selected?: boolean }>`
  padding: 14px 28px;
  border-radius: 30px;
  background-color: ${({ $selected }: { $selected?: boolean }) =>
    $selected ? '#E8F7FD' : '#FFFFFF'};
  border: 2px solid ${({ $selected }: { $selected?: boolean }) =>
    $selected ? '#25B2E2' : '#4DC0E7'};
  min-width: 100px;
  align-items: center;
  justify-content: center;
`;

export const RelationshipText = styled.Text<{ $selected?: boolean }>`
  font-size: 18px;
  font-weight: ${({ $selected }: { $selected?: boolean }) =>
    $selected ? '600' : '500'};
  color: ${({ $selected }: { $selected?: boolean }) =>
    $selected ? '#25B2E2' : '#16171A'};
`;

export const ConfirmButton = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: 0.85,
}))<{ $disabled?: boolean }>`
  width: 100%;
  padding: 18px;
  border-radius: 16px;
  background-color: ${({ $disabled }: { $disabled?: boolean }) =>
    $disabled ? '#D3D3D3' : '#A8D8EA'};
  align-items: center;
  justify-content: center;
  flex-direction: row;
`;

export const ConfirmButtonText = styled.Text<{ $disabled?: boolean }>`
  font-size: 18px;
  font-weight: 600;
  color: ${({ $disabled }: { $disabled?: boolean }) =>
    $disabled ? '#848587' : '#FFFFFF'};
`;
