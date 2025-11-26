import React, { useState } from 'react';
import { Modal, ScrollView, NativeSyntheticEvent, NativeScrollEvent, Dimensions, View } from 'react-native';
import {
  Overlay,
  ModalContent,
  Header,
  Title,
  SlideContainer,
  SlideImage,
  Pagination,
  Dot,
  CloseButton,
  CloseButtonText,
  SlideTextArea,
  SlideText,
  SlideSubText,
  ImageDescription,
} from './TutorialModal.styles';

// Import images
const t1 = require('@/assets/images/t1.jpg');
const t2 = require('@/assets/images/t2.jpg');
const t3 = require('@/assets/images/t3.jpg');

interface TutorialModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function TutorialModal({ visible, onClose }: TutorialModalProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  // Calculate width based on ModalContent width (90% of screen)
  const contentWidth = Dimensions.get('window').width * 0.9;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);
    setActiveIndex(roundIndex);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Overlay>
        <ModalContent>
          <Header>
            <Title>인증 메일 전송 방법</Title>
          </Header>
          
          <SlideContainer>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
            >
              {/* 첫 번째 슬라이드: 텍스트 안내 */}
              <View style={{ width: contentWidth, height: '100%' }}>
                <SlideTextArea>
                  <SlideText>메시지 앱을 엽니다.</SlideText>
                  <SlideSubText>
                    꼭 메시지 앱으로 열어서 진행해야{'\n'}전화번호가 인증됩니다.
                  </SlideSubText>
                </SlideTextArea>
              </View>

              {/* 두 번째 슬라이드: 이미지 + 설명 */}
              <View style={{ width: contentWidth, height: '100%', paddingBottom: 10 }}>
                <SlideImage source={t1} style={{ width: contentWidth }} />
                <ImageDescription>
                  메시지 앱에서 1:1 대화를 선택합니다.
                </ImageDescription>
              </View>

              {/* 세 번째 슬라이드: 이미지 + 설명 */}
              <View style={{ width: contentWidth, height: '100%', paddingBottom: 10 }}>
                <SlideImage source={t2} style={{ width: contentWidth }} />
                <ImageDescription>
                  현재 복사된 이메일을 입력 칸에 붙여 넣은 후 아래 뜨는 대화 버튼을 누릅니다.
                </ImageDescription>
              </View>

              {/* 네 번째 슬라이드: 이미지 + 설명 */}
              <View style={{ width: contentWidth, height: '100%', paddingBottom: 10 }}>
                <SlideImage source={t3} style={{ width: contentWidth }} />
                <ImageDescription>
                  다시 앱으로 돌아와서 토큰을 복사한 후 대화 메시지 칸에 붙여넣고 메시지를 전송합니다.
                </ImageDescription>
              </View>
            </ScrollView>
          </SlideContainer>

          <Pagination>
            <Dot active={activeIndex === 0} />
            <Dot active={activeIndex === 1} />
            <Dot active={activeIndex === 2} />
            <Dot active={activeIndex === 3} />
          </Pagination>

          <CloseButton onPress={onClose}>
            <CloseButtonText>확인했습니다</CloseButtonText>
          </CloseButton>
        </ModalContent>
      </Overlay>
    </Modal>
  );
}
