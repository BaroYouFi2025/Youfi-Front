import styledComponents from 'styled-components/native';

export const NotificationBoxContainer = styledComponents.View`
  width: 100%;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  margin-bottom: 20px;
  padding: 12px;
  position: relative;
  overflow: visible;
  shadow-color: #000000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 8px;
  elevation: 3;
`;

export const NotificationContent = styledComponents.Text`
  font-size: 14px;
  color: #949494;
  text-align: center;
  margin-top: 40px;
  font-family: 'Wanted Sans';
  font-weight: 400;
`;

export const MoreButton = styled.TouchableOpacity`
  width: 100%;
  padding: 12px;
  background-color: #f9fdfe;
  border: 1px solid #25b2e2;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  margin-top: 8px;
`;

export const MoreButtonText = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #25b2e2;
  font-family: 'Wanted Sans';
  letter-spacing: -0.14px;
`;


