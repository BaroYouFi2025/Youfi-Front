import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import React, { useState } from 'react';
import KakaoMap from '../../components/KakaoMap';
import YouFiLogo from '../../components/YouFiLogo';
import {
  ActionButton,
  ActionButtonText,
  ActionsContainer,
  AddButton,
  Avatar,
  BatteryRow,
  BatteryText,
  Container,
  DistanceText,
  Divider,
  Header,
  LabelBadge,
  LabelText,
  MapCard,
  NameGroup,
  NameRow,
  PersonContent,
  PersonName,
  PersonRow,
  PersonSection,
  ScreenScroll,
  Spacer
} from './GpsTrackingScreen.styles';

export default function GpsTrackingScreen() {
  // TODO: 실제 GPS 데이터로 교체 필요
  const [userLocation, setUserLocation] = useState({
    latitude: 37.5665,
    longitude: 126.9780
  });

  const handleReportPress = () => {
    router.push('/missing-report');
  };

  const handleRefresh = () => {
    // 위치 데이터 갱신 후 KakaoMap에 반영되도록 상태 업데이트 예정
    setUserLocation((prev) => ({ ...prev }));
  };

  const handleAddPress = () => {
    router.push('/gps-add');
  };

  return (
    <Container edges={['top']}>
      <StatusBar style="dark" />
      <ScreenScroll>
        <Header>
          <YouFiLogo />
          <AddButton onPress={handleAddPress}>
            <Ionicons name="add" size={24} color="#ffffff" />
          </AddButton>
        </Header>

        <MapCard>
          <KakaoMap
            latitude={userLocation.latitude}
            longitude={userLocation.longitude}
            zoom={3}
          />
        </MapCard>

        <Divider />

        <PersonSection>
          <PersonRow>
            <Avatar />
            <PersonContent>
              <NameRow>
                <NameGroup>
                  <PersonName>이름</PersonName>
                  <LabelBadge>
                    <LabelText>동생</LabelText>
                  </LabelBadge>
                </NameGroup>
                <DistanceText>2.4km</DistanceText>
              </NameRow>
              <BatteryRow>
                <Ionicons name="battery-full" size={20} color="#24c879" />
                <BatteryText>78%</BatteryText>
              </BatteryRow>
            </PersonContent>
          </PersonRow>
        </PersonSection>

        <ActionsContainer>
          <ActionButton $variant="alert" onPress={handleReportPress}>
            <ActionButtonText>실종 신고</ActionButtonText>
          </ActionButton>
          <ActionButton $variant="refresh" onPress={handleRefresh} style={{ marginBottom: 0 }}>
            <ActionButtonText>새로고침</ActionButtonText>
          </ActionButton>
        </ActionsContainer>

        <Spacer />
      </ScreenScroll>
    </Container>
  );
}
