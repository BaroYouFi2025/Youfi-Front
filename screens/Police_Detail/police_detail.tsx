import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { styles } from './police_detail.style';
import ConfirmReportModal from './ConfirmReportModal';
import SuccessReportModal from './SuccessReportModal';
import { reportMissingPersonSighting } from '@/services/missingPersonAPI';
import { getNearbyPoliceOffices } from '@/services/policeOfficeAPI';
import { PoliceOffice } from '@/types/PoliceOfficeTypes';
import apiClient from '@/services/apiClient';
import { API_BASE_URL } from '@/services/config';
import { getAccessToken } from '@/utils/authStorage';

const DEFAULT_AVATAR = require('@/assets/images/default_profile.png');

type Coordinates = {
  latitude: number;
  longitude: number;
};

type PoliceDetailResponse = {
  id?: number;
  name?: string;
  occurrenceDate?: string;
  dress?: string;
  statusCode?: string;
  gender?: string;
  occurrenceAddress?: string;
  specialFeatures?: string;
  missingAge?: number;
  ageNow?: number;
  photoUrl?: string;
};

const STATUS_MAP: Record<string, string> = {
  '010': '가출인',
  '020': '실종아동',
  '030': '치매환자',
};

const formatDate = (value?: string) => {
  if (!value) return value;
  const digitsOnly = value.replace(/[^0-9]/g, '');
  if (digitsOnly.length === 8) {
    const year = digitsOnly.slice(0, 4);
    const month = digitsOnly.slice(4, 6);
    const day = digitsOnly.slice(6, 8);
    return `${year}-${month}-${day}`;
  }

  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().slice(0, 10);
  }
  return value;
};

const formatDateWithWeekday = (value?: string) => {
  if (!value) return '-';
  const normalized = value.replace(/\s+/g, ' ');
  const parsed = new Date(normalized);

  // 숫자 8자리만 오는 경우 대비
  if (Number.isNaN(parsed.getTime())) {
    const digitsOnly = normalized.replace(/[^0-9]/g, '');
    if (digitsOnly.length === 8) {
      const y = digitsOnly.slice(0, 4);
      const m = digitsOnly.slice(4, 6);
      const d = digitsOnly.slice(6, 8);
      const dateObj = new Date(`${y}-${m}-${d}T00:00:00`);
      if (!Number.isNaN(dateObj.getTime())) {
        const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
        return `${y}-${m}-${d} (${weekdays[dateObj.getDay()]})`;
      }
      return `${y}-${m}-${d}`;
    }
    return value;
  }

  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  const y = parsed.getFullYear();
  const m = `${parsed.getMonth() + 1}`.padStart(2, '0');
  const d = `${parsed.getDate()}`.padStart(2, '0');
  const hh = `${parsed.getHours()}`.padStart(2, '0');
  const mm = `${parsed.getMinutes()}`.padStart(2, '0');
  const hasTime = /[T ]\d{1,2}:\d{1,2}/.test(normalized) || !(parsed.getHours() === 0 && parsed.getMinutes() === 0);
  const weekday = weekdays[parsed.getDay()];
  return hasTime ? `${y}-${m}-${d} (${weekday}) ${hh}:${mm}` : `${y}-${m}-${d} (${weekday})`;
};

const pickParam = (value?: string | string[]) => (Array.isArray(value) ? value[0] : value);

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
  const normalized = url.startsWith('/') ? url : `/${url}`;
  return normalizeHostForDevice(`${base}${normalized}`);
};

const PoliceDetailScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{
    id?: string;
    policeId?: string;
    name?: string;
    photoUrl?: string;
    location?: string;
    date?: string;
    info?: string;
  }>();

  const paramId = pickParam(params.id);
  const paramPoliceId = pickParam(params.policeId);
  const paramName = pickParam(params.name);
  const paramPhoto = pickParam(params.photoUrl);
  const paramLocation = pickParam(params.location);
  const paramDate = pickParam(params.date);
  const paramInfo = pickParam(params.info);
  const detailQueryId = paramPoliceId ?? paramId;
  const formattedParamDate = formatDate(paramDate);

  const [detail, setDetail] = useState<PoliceDetailResponse | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [isConfirmModalVisible, setConfirmModalVisible] = useState(false);
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<Coordinates | null>(null);
  const [isFindingPolice, setIsFindingPolice] = useState(false);
  const [policeOffice, setPoliceOffice] = useState<PoliceOffice | null>(null);
  const [policeError, setPoliceError] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    if (!detailQueryId) {
      return;
    }
    try {
      setLoadingDetail(true);
      const token = await getAccessToken();
      const response = await apiClient.get<PoliceDetailResponse>(
        `/missing/police/missing-persons/${detailQueryId}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        }
      );
      const data = response.data;
      const resolvedId = data?.id ?? (data as any)?.missingPersonId ?? (data as any)?.personId ?? detailQueryId;
      const resolvedDate = formatDate(data?.occurrenceDate ?? (data as any)?.missingDate ?? (data as any)?.missing_date);
      setDetail({
        id: resolvedId ? Number(resolvedId) : undefined,
        name: data?.name,
        occurrenceDate: resolvedDate,
        dress: data?.dress,
        statusCode: data?.statusCode ?? (data as any)?.status_code,
        gender: data?.gender,
        occurrenceAddress: data?.occurrenceAddress ?? (data as any)?.address,
        specialFeatures: data?.specialFeatures,
        missingAge: data?.missingAge,
        ageNow: data?.ageNow,
        photoUrl: resolvePhotoUrl(
          data?.photoUrl
          ?? (data as any)?.photoURL
          ?? (data as any)?.photo_url
        ) || resolvePhotoUrl(paramPhoto),
      });
    } catch (error) {
      console.error('경찰청 상세 조회 실패:', error);
    } finally {
      setLoadingDetail(false);
    }
  }, [detailQueryId, paramPhoto]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const uiData = useMemo(() => {
    const fallbackName = paramName || '이름 미상';
    const fallbackPhoto = resolvePhotoUrl(paramPhoto);
    return {
      reportId: paramId && !Number.isNaN(Number(paramId)) ? Number(paramId) : undefined,
      policeId: detail?.id ?? (paramPoliceId ? Number(paramPoliceId) : undefined),
      name: detail?.name || fallbackName,
      missingAge: detail?.missingAge,
      ageNow: detail?.ageNow,
      occurrenceDate: detail?.occurrenceDate || formattedParamDate,
      dress: detail?.dress || paramInfo,
      category: detail?.statusCode ? STATUS_MAP[detail.statusCode] || detail.statusCode : '경찰청 데이터',
      gender: detail?.gender,
      occurrenceAddress: detail?.occurrenceAddress || paramLocation,
      specialFeatures: detail?.specialFeatures || paramInfo,
      photo: detail?.photoUrl || fallbackPhoto,
    };
  }, [detail, paramId, paramPoliceId, paramName, paramPhoto, paramLocation, paramDate, paramInfo]);

  const infoFields = useMemo(
    () => [
      { label: '이름', value: uiData.name },
      { label: '나이(당시)', value: uiData.missingAge !== undefined ? `${uiData.missingAge}세` : '-' },
      { label: '나이(현재)', value: uiData.ageNow !== undefined ? `${uiData.ageNow}세` : '-' },
      { label: '발생일시', value: formatDateWithWeekday(uiData.occurrenceDate) },
      { label: '인상착의', value: uiData.dress || '-' },
      { label: '대상구분', value: uiData.category || '-' },
      { label: '성별구분', value: uiData.gender || '-' },
      { label: '발생장소', value: uiData.occurrenceAddress || '-' },
    ],
    [uiData],
  );

  const resolveCurrentLocation = useCallback(async (): Promise<Coordinates | null> => {
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

  const openKakaoDirections = useCallback(async (from: Coordinates, office: PoliceOffice) => {
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

  const handleReport = () => {
    setConfirmModalVisible(true);
  };

  const handleCancel = () => {
    setConfirmModalVisible(false);
  };

  const handleConfirm = async () => {
    if (!uiData.reportId) {
      Alert.alert('신고 실패', '신고할 실종자 정보를 확인할 수 없습니다.');
      return;
    }

    setIsReporting(true);
    setLocationError(null);
    try {
      const coords = await resolveCurrentLocation();
      if (!coords) {
        setLocationError('현재 위치를 가져올 수 없습니다. 위치 권한을 확인해주세요.');
        return;
      }

      await reportMissingPersonSighting({
        missingPersonId: uiData.reportId,
        latitude: coords.latitude,
        longitude: coords.longitude,
      });

    setConfirmModalVisible(false);
      setSuccessModalVisible(true);
      setPoliceError(null);
    } catch (error) {
      console.error('신고 실패:', error);
      Alert.alert('신고 실패', error instanceof Error ? error.message : '신고 중 오류가 발생했습니다.');
    } finally {
      setIsReporting(false);
    }
  };

  const handleSuccessClose = () => setSuccessModalVisible(false);

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

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ConfirmReportModal
        visible={isConfirmModalVisible}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
        name={uiData.gender ? `${uiData.name} (${uiData.gender})` : uiData.name}
        ageAtTime={uiData.missingAge !== undefined ? `${uiData.missingAge}세` : undefined}
        avatar={uiData.photo ? { uri: uiData.photo } : DEFAULT_AVATAR}
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

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Text style={styles.backButtonText}>‹</Text>
          </TouchableOpacity>
        </View>

        {loadingDetail ? (
          <View style={{ paddingVertical: 24, alignItems: 'center' }}>
            <ActivityIndicator />
          </View>
        ) : null}

        <View style={styles.imageContainer}>
          <Image source={uiData.photo ? { uri: uiData.photo } : DEFAULT_AVATAR} style={styles.profileImage} />
        </View>

        <View style={styles.infoSection}>
          {infoFields.map((item, index) => (
            <View key={`${item.label}-${index}`} style={styles.infoRow}>
              <Text style={styles.infoLabel}>{item.label} : </Text>
              <Text style={styles.infoValue}>{item.value}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>기타사항 : </Text>
          <Text style={styles.infoValue}>{uiData.specialFeatures || '정보 없음'}</Text>
        </View>

        <View style={styles.spacer} />
      </ScrollView>

      <TouchableOpacity style={styles.reportButton} onPress={handleReport}>
        <Text style={styles.reportButtonText}>신고하기</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default PoliceDetailScreen;
