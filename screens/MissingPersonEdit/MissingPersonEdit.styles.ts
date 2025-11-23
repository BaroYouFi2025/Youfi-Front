import styled from 'styled-components/native';

export const Container = styled.SafeAreaView`
  flex: 1;
  background-color: #ffffff;
`;

export const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
`;

export const BackButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  justify-content: center;
  align-items: center;
`;

export const BackButtonText = styled.Text`
  font-family: 'Wanted Sans';
  font-weight: 600;
  font-size: 24px;
  color: #16171a;
`;

export const Title = styled.Text`
  font-family: 'Wanted Sans';
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
  color: #16171a;
  letter-spacing: -0.2px;
  text-align: center;
  flex: 1;
`;

export const FormContainer = styled.View`
  padding: 16px;
  gap: 16px;
`;

export const InputGroup = styled.View`
  gap: 8px;
`;

export const InputLabel = styled.Text`
  font-family: 'Wanted Sans';
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  color: #111827;
  letter-spacing: -0.2px;
`;

export const InputField = styled.TextInput.attrs({
  placeholderTextColor: '#9ca3af',
})`
  background-color: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  height: 44px;
  padding: 0 12px;
  font-family: 'Wanted Sans';
  font-weight: 500;
  font-size: 12px;
  color: #111827;
  letter-spacing: -0.2px;
`;

export const DateInputContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const DateInput = styled(InputField)`
  flex: 1;
`;

export const CalendarIcon = styled.View`
  position: absolute;
  right: 8px;
`;

export const GenderContainer = styled.View`
  flex-direction: row;
  gap: 8px;
`;

export const GenderButton = styled.TouchableOpacity<{ selected: boolean }>`
  background-color: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  height: 40px;
  width: 120px;
  justify-content: center;
  align-items: center;
  ${(props: { selected: boolean }) => props.selected && `
    background-color: #25b2e2;
    border-color: #25b2e2;
  `}
`;

export const GenderButtonText = styled.Text<{ selected: boolean }>`
  font-family: 'Wanted Sans';
  font-weight: 500;
  font-size: 15px;
  line-height: 17px;
  color: ${(props: { selected: boolean }) => props.selected ? '#ffffff' : '#000000'};
  letter-spacing: -0.3px;
`;

export const PhotoUploadContainer = styled.TouchableOpacity`
  background-color: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  height: 125px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  overflow: hidden;
`;

export const UploadText = styled.Text`
  font-family: 'Wanted Sans';
  font-weight: 500;
  font-size: 13px;
  line-height: 16px;
  color: #949494;
  letter-spacing: -0.13px;
`;

export const PhotoPreview = styled.Image`
  width: 100%;
  height: 100%;
`;

export const MapContainer = styled.View`
  height: 190px;
  border-radius: 16px;
  overflow: hidden;
  background-color: #e5e7eb;
  border: 1px solid #d1d5db;
  margin-top: 16px;
`;

export const MapPlaceholder = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  justify-content: center;
  align-items: center;
`;

export const MapPlaceholderText = styled.Text`
  font-family: 'Wanted Sans';
  font-weight: 500;
  font-size: 14px;
  color: #6b7280;
`;

export const LocationSummary = styled.View`
  margin-top: 8px;
`;

export const LocationText = styled.Text`
  font-family: 'Wanted Sans';
  font-weight: 500;
  font-size: 10px;
  color: #4b5563;
`;

export const ErrorText = styled.Text`
  font-family: 'Wanted Sans';
  font-weight: 500;
  font-size: 10px;
  color: #ef4444;
  margin-top: 4px;
`;

export const SubmitButton = styled.TouchableOpacity`
  background-color: #ff6f61;
  border-radius: 8px;
  height: 48px;
  justify-content: center;
  align-items: center;
  margin: 16px;
`;

export const SubmitButtonText = styled.Text`
  font-family: 'Wanted Sans';
  font-weight: 700;
  font-size: 16px;
  color: #ffffff;
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
  font-family: 'Wanted Sans';
  font-weight: 600;
  font-size: 14px;
  color: #0f172a;
`;

export const LoadingWrap = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
