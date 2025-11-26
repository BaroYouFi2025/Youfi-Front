import styled from 'styled-components/native';

export const Overlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
`;

export const ModalContent = styled.View`
  width: 90%;
  height: 80%;
  background-color: #ffffff;
  border-radius: 20px;
  padding: 20px;
  align-items: center;
`;

export const Header = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding-bottom: 15px;
  border-bottom-width: 1px;
  border-bottom-color: #eeeeee;
  margin-bottom: 15px;
`;

export const Title = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #333333;
`;

export const ScrollContent = styled.ScrollView`
  flex: 1;
  width: 100%;
  margin-bottom: 15px;
`;

export const PolicyText = styled.Text`
  font-size: 14px;
  color: #333333;
  line-height: 20px;
`;

export const LinkContainer = styled.TouchableOpacity`
  padding: 10px;
  margin-bottom: 10px;
`;

export const LinkText = styled.Text`
  font-size: 14px;
  color: #2e6af7;
  text-decoration: underline;
  text-decoration-color: #2e6af7;
`;

export const AgreeButton = styled.TouchableOpacity`
  width: 100%;
  padding: 15px;
  background-color: #000000;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
`;

export const AgreeButtonText = styled.Text`
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
`;

