import styled from 'styled-components/native';

export const ModalOverlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

export const ModalContainer = styled.View`
  background-color: #ffffff;
  border-radius: 16px;
  width: 100%;
  max-width: 400px;
  padding: 24px;
`;

export const ModalHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

export const ModalTitle = styled.Text`
  font-family: 'Wanted Sans';
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
  color: #16171a;
  letter-spacing: -0.2px;
`;

export const CloseButton = styled.TouchableOpacity`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: #f2f3f4;
  justify-content: center;
  align-items: center;
`;

export const CloseButtonText = styled.Text`
  font-size: 18px;
  color: #6b7280;
`;

export const LoadingContainer = styled.View`
  padding: 40px 0;
  align-items: center;
`;

export const LoadingText = styled.Text`
  font-family: 'Wanted Sans';
  font-weight: 500;
  font-size: 16px;
  line-height: 20px;
  color: #6b7280;
  margin-top: 16px;
  text-align: center;
`;

export const LoadingSubText = styled.Text`
  font-family: 'Wanted Sans';
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  color: #9ca3af;
  margin-top: 8px;
  text-align: center;
`;

export const ImagesGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin: -6px;
`;

export const ImageWrapper = styled.TouchableOpacity`
  width: 50%;
  padding: 6px;
  position: relative;
`;

export const GeneratedImage = styled.Image`
  width: 100%;
  aspect-ratio: 1;
  border-radius: 12px;
  background-color: #f2f3f4;
`;

export const CheckboxWrapper = styled.TouchableOpacity`
  position: absolute;
  top: 12px;
  right: 12px;
  width: 24px;
  height: 24px;
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.9);
  justify-content: center;
  align-items: center;
  z-index: 1;
`;

export const CheckboxInner = styled.View<{ isSelected: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 10px;
  border-width: 2px;
  border-color: ${({ isSelected }: { isSelected: boolean }) => (isSelected ? '#25b2e2' : '#d1d5db')};
  background-color: ${({ isSelected }: { isSelected: boolean }) => (isSelected ? '#25b2e2' : 'transparent')};
  justify-content: center;
  align-items: center;
`;

export const CheckIcon = styled.Text`
  font-size: 12px;
  color: #ffffff;
  font-weight: bold;
`;

export const SelectedBorder = styled.View`
  position: absolute;
  top: 6px;
  left: 6px;
  right: 6px;
  bottom: 6px;
  border-radius: 12px;
  border-width: 3px;
  border-color: #25b2e2;
`;

export const ErrorContainer = styled.View`
  padding: 40px 0;
  align-items: center;
`;

export const ErrorText = styled.Text`
  font-family: 'Wanted Sans';
  font-weight: 500;
  font-size: 14px;
  line-height: 18px;
  color: #ef4444;
  text-align: center;
  margin-top: 12px;
`;

export const RetryButton = styled.TouchableOpacity`
  background-color: #25b2e2;
  border-radius: 8px;
  padding: 12px 24px;
  margin-top: 16px;
`;

export const RetryButtonText = styled.Text`
  font-family: 'Wanted Sans';
  font-weight: 600;
  font-size: 14px;
  color: #ffffff;
`;

export const FullImageOverlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.9);
  justify-content: center;
  align-items: center;
`;

export const FullImage = styled.Image`
  width: 100%;
  height: 80%;
`;

export const FullImageCloseButton = styled.TouchableOpacity`
  position: absolute;
  top: 60px;
  right: 20px;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 0.2);
  justify-content: center;
  align-items: center;
`;

export const FullImageCloseText = styled.Text`
  font-size: 24px;
  color: #ffffff;
`;

export const ButtonsContainer = styled.View`
  flex-direction: row;
  margin-top: 16px;
  gap: 12px;
`;

export const ApplyButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  flex: 1;
  background-color: ${({ disabled }: { disabled?: boolean }) => (disabled ? '#d1d5db' : '#25b2e2')};
  border-radius: 8px;
  padding: 14px 24px;
  align-items: center;
`;

export const ApplyButtonText = styled.Text`
  font-family: 'Wanted Sans';
  font-weight: 600;
  font-size: 16px;
  color: #ffffff;
`;

export const CancelButton = styled.TouchableOpacity`
  flex: 1;
  background-color: #f2f3f4;
  border-radius: 8px;
  padding: 14px 24px;
  align-items: center;
`;

export const CancelButtonText = styled.Text`
  font-family: 'Wanted Sans';
  font-weight: 600;
  font-size: 16px;
  color: #6b7280;
`;
