import React from 'react';
import YouFiLogo from '../../components/YouFiLogo';
import {
  AddButton,
  AddIcon,
  BatteryIcon,
  BatterySection,
  BatteryText,
  Container,
  ContentArea,
  Distance,
  HeaderContainer,
  MapContainer,
  MapImage,
  PersonCard,
  PersonImage,
  PersonInfo,
  PersonName,
  PersonRelation,
  RefreshButton,
  RefreshButtonText,
  ReportButton,
  ReportButtonText,
  StatusBarContainer,
  StatusBarIcons,
  StatusBarTime,
  StatusIcon,
  TabBar,
  TabBarContent,
  TabButton,
  TabIcon,
  TabText
} from './GpsTrackingScreen.styles';

const imgMapMakerGangseoGuSeoulSouthKoreaStandard = "http://localhost:3845/assets/16de3020fcb10c3df8d12c2de8111ce16efd8a53.png";
const imgEllipse5 = "http://localhost:3845/assets/4641a365b9247e387b33399f57727eabdd7630ce.png";
const imgCellularConnection = "http://localhost:3845/assets/2f7af92a290b833d2dc02c2deffbd3cfb362cb8e.svg";
const imgWifi = "http://localhost:3845/assets/f7362d49a3a3be2994a501c3031ce41d8e27f562.svg";
const imgBattery = "http://localhost:3845/assets/146ff8f9e983bba6c0eef87deb916af7baef0c43.svg";
const imgBattery1 = "http://localhost:3845/assets/533845f2bb8babc54a85ac193588af6f21056605.svg";

export default function GpsTrackingScreen() {
  const handleRefresh = () => {
    console.log('Refreshing GPS data...');
  };

  const handleReportMissing = () => {
    console.log('Report missing person...');
  };

  const handleAddPerson = () => {
    console.log('Add person...');
  };

  const handleTabPress = (tabName: string) => {
    console.log(`Tab pressed: ${tabName}`);
  };

  return (
    <Container>
      {/* Status Bar */}
      <StatusBarContainer>
        <StatusBarTime>9:41</StatusBarTime>
        <StatusBarIcons>
          <StatusIcon source={{ uri: imgCellularConnection }} />
          <StatusIcon source={{ uri: imgWifi }} />
          <StatusIcon source={{ uri: imgBattery }} />
        </StatusBarIcons>
      </StatusBarContainer>

      {/* Header */}
      <HeaderContainer>
        <YouFiLogo />
        <AddButton onPress={handleAddPerson}>
          <AddIcon>+</AddIcon>
        </AddButton>
      </HeaderContainer>

      {/* Content Area */}
      <ContentArea>
        {/* Map */}
        <MapContainer>
          <MapImage source={{ uri: imgMapMakerGangseoGuSeoulSouthKoreaStandard }} resizeMode="cover" />
        </MapContainer>

        {/* Person Card */}
        <PersonCard>
          <PersonImage />
          <PersonInfo>
            <PersonName>이름</PersonName>
            <PersonRelation>동생</PersonRelation>
            <BatterySection>
              <BatteryIcon source={{ uri: imgBattery1 }} />
              <BatteryText>78%</BatteryText>
            </BatterySection>
          </PersonInfo>
          <Distance>2.4km</Distance>
        </PersonCard>

        {/* Buttons */}
        <ReportButton onPress={handleReportMissing}>
          <ReportButtonText>실종 신고</ReportButtonText>
        </ReportButton>

        <RefreshButton onPress={handleRefresh}>
          <RefreshButtonText>새로고침</RefreshButtonText>
        </RefreshButton>
      </ContentArea>

      {/* Tab Bar */}
      <TabBar>
        <TabBarContent>
          <TabButton active onPress={() => handleTabPress('gps')}>
            <TabIcon>📍</TabIcon>
            <TabText active>GPS 추적 관리</TabText>
          </TabButton>

          <TabButton onPress={() => handleTabPress('register')}>
            <TabIcon>➕</TabIcon>
            <TabText>실종자 등록</TabText>
          </TabButton>

          <TabButton onPress={() => handleTabPress('home')}>
            <TabIcon>🏠</TabIcon>
            <TabText>홈</TabText>
          </TabButton>

          <TabButton onPress={() => handleTabPress('list')}>
            <TabIcon>📋</TabIcon>
            <TabText>실종자 목록</TabText>
          </TabButton>

          <TabButton onPress={() => handleTabPress('profile')}>
            <TabIcon>👤</TabIcon>
            <TabText>프로필</TabText>
          </TabButton>
        </TabBarContent>
      </TabBar>
    </Container>
  );
}