import styled from 'styled-components/native';

export const Container = styled.SafeAreaView`
  flex: 1;
  background-color: #ffffff;
`;

export const ScrollArea = styled.ScrollView.attrs({
  contentContainerStyle: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
})``;

export const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

export const Avatar = styled.Image.attrs({
  resizeMode: 'cover',
})`
  width: 88px;
  height: 88px;
  border-radius: 32px;
  background-color: #e5e7eb;
`;

export const NameColumn = styled.View`
  flex: 1;
  margin-left: 16px;
`;

export const NameText = styled.Text`
  font-family: 'Wanted Sans';
  font-weight: 700;
  font-size: 24px;
  line-height: 27px;
  color: #16171a;
  letter-spacing: -0.24px;
`;

export const CloseButton = styled.TouchableOpacity`
  background-color: #ff6f61;
  border-radius: 10px;
  padding: 8px 12px;
  margin-left: 12px;
`;

export const CloseButtonText = styled.Text`
  font-family: 'Wanted Sans';
  font-weight: 500;
  font-size: 15px;
  line-height: 17px;
  color: #ffffff;
  letter-spacing: -0.3px;
`;

export const Divider = styled.View`
  height: 1px;
  background-color: #f2f3f4;
  margin: 8px 0;
`;

export const FieldRow = styled.View`
  padding: 22px 0;
  border-bottom-width: 1px;
  border-bottom-color: #f2f3f4;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
`;

export const FieldLabel = styled.Text`
  font-family: 'Wanted Sans';
  font-weight: 500;
  font-size: 15px;
  line-height: 17px;
  color: #16171a;
  letter-spacing: -0.3px;
`;

export const Bullet = styled.View`
  width: 4px;
  height: 4px;
  border-radius: 2px;
  background-color: #d9dadb;
  margin: 0 4px;
`;

export const FieldValue = styled.Text`
  font-family: 'Wanted Sans';
  font-weight: 500;
  font-size: 15px;
  line-height: 17px;
  color: #16171a;
  letter-spacing: -0.3px;
`;

export const FooterButton = styled.TouchableOpacity`
  height: 48px;
  background-color: #25b2e2;
  border-radius: 8px;
  justify-content: center;
  align-items: center;
  margin-top: 24px;
`;

export const EditButton = styled.TouchableOpacity`
  height: 48px;
  background-color: #ff6f61;
  border-radius: 8px;
  justify-content: center;
  align-items: center;
  margin-top: 24px;
`;

export const FooterButtonText = styled.Text`
  font-family: 'Wanted Sans';
  font-weight: 700;
  font-size: 20px;
  line-height: 22px;
  color: #ffffff;
  letter-spacing: -0.2px;
`;

export const LoadingWrap = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const ErrorWrap = styled.View`
  flex: 1;
  padding: 16px;
  justify-content: center;
  align-items: center;
`;

export const ErrorText = styled.Text`
  font-family: 'Wanted Sans';
  font-weight: 500;
  font-size: 14px;
  color: #ef4444;
  margin-top: 8px;
  text-align: center;
`;

// AI 이미지 생성 타입 선택 모달
export const SelectionModalOverlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

export const SelectionModalContainer = styled.View`
  background-color: #ffffff;
  border-radius: 16px;
  width: 100%;
  max-width: 320px;
  padding: 24px;
`;

export const SelectionModalTitle = styled.Text`
  font-family: 'Wanted Sans';
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
  color: #16171a;
  letter-spacing: -0.2px;
  text-align: center;
  margin-bottom: 20px;
`;

export const SelectionButton = styled.TouchableOpacity`
  height: 52px;
  background-color: #25b2e2;
  border-radius: 8px;
  justify-content: center;
  align-items: center;
  margin-bottom: 12px;
`;

export const SelectionButtonText = styled.Text`
  font-family: 'Wanted Sans';
  font-weight: 600;
  font-size: 16px;
  color: #ffffff;
`;

export const SelectionCancelButton = styled.TouchableOpacity`
  height: 48px;
  background-color: #f2f3f4;
  border-radius: 8px;
  justify-content: center;
  align-items: center;
  margin-top: 4px;
`;

export const SelectionCancelButtonText = styled.Text`
  font-family: 'Wanted Sans';
  font-weight: 600;
  font-size: 16px;
  color: #6b7280;
`;

// 실종 종료 확인 모달
export const ConfirmModalDescription = styled.Text`
  font-family: 'Wanted Sans';
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: #6b7280;
  text-align: center;
  margin-bottom: 20px;
`;

export const ConfirmButton = styled.TouchableOpacity`
  height: 48px;
  background-color: #ff6f61;
  border-radius: 8px;
  justify-content: center;
  align-items: center;
  margin-bottom: 12px;
`;

export const ConfirmButtonText = styled.Text`
  font-family: 'Wanted Sans';
  font-weight: 600;
  font-size: 16px;
  color: #ffffff;
`;
