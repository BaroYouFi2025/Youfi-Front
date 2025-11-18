import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import KakaoMap from '../../components/KakaoMap';
import YouFiLogo from '../../components/YouFiLogo';
import {
    Avatar,
    BatteryChip,
    BatteryText,
    Container,
    DistanceText,
    Divider,
    Header,
    MapCard,
    NameRow,
    PersonContent,
    PersonName,
    PersonRow,
    PersonSection,
    ScreenScroll,
    SeparatorDot,
    Spacer,
    Title,
    TitleRow
} from './GpsTrackingScreen.styles';

export default function GpsTrackingScreen() {
  // TODO: 실제 GPS 데이터로 교체 필요
  const [userLocation, setUserLocation] = useState({
    latitude: 37.5665,
    longitude: 126.9780
  });

  return (
    <Container edges={['top']}>
      <StatusBar style="dark" />
      <ScreenScroll>
        <Header>
          <YouFiLogo />
        </Header>

        <TitleRow>
          <Title>GPS</Title>
          <Ionicons name="chevron-forward" size={20} color="#16171a" />
        </TitleRow>

        <MapCard>
          <KakaoMap
            latitude={userLocation.latitude}
            longitude={userLocation.longitude}
            zoom={3}
          />
        </MapCard>

        <PersonSection>
          <PersonRow>
            <Avatar />
            <PersonContent>
              <NameRow>
                <PersonName>이름</PersonName>
                <SeparatorDot>·</SeparatorDot>
                <DistanceText>2.4km</DistanceText>
              </NameRow>
              <BatteryChip>
                <Ionicons name="battery-full" size={16} color="#24c879" />
                <BatteryText>78%</BatteryText>
              </BatteryChip>
            </PersonContent>
          </PersonRow>
        </PersonSection>

        <Divider />
        <Spacer />
      </ScreenScroll>
    </Container>
  );
}
