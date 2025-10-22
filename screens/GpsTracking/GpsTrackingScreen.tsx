import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
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
  MapImage,
  MarkerCallout,
  MarkerIcon,
  MarkerPulse,
  MarkerWrapper,
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

const mapImage = 'http://localhost:3845/assets/16de3020fcb10c3df8d12c2de8111ce16efd8a53.png';

export default function GpsTrackingScreen() {
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
          <MapImage source={{ uri: mapImage }} resizeMode="cover">
            <MarkerWrapper>
              <MarkerPulse />
              <MarkerIcon>
                <Ionicons name="person" size={24} color="#ffffff" />
              </MarkerIcon>
              <MarkerCallout />
            </MarkerWrapper>
          </MapImage>
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
