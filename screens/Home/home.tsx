import { router } from 'expo-router';
import React, { useState } from 'react';
import YouFiLogo from '../../components/YouFiLogo';
import {
    CardTitle,
    Container,
    ContentArea,
    Dot,
    HeaderContainer,
    MapContainer,
    MapImage,
    MapMarker,
    MapOverlay,
    MarkerIcon,
    MissingPersonCard,
    NotificationBox,
    NotificationTitle,
    PersonDescription,
    PersonImage,
    PersonInfo,
    PersonItem,
    PersonMainInfo,
    PersonText,
    ReportButton,
    ReportButtonText,
    ScrollContainer
} from './home.styles';

// 임시로 로고 이미지를 지도 배경으로 사용 (실제 지도 이미지로 교체 필요)
const mapImage = require('../../assets/images/react-logo.png');

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState('home');

  const handleNavPress = (tab: string) => {
    setActiveTab(tab);
    
    if (tab === 'profile') {
      router.push('/login');
    }
    // TODO: Implement other navigation
  };

  return (
    <Container>
      <ScrollContainer showsVerticalScrollIndicator={false}>
        {/* Header with YouFi Logo */}
        <HeaderContainer>
          <YouFiLogo />
        </HeaderContainer>

        {/* Notification Title */}
        <NotificationTitle>알림</NotificationTitle>

        {/* Content Area */}
        <ContentArea>
          {/* Notification Box */}
          <NotificationBox />

          {/* Map */}
          <MapContainer>
            <MapImage source={mapImage} resizeMode="cover">
              <MapOverlay />
              <MapMarker>
                <MarkerIcon />
              </MapMarker>
            </MapImage>
          </MapContainer>

          {/* Missing Person Card */}
          <MissingPersonCard>
            <CardTitle>근처 실종자</CardTitle>
            
            {/* Person 1 */}
            <PersonItem>
              <PersonImage />
              <PersonInfo>
                <PersonMainInfo>
                  <PersonText>이름</PersonText>
                  <Dot />
                  <PersonText>실종 위치</PersonText>
                </PersonMainInfo>
                <PersonDescription>(인상착의 정보)</PersonDescription>
              </PersonInfo>
              <ReportButton onPress={() => router.push('/missing-report')}>
                <ReportButtonText>신고하기</ReportButtonText>
              </ReportButton>
            </PersonItem>

            {/* Person 2 */}
            <PersonItem style={{ borderBottomWidth: 0 }}>
              <PersonInfo style={{ marginLeft: 16 }}>
                <PersonMainInfo>
                  <PersonText>실종 일자</PersonText>
                  <Dot />
                  <PersonText>치매 여부</PersonText>
                </PersonMainInfo>
              </PersonInfo>
            </PersonItem>
          </MissingPersonCard>
        </ContentArea>
      </ScrollContainer>
    </Container>
  );
}