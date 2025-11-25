import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator, Alert, Linking, Platform } from 'react-native';
import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { detailStyles } from './detail.styles';
import ConfirmReportModal from './ConfirmReportModal';
import SuccessReportModal from './SuccessReportModal';
import { getAccessToken } from '@/utils/authStorage';
import { reportMissingPersonSighting } from '@/services/missingPersonAPI';
import { getNearbyPoliceOffices } from '@/services/policeOfficeAPI';
import { PoliceOffice } from '@/types/PoliceOfficeTypes';
import KakaoMap from '@/components/KakaoMap';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080';
const DEFAULT_AVATAR = require('@/assets/images/default_profile.png');

type MissingPersonDetail = {
  id: string;
  name?: string;
  birthDate?: string;
  gender?: string;
  address?: string;
  missingDate?: string;
  height?: number;
  weight?: number;
  body?: string;
  bodyEtc?: string;
  clothesTop?: string;
  clothesBottom?: string;
  clothesEtc?: string;
  latitude?: number;
  longitude?: number;
  photoUrl?: string;
  predictedFaceUrl?: string;
  appearanceImageUrl?: string;
};

const formatAge = (birthDate?: string, at?: string) => {
  if (!birthDate) return undefined;
  const birth = new Date(birthDate);
  if (Number.isNaN(birth.getTime())) return undefined;
  const ref = at ? new Date(at) : new Date();
  if (Number.isNaN(ref.getTime())) return undefined;
  let age = ref.getFullYear() - birth.getFullYear();
  const m = ref.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && ref.getDate() < birth.getDate())) age -= 1;
  return age;
};

const normalizeHostForDevice = (url: string) => {
  if (Platform.OS === 'android') {
    return url
      .replace('://localhost', '://10.0.2.2')
      .replace('://127.0.0.1', '://10.0.2.2');
  }
  return url.replace('://127.0.0.1', '://localhost');
};

const resolvePhotoUrl = (url?: string) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  const base = API_BASE_URL.replace(/\/+$/, '');
  const path = url.startsWith('/') ? url : `/${url}`;
  return normalizeHostForDevice(`${base}${path}`);
};

const DetailScreen: React.FC = () => {
  const params = useLocalSearchParams<{
    id?: string;
    name?: string;
    photoUrl?: string;
    location?: string;
    date?: string;
    info?: string;
  }>();

  const router = useRouter();
  const [isConfirmModalVisible, setConfirmModalVisible] = useState(false);
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);
  const [detail, setDetail] = useState<MissingPersonDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isFindingPolice, setIsFindingPolice] = useState(false);
  const [policeOffice, setPoliceOffice] = useState<PoliceOffice | null>(null);
  const [policeError, setPoliceError] = useState<string | null>(null);

  const personId = params.id;

  const fetchDetail = async () => {
    if (!personId) return;
    try {
      setLoading(true);
      const token = await getAccessToken();
      const res = await axios.get(`${API_BASE_URL}/missing-persons/${personId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      const data = res.data;
      setDetail({
        id: (data.missingPersonId ?? data.id ?? '').toString(),
        name: data.name,
        birthDate: data.birthDate,
        gender: data.gender,
        address: data.address,
        missingDate: data.missingDate ?? data.missing_date,
        height: data.height,
        weight: data.weight,
        body: data.body,
        bodyEtc: data.bodyEtc,
        clothesTop: data.clothesTop,
        clothesBottom: data.clothesBottom,
        clothesEtc: data.clothesEtc,
        latitude: data.latitude,
        longitude: data.longitude,
        photoUrl: resolvePhotoUrl(data.photoUrl ?? params.photoUrl),
        predictedFaceUrl: resolvePhotoUrl(data.predictedFaceUrl),
        appearanceImageUrl: resolvePhotoUrl(data.appearanceImageUrl),
      });
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
    // 사용자 현재 위치 가져오기 (비동기, 지도 표시를 막지 않음)
    const loadUserLocation = async () => {
      try {
        // 먼저 마지막으로 알려진 위치 시도 (빠름)
        let { status } = await Location.getForegroundPermissionsAsync();
        if (status === 'granted') {
          const lastLocation = await Location.getLastKnownPositionAsync();
          if (lastLocation) {
            setUserLocation({
              latitude: lastLocation.coords.latitude,
              longitude: lastLocation.coords.longitude,
            });
            return;
          }
        }
        
        // 없으면 현재 위치 조회 (느림)
        const coords = await resolveCurrentLocation();
        if (coords) {
          setUserLocation(coords);
        }
      } catch (error) {
        console.error('사용자 위치 가져오기 실패:', error);
        // 위치 가져오기 실패해도 지도는 표시
      }
    };
    
    loadUserLocation();
  }, [personId]);

  const uiData = useMemo(() => {
    const d = detail;
    const name = d?.name || params.name || '이름 미상';
    const location = d?.address || params.location || '위치 정보 없음';
    const missingDate = d?.missingDate || params.date;
    const photo = d?.photoUrl || resolvePhotoUrl(params.photoUrl);
    const appearance = d?.appearanceImageUrl || '';
    const predicted = d?.predictedFaceUrl || '';

    return {
      name,
      location,
      missingDate,
      birthDate: d?.birthDate,
      ageAtMissing: formatAge(d?.birthDate, missingDate),
      currentAge: formatAge(d?.birthDate),
      height: d?.height,
      weight: d?.weight,
      body: d?.body,
      bodyEtc: d?.bodyEtc,
      clothesTop: d?.clothesTop,
      clothesBottom: d?.clothesBottom,
      clothesEtc: d?.clothesEtc,
      photo,
      appearance,
      predicted,
      latitude: d?.latitude,
      longitude: d?.longitude,
    };
  }, [detail, params.name, params.location, params.date, params.photoUrl]);

  const handleReport = () => {
    setConfirmModalVisible(true);
  };

  const handleCancel = () => {
    setConfirmModalVisible(false);
  };

  const resolveCurrentLocation = useCallback(async (): Promise<{ latitude: number; longitude: number } | null> => {
    try {
      let { status } = await Location.getForegroundPermissionsAsync();
      if (status !== 'granted') {
        const permissionResult = await Location.requestForegroundPermissionsAsync();
        status = permissionResult.status;
      }

      if (status !== 'granted') {
        Alert.alert('위치 권한 필요', '현재 위치를 가져오려면 위치 권한을 허용해주세요.');
        return null;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setCurrentLocation(coords);
      return coords;
    } catch (error) {
      console.error('위치 조회 실패:', error);
      Alert.alert('위치 조회 실패', '현재 위치를 가져오지 못했습니다.');
      return null;
    }
  }, []);

  const openKakaoDirections = useCallback(async (from: { latitude: number; longitude: number }, office: PoliceOffice) => {
    const fromLabel = encodeURIComponent('내 위치');
    const toLabel = encodeURIComponent(office.officeName || office.station || '경찰청');
    const url = `https://map.kakao.com/link/from/${fromLabel},${from.latitude},${from.longitude}/to/${toLabel},${office.latitude},${office.longitude}`;
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (!canOpen) {
        Alert.alert('길안내 실패', '카카오맵을 열 수 없습니다.');
        return;
      }
      await Linking.openURL(url);
    } catch (error) {
      console.error('카카오맵 길안내 실패:', error);
      Alert.alert('길안내 실패', '카카오맵을 열 수 없습니다.');
    }
  }, []);

  const handleFindPolice = useCallback(async () => {
    setPoliceError(null);
    setIsFindingPolice(true);
    try {
      const coords = currentLocation || (await resolveCurrentLocation());
      if (!coords) {
        setPoliceError('현재 위치를 가져오지 못했습니다.');
        return;
      }

      const offices = await getNearbyPoliceOffices({
        latitude: coords.latitude,
        longitude: coords.longitude,
        radiusMeters: 5000,
        limit: 5,
      });

      if (!offices.length) {
        setPoliceError('근처 경찰청을 찾지 못했습니다.');
        return;
      }

      const nearest = offices[0];
      setPoliceOffice(nearest);
      await openKakaoDirections(coords, nearest);
    } catch (error) {
      console.error('근처 경찰청 조회 실패:', error);
      setPoliceError(error instanceof Error ? error.message : '가까운 경찰청을 조회하지 못했습니다.');
    } finally {
      setIsFindingPolice(false);
    }
  }, [currentLocation, openKakaoDirections, resolveCurrentLocation]);

  const handleConfirm = async () => {
    if (!personId) {
      Alert.alert('신고 실패', '실종자 정보를 확인할 수 없습니다.');
      return;
    }

    setIsReporting(true);
    setLocationError(null);
    setPoliceError(null);
    setPoliceOffice(null);
    try {
      const coords = await resolveCurrentLocation();
      if (!coords) {
        setLocationError('현재 위치를 가져올 수 없습니다. 위치 권한을 확인해주세요.');
        return;
      }

      await reportMissingPersonSighting({
        missingPersonId: Number(personId),
        latitude: coords.latitude,
        longitude: coords.longitude,
      });

      setConfirmModalVisible(false);
      setSuccessModalVisible(true);
    } catch (error) {
      console.error('신고 실패:', error);
      Alert.alert('신고 실패', error instanceof Error ? error.message : '신고 중 오류가 발생했습니다.');
    } finally {
      setIsReporting(false);
    }
  };

  const handleSuccessClose = () => {
    setSuccessModalVisible(false);
    // 맵 화면으로 이동
    router.push('/(tabs)/gps');
  };

  return (
    <>
      <ConfirmReportModal
        visible={isConfirmModalVisible}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
        isSubmitting={isReporting}
        errorMessage={locationError}
      />
      <SuccessReportModal
        visible={isSuccessModalVisible}
        onClose={handleSuccessClose}
        onFindPolice={handleFindPolice}
        isFindingPolice={isFindingPolice}
        office={policeOffice}
        errorMessage={policeError}
      />

      <ScrollView style={detailStyles.container}>
        {loading && (
          <View style={{ paddingVertical: 40, alignItems: 'center' }}>
            <ActivityIndicator />
          </View>
        )}

        {/* 지도/대표 이미지 영역 */}
        <View style={detailStyles.mapContainer}>
          {uiData.latitude && uiData.longitude ? (
            <>
              <KakaoMap
                currentLocation={userLocation}
                nearbyPersons={[
                  {
                    id: detail?.id ?? params.id ?? 'missing-person',
                    name: uiData.name,
                    latitude: uiData.latitude,
                    longitude: uiData.longitude,
                    photo_url: uiData.photo,
                  },
                ]}
              />
            </>
          ) : (
            <>
              {uiData.appearance ? (
                <Image
                  source={{ uri: uiData.appearance }}
                  style={detailStyles.mapImage}
                />
              ) : null}
            </>
          )}
        </View>

        <View style={detailStyles.infoSection}>
          <Image
            source={uiData.photo ? { uri: uiData.photo } : DEFAULT_AVATAR}
            style={detailStyles.avatar}
          />

          <View style={detailStyles.nameAgeContainer}>
            <Text style={detailStyles.nameText}>
              {uiData.name}
              {uiData.ageAtMissing !== undefined ? ` • ${uiData.ageAtMissing}세(당시)` : ''}
            </Text>
            <Text style={detailStyles.dateText}>
              {uiData.missingDate || '실종 일시 정보 없음'}
            </Text>
          </View>
        </View>

        <View style={detailStyles.divider} />

        {/* 인상착의 */}
        <View style={detailStyles.section}>
          <Text style={detailStyles.sectionTitle}>인상착의</Text>
          <View style={detailStyles.descriptionContent}>
            {uiData.appearance ? (
              <Image
                source={{ uri: uiData.appearance }}
                style={detailStyles.descriptionImage}
              />
            ) : null}
            <View style={detailStyles.descriptionDetails}>
              <Text style={detailStyles.detailLine}><Text style={detailStyles.detailLabel}>상의 :</Text> {uiData.clothesTop || '정보 없음'}</Text>
              <Text style={detailStyles.detailLine}><Text style={detailStyles.detailLabel}>하의 :</Text> {uiData.clothesBottom || '정보 없음'}</Text>
              <Text style={detailStyles.detailLine}><Text style={detailStyles.detailLabel}>기타 :</Text> {uiData.clothesEtc || uiData.bodyEtc || '정보 없음'}</Text>
              <Text style={detailStyles.detailLine}><Text style={detailStyles.detailLabel}>체형 :</Text> {uiData.body || '정보 없음'}</Text>

              <View style={detailStyles.separatorLine} />

              <Text style={detailStyles.detailLine}><Text style={detailStyles.detailLabel}>키 :</Text> {uiData.height ? `${uiData.height}cm` : '정보 없음'}</Text>
              <Text style={detailStyles.detailLine}><Text style={detailStyles.detailLabel}>몸무게 :</Text> {uiData.weight ? `${uiData.weight}kg` : '정보 없음'}</Text>
            </View>
          </View>
        </View>

        {/* 현재 모습 예측 */}
        <View style={detailStyles.section}>
          <Text style={detailStyles.sectionTitle}>현재 모습 예측</Text>
          <View style={detailStyles.descriptionContent}>
            {uiData.predicted ? (
              <Image
                source={{ uri: uiData.predicted }}
                style={detailStyles.currentLookImage}
              />
            ) : null}
            <View style={detailStyles.currentLookDetails}>
              <Text style={detailStyles.currentLookLine}>
                <Text style={detailStyles.detailLabel}>나이 :</Text> {uiData.currentAge !== undefined ? `${uiData.currentAge}세` : '정보 없음'}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ height: 100 }} />

        {/* 신고 버튼 */}
        <View style={detailStyles.reportButtonContainer}>
          <TouchableOpacity style={detailStyles.reportButton} onPress={handleReport}>
            <Text style={detailStyles.reportButtonText}>신고하기</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
};

export default DetailScreen;
