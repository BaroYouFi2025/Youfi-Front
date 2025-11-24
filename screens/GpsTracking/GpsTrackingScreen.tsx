import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useState } from 'react';
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

  // 현재 위치 상태 (실제 GPS 데이터)
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationLoading, setLocationLoading] = useState(true);

  // 위치 정보 가져오기
  const getCurrentLocation = useCallback(async () => {
    try {
      // 1. 위치 서비스 활성화 여부 확인
      const enabled = await Location.hasServicesEnabledAsync();
      if (!enabled) {
        // 위치 서비스가 비활성화된 경우 기본값 사용
        setUserLocation({ latitude: 37.5665, longitude: 126.9780 });
        setLocationLoading(false);
        return null;
      }

      // 2. 권한 확인
      let { status } = await Location.getForegroundPermissionsAsync();
      if (status !== 'granted') {
        const permissionResult = await Location.requestForegroundPermissionsAsync();
        status = permissionResult.status;
        if (status !== 'granted') {
          // 권한이 없으면 기본값 사용
          setUserLocation({ latitude: 37.5665, longitude: 126.9780 });
          setLocationLoading(false);
          return null;
        }
      }

      // 3. 마지막으로 알려진 위치 먼저 시도 (빠름)
      let location = await Location.getLastKnownPositionAsync();

      // 4. 없으면 현재 위치 조회 (정확함, 느림)
      if (!location) {
        location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
      }

      if (location) {
        const coords = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        setUserLocation(coords);
        setLocationLoading(false);
        return coords;
      }

      // 위치를 가져올 수 없으면 기본값 사용
      setUserLocation({ latitude: 37.5665, longitude: 126.9780 });
      setLocationLoading(false);
      return null;
    } catch (error) {
      console.error('❌ 위치 조회 실패:', error);
      // 에러 발생 시 기본값 사용
      setUserLocation({ latitude: 37.5665, longitude: 126.9780 });
      setLocationLoading(false);
      return null;
    }
  }, []);

  // 초기 위치 로드
  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  // SSE 연결: 구성원 위치 실시간 수신
  useEffect(() => {
    connectMemberLocationStream({
      onUpdate: (members) => {
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
      disconnectMemberLocationStream();
    };
  }, []);

  const handleReportPress = () => {
    router.push('/missing-report');
  };

  const handleRefresh = async () => {
    // 현재 위치 새로 조회
    setLocationLoading(true);
    await getCurrentLocation();
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
