import styled from 'styled-components/native';
import { Colors } from '@/constants/Colors';

export const Overlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
`;

export const ModalContent = styled.View`
  width: 90%;
  height: 80%;
  background-color: white;
  border-radius: 20px;
  overflow: hidden;
  align-items: center;
  padding-bottom: 20px;
`;

export const Header = styled.View`
  width: 100%;
  padding: 20px;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: #eee;
`;

export const Title = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #333;
`;

export const SlideContainer = styled.View`
  flex: 1;
  width: 100%;
`;

export const SlideImage = styled.Image`
  flex: 1;
  width: 100%;
  resize-mode: contain;
`;

export const SlideTextArea = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 40px;
`;

export const SlideText = styled.Text`
  font-size: 24px;
  font-weight: 600;
  color: #333;
  text-align: center;
  margin-bottom: 16px;
`;

export const SlideSubText = styled.Text`
  font-size: 16px;
  color: #666;
  text-align: center;
  line-height: 24px;
`;

export const ImageDescription = styled.Text`
  font-size: 15px;
  color: #333;
  text-align: center;
  padding: 15px 20px 5px;
  line-height: 22px;
  font-weight: 500;
`;

export const Pagination = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 10px;
`;

export const Dot = styled.View<{ active: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${({ active }) => (active ? Colors.light.tint : '#ccc')};
  margin: 0 4px;
`;

export const CloseButton = styled.TouchableOpacity`
  background-color: ${Colors.light.tint};
  padding: 15px 40px;
  border-radius: 25px;
  margin-top: 10px;
`;

export const CloseButtonText = styled.Text`
  color: white;
  font-weight: bold;
  font-size: 16px;
`;
