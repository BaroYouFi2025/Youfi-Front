import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import KakaoMap from '../../components/KakaoMap';
import YouFiLogo from '../../components/YouFiLogo';
import { connectMemberLocationStream, disconnectMemberLocationStream } from '../../services/memberLocationAPI';
import { MemberLocation } from '../../types/MemberLocationTypes';
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
  // 구성원 위치 상태
  const [memberLocations, setMemberLocations] = useState<MemberLocation[]>([]);

  // TODO: 실제 GPS 데이터로 교체 필요
  const [userLocation, setUserLocation] = useState({
    latitude: 37.5665,
    longitude: 126.9780
  });

  // SSE 연결: 구성원 위치 실시간 수신
  useEffect(() => {
    console.log('📡 GPS 추적 화면 - 구성원 위치 SSE 연결 시작');

    connectMemberLocationStream({
      onUpdate: (members) => {
        console.log(`👥 구성원 위치 업데이트: ${members.length}명`);
        setMemberLocations(members);
      },
      onError: (error) => {
        console.error('❌ SSE 오류:', error.message);
      },
      onHeartbeat: () => {
        // Heartbeat 로그는 너무 빈번하므로 생략 가능
      },
    });

    // 컴포넌트 언마운트 시 연결 해제
    return () => {
      console.log('📡 GPS 추적 화면 - 구성원 위치 SSE 연결 해제');
      disconnectMemberLocationStream();
    };
  }, []);

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
            currentLocation={userLocation}
            nearbyPersons={[]}
            memberLocations={memberLocations}
          />
        </MapCard>

        <Divider />

        <PersonSection>
          {memberLocations.length === 0 ? (
            <PersonRow>
              <PersonContent>
                <NameRow>
                  <PersonName>구성원이 없습니다</PersonName>
                </NameRow>
              </PersonContent>
            </PersonRow>
          ) : (
            memberLocations.map((member, index) => (
              <PersonRow key={member.userId}>
                <Avatar />
                <PersonContent>
                  <NameRow>
                    <NameGroup>
                      <PersonName>{member.name}</PersonName>
                      <LabelBadge>
                        <LabelText>{member.relationship}</LabelText>
                      </LabelBadge>
                    </NameGroup>
                    <DistanceText>{member.distance.toFixed(1)}km</DistanceText>
                  </NameRow>
                  <BatteryRow>
                    <Ionicons
                      name={member.batteryLevel > 50 ? "battery-full" : member.batteryLevel > 20 ? "battery-half" : "battery-dead"}
                      size={20}
                      color={member.batteryLevel > 50 ? "#24c879" : member.batteryLevel > 20 ? "#f4c430" : "#ff5252"}
                    />
                    <BatteryText>{member.batteryLevel}%</BatteryText>
                  </BatteryRow>
                </PersonContent>
              </PersonRow>
            ))
          )}
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
