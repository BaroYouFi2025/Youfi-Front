import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { router, useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import KakaoMap from '../../components/KakaoMap';
import YouFiLogo from '../../components/YouFiLogo';
import { getMemberLocations } from '../../services/memberAPI';
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
  Spacer,
  BatteryShell,
  BatteryFill,
  BatteryCap
} from './GpsTrackingScreen.styles';

export default function GpsTrackingScreen() {
  // 구성원 위치 상태
  const [memberLocations, setMemberLocations] = useState<MemberLocation[]>([]);
  const [isSSEConnected, setIsSSEConnected] = useState(false);
  const [loadingMembers, setLoadingMembers] = useState(false);

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

  // 구성원 목록 불러오기
  const loadMemberLocations = useCallback(async () => {
    try {
      setLoadingMembers(true);
      const members = await getMemberLocations();
      setMemberLocations(members);
    } catch (error) {
      console.error('❌ 구성원 목록 불러오기 실패:', error);
      // 에러 발생 시에도 기존 상태 유지
    } finally {
      setLoadingMembers(false);
    }
  }, []);

  // SSE 연결: 화면 포커스 시에만 구성원 위치 실시간 수신
  useFocusEffect(
    useCallback(() => {
      connectMemberLocationStream({
        onUpdate: (members) => {
          setMemberLocations(members);
          setIsSSEConnected(true);
        },
        onError: (error) => {
          console.error('❌ SSE 오류:', error.message);
          setIsSSEConnected(false);
          // SSE 연결 실패 시 API로 구성원 목록 불러오기
          loadMemberLocations();
        },
        onHeartbeat: () => {
          // Heartbeat는 조용히 처리
          setIsSSEConnected(true);
        },
      });

      // 화면 이탈 시 연결 해제
      return () => {
        disconnectMemberLocationStream();
      };
    }, [loadMemberLocations])
  );

  // 구성원이 없을 때 초기 로드
  useEffect(() => {
    if (memberLocations.length === 0 && !loadingMembers && !isSSEConnected) {
      loadMemberLocations();
    }
  }, [memberLocations.length, loadingMembers, isSSEConnected, loadMemberLocations]);

  const handleReportPress = () => {
    router.push('/missing-report');
  };

  const handleRefresh = async () => {
    // 현재 위치 새로 조회
    setLocationLoading(true);
    await getCurrentLocation();
  };

  const handleAddPress = () => {
    router.push('/gps-tracking/add-member');
  };

  const clampBatteryLevel = (level: number) => {
    if (Number.isNaN(level)) return 0;
    return Math.min(100, Math.max(0, level));
  };

  const getBatteryColor = (level: number) => {
    if (level > 50) return '#24c879';
    if (level > 20) return '#f4c430';
    return '#ff5252';
  };

  const renderMemberRow = (member: MemberLocation) => {
    const batteryLevel = clampBatteryLevel(member.batteryLevel);
    const distanceText = Number.isFinite(member.distance) ? `${member.distance.toFixed(1)}km` : '- km';
    const batteryColor = getBatteryColor(batteryLevel);
    const batteryPercentText = `${Math.round(batteryLevel)}%`;

    return (
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
            <DistanceText>{distanceText}</DistanceText>
          </NameRow>
          <BatteryRow>
            <BatteryShell>
              <BatteryFill $fill={Math.max(8, batteryLevel)} $color={batteryColor} />
            </BatteryShell>
            <BatteryCap />
            <BatteryText>{batteryPercentText}</BatteryText>
          </BatteryRow>
        </PersonContent>
      </PersonRow>
    );
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
          {loadingMembers ? (
            <PersonRow>
              <PersonContent>
                <NameRow>
                  <ActivityIndicator size="small" color="#25b2e2" style={{ marginRight: 8 }} />
                  <PersonName>구성원 목록을 불러오는 중...</PersonName>
                </NameRow>
              </PersonContent>
            </PersonRow>
          ) : memberLocations.length === 0 ? (
            <PersonRow>
              <PersonName>구성원이 없습니다</PersonName>
            </PersonRow>
          ) : (
            memberLocations.map(renderMemberRow)
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
