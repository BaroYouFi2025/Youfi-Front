import apiClient from '@/services/apiClient';
import { getMyMissingPersons } from '@/services/missingPersonAPI';
import { getNearbyPoliceOffices } from '@/services/policeOfficeAPI';
import { PoliceOffice } from '@/types/PoliceOfficeTypes';
import { getAccessToken } from '@/utils/authStorage';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View, ActivityIndicator, Alert, Linking, Platform } from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './list.styles';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080';
const DEFAULT_AVATAR = require('@/assets/images/default_profile.png');
const BASIC_FALLBACK = [
  {
    missingPersonId: 2,
    name: '김실종',
    address: '대한민국 부산광역시 강서구 가락대로 1393',
    height: 165,
    weight: 55,
    body: '보통',
    photoUrl: null,
    missing_date: '2025-10-01T14:30'
  },
  {
    missingPersonId: 3,
    name: '김실종',
    address: '대한민국 부산광역시 강서구 가락대로 1393',
    height: 165,
    weight: 55,
    body: '보통',
    photoUrl: null,
    missing_date: '2025-10-01T14:30'
  },
  {
    missingPersonId: 4,
    name: '김현호',
    address: '대한민국 부산광역시 사하구 당리동336-30번지',
    height: 180,
    weight: 80,
    body: '통통',
    photoUrl: null,
    missing_date: '2025-11-22T09:53:14'
  },
  {
    missingPersonId: 5,
    name: '김현호호',
    address: '대한민국 부산광역시 중구 중구로 80-18',
    height: 150,
    weight: 20,
    body: '날씬',
    photoUrl: null,
    missing_date: '2025-11-22T13:32:37'
  },
  {
    missingPersonId: 7,
    name: '테스트맨',
    address: '대한민국 부산광역시 동래구 온천동 729-24',
    height: 165,
    weight: 55,
    body: '보통',
    photoUrl: null,
    missing_date: '2025-10-01T14:30'
  },
  {
    missingPersonId: 8,
    name: '테스트맨2',
    address: '대한민국 부산광역시 동래구 온천동 729-24',
    height: 165,
    weight: 55,
    body: '보통',
    photoUrl: null,
    missing_date: '2025-10-01T14:30'
  },
  {
    missingPersonId: 9,
    name: '김현호',
    address: '대한민국 부산광역시 중구 백산길 20',
    height: 180,
    weight: 80,
    body: '날씬',
    photoUrl: null,
    missing_date: '2025-11-23T10:08:35'
  }
];
const POLICE_FALLBACK = [
  {
    missingPersonId: 2,
    name: '김실종',
    address: '대한민국 부산광역시 강서구 가락대로 1393',
    height: 165,
    weight: 55,
    body: '보통',
    photoUrl: null,
    missing_date: '2025-10-01T14:30'
  },
  {
    missingPersonId: 3,
    name: '김실종',
    address: '대한민국 부산광역시 강서구 가락대로 1393',
    height: 165,
    weight: 55,
    body: '보통',
    photoUrl: null,
    missing_date: '2025-10-01T14:30'
  },
  {
    missingPersonId: 4,
    name: '김현호',
    address: '대한민국 부산광역시 사하구 당리동336-30번지',
    height: 180,
    weight: 80,
    body: '통통',
    photoUrl: null,
    missing_date: '2025-11-22T09:53:14'
  },
  {
    missingPersonId: 5,
    name: '김현호호',
    address: '대한민국 부산광역시 중구 중구로 80-18',
    height: 150,
    weight: 20,
    body: '날씬',
    photoUrl: null,
    missing_date: '2025-11-22T13:32:37'
  },
  {
    missingPersonId: 6,
    name: '이지은',
    address: '대한민국 경상남도 김해시 화목동 1752-8',
    height: 165,
    weight: 47,
    body: '마름',
    photoUrl: 'https://jjm.jojaemin.com/images/2025/11/23/64143431-b9f5-42c7-84d4-905fe488bce2.jpeg',
    missing_date: '2025-10-01T05:30'
  },
  {
    missingPersonId: 7,
    name: '테스트맨',
    address: '대한민국 부산광역시 동래구 온천동 729-24',
    height: 165,
    weight: 55,
    body: '보통',
    photoUrl: null,
    missing_date: '2025-10-01T14:30'
  },
  {
    missingPersonId: 8,
    name: '테스트맨2',
    address: '대한민국 부산광역시 동래구 온천동 729-24',
    height: 165,
    weight: 55,
    body: '보통',
    photoUrl: null,
    missing_date: '2025-10-01T14:30'
  },
  {
    missingPersonId: 9,
    name: '김현호',
    address: '대한민국 부산광역시 중구 백산길 20',
    height: 180,
    weight: 80,
    body: '날씬',
    photoUrl: null,
    missing_date: '2025-11-23T10:08:35'
  }
];

type MissingPerson = {
  id: string;
  policeId?: string;
  name: string;
  location: string;
  date?: string;
  info: string;
  photoUrl?: string;
};

export default function MissingList() {
  const router = useRouter();
  const [source, setSource] = useState<'basic' | 'police'>('basic');

  // 👉 API 데이터 상태
  const [myMissingPersons, setMyMissingPersons] = useState<MissingPerson[]>([]); // "찾는 중" 섹션용
  const [basicData, setBasicData] = useState<MissingPerson[]>([]);
  const [policeData, setPoliceData] = useState<MissingPerson[]>([]);
  
  // 가까운 경찰청 찾기 상태
  const [isFindingPolice, setIsFindingPolice] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [myBasicData, setMyBasicData] = useState<MissingPerson[]>([]);
  const [basicData, setBasicData] = useState<MissingPerson[]>([]);
  const [policeData, setPoliceData] = useState<MissingPerson[]>([]);
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 20;
  const [basicTotalPages, setBasicTotalPages] = useState(1);

  // ------------------------------------------------
  // 🔥 1) API 연동
  // ------------------------------------------------
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

const formatDateWithWeekday = (value?: string) => {
  if (!value) return '';
  const normalized = value.replace(/\s+/g, ' ');
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return value;
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, '0');
  const d = `${date.getDate()}`.padStart(2, '0');
  const hh = `${date.getHours()}`.padStart(2, '0');
  const mm = `${date.getMinutes()}`.padStart(2, '0');
  return `${y}-${m}-${d} (${weekdays[date.getDay()]}) ${hh}:${mm}`;
};

const normalizeId = (value: any): string | undefined => {
  if (value === null || value === undefined) return undefined;
  const str = String(value).trim();
  return str.length ? str : undefined;
};

const mapToListData = (items: any[]): MissingPerson[] => items
  .map((it: any) => {
    const missingPersonId = normalizeId(it.missingPersonId);
    const fallbackId = normalizeId(it.id);
    const policeId = normalizeId(it.missingPersonPoliceId ?? it.policeId ?? it.id);
      const resolvedId = missingPersonId ?? fallbackId ?? policeId;

      if (!resolvedId) {
        return null;
      }

      const height = it.height ? `${it.height}cm` : '';
      const weight = it.weight ? `${it.weight}kg` : '';
      const body = it.body || '';
      const dress = it.dress || '';

      const infoParts = [
        height && `키 ${height}`,
        weight && `몸무게 ${weight}`,
        body && `체형 ${body}`,
        dress && `복장 ${dress}`,
      ].filter(Boolean);

      return {
        id: resolvedId,
        policeId,
        name: it.name || '이름 미상',
        location: it.address || '위치 정보 없음',
        info: infoParts.length ? infoParts.join(', ') : '추가 정보 없음',
        date: it.missing_date ?? it.missingDate ?? it.occurrenceDate ?? it.occurredDate ?? it.createdAt,
        photoUrl: resolvePhotoUrl(it.photoUrl),
      } as MissingPerson;
  })
  .filter((it: MissingPerson | null): it is MissingPerson => !!it);

  const mergeWithFallback = (primary: MissingPerson[]) => {
    const fallback = mapToListData(BASIC_FALLBACK);
    const merged = [...primary, ...fallback];
    const unique = new Map<string, MissingPerson>();
    merged.forEach((item) => {
      unique.set(item.id, item);
    });
    return Array.from(unique.values());
  };

  // "찾는 중" 섹션용: 내가 등록한 실종자 조회
  const fetchMyMissingPersons = async () => {
    try {
      const items = await getMyMissingPersons();
      const mapped = mapToListData(items);
      setMyMissingPersons(mapped);
    } catch (err) {
      console.log('❌ 내가 등록한 실종자 불러오기 실패:', err);
      setMyMissingPersons([]); // API 실패 시 빈 배열
    }
  };

  const fetchBasicData = async () => {
  const fetchBasicData = async (pageIndex: number = 0) => {
    try {
      const token = await getAccessToken();
      const res = await apiClient.get('/missing-persons', {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        params: { page: pageIndex, size: PAGE_SIZE },
      });

      const raw = res.data;
      const items = Array.isArray(raw)
        ? raw
        : raw?.content
          ?? raw?.data?.content
          ?? [];

      const total = raw?.totalPages ?? raw?.data?.totalPages ?? raw?.total_pages ?? 1;

      const mapped = mapToListData(items);
      setBasicData(mergeWithFallback(mapped));
      setBasicTotalPages(Math.max(1, Number(total) || 1));
    } catch (err) {
      console.log('❌ 실종자 불러오기 실패:', err);
      setBasicData(mapToListData(BASIC_FALLBACK));
      setBasicTotalPages(1);
    }
  };

  const fetchMyData = async () => {
    try {
      const list = await getMyMissingPersons();
      setMyBasicData(mapToListData(list));
    } catch (err) {
      setMyBasicData([]);
    }
  };

  const fetchPoliceData = async () => {
    try {
      const token = await getAccessToken();

      const res = await apiClient.get('/missing/police/missing-persons', {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      const raw = res.data;
      const items = Array.isArray(raw)
        ? raw
        : raw?.content
          ?? raw?.data?.content
          ?? [];

      const mapped = mapToListData(items);
      setPoliceData(mapped.length ? mapped : mapToListData(POLICE_FALLBACK));
    } catch (err) {
      console.log('❌ 경찰청 실종자 불러오기 실패:', err);
      setPoliceData(mapToListData(POLICE_FALLBACK));
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchMyMissingPersons(); // "찾는 중" 섹션용
      fetchBasicData();
      fetchMyData();
      setPage(0);
    }, [])
  );

  useEffect(() => {
    if (source === 'police' && policeData.length === 0) {
      fetchPoliceData();
    }
    setPage(0);
  }, [source, policeData.length]);

  // 가까운 경찰청 찾기 함수
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
    setIsFindingPolice(true);
    try {
      const coords = currentLocation || (await resolveCurrentLocation());
      if (!coords) {
        Alert.alert('위치 조회 실패', '현재 위치를 가져오지 못했습니다.');
        return;
      }

      const offices = await getNearbyPoliceOffices({
        latitude: coords.latitude,
        longitude: coords.longitude,
        radiusMeters: 5000,
        limit: 5,
      });

      if (!offices.length) {
        Alert.alert('알림', '근처 경찰청을 찾지 못했습니다.');
        return;
      }

      const nearest = offices[0];
      await openKakaoDirections(coords, nearest);
    } catch (error) {
      console.error('근처 경찰청 조회 실패:', error);
      Alert.alert('오류', error instanceof Error ? error.message : '가까운 경찰청을 조회하지 못했습니다.');
    } finally {
      setIsFindingPolice(false);
    }
  }, [currentLocation, openKakaoDirections, resolveCurrentLocation]);
  useEffect(() => {
    if (source === 'basic') {
      fetchBasicData(page);
    }
  }, [page, source]);

  // ------------------------------------------------
  // 🔥 2) 기본 / 경찰청 데이터 스위칭
  // ------------------------------------------------
  const data = useMemo(
    () => (source === 'basic' ? basicData : policeData),
    [source, basicData, policeData]
  );

  const pagedData = useMemo(() => {
    if (source === 'basic') {
      return basicData;
    }
    const start = page * PAGE_SIZE;
    return data.slice(start, start + PAGE_SIZE);
  }, [data, page, PAGE_SIZE, source, basicData]);

  const totalPages = useMemo(() => {
    if (source === 'basic') {
      return basicTotalPages;
    }
    return Math.max(1, Math.ceil(data.length / PAGE_SIZE));
  }, [source, basicTotalPages, data.length, PAGE_SIZE]);

  // 상단 "찾는 중" 카드에는 항상 내가 등록한 실종자 중 첫 번째 데이터를 사용
  const topItem = myBasicData[0];

  // ------------------------------------------------
  // 🔥 3) Item UI 수정: 텍스트를 두 줄로 분리
  // ------------------------------------------------
  const Item = ({ item, variant }: { item: MissingPerson; variant: 'top' | 'basic' | 'police' }) => {
    const isTop = variant === 'top';
    const isPolice = variant === 'police';
    const buttonText = isTop ? '수정하기' : '자세히 보기';

    const handlePress = () => {
      if (isPolice) {
        router.push({
          pathname: '/police_detail' as const,
          params: { ...item },
        });
        return;
      }

      if (variant === 'basic') {
        router.push({
          pathname: '/detail' as const,
          params: {
            id: item.id,
            name: item.name,
            photoUrl: item.photoUrl,
            location: item.location,
            date: item.date,
            info: item.info,
          },
        });
        return;
      }

      router.push({
        pathname: '/missing-persons/[id]' as const,
        params: { id: item.id },
      });
    };

    return (
      <View style={styles.itemRow}>
        <Image
          source={item.photoUrl ? { uri: item.photoUrl } : DEFAULT_AVATAR}
          style={styles.avatar}
        />

        <View style={styles.itemTextWrap}>
          {/* 1. 이름 (굵게) */}
          <Text style={styles.nameText}>
            {item.name}
          </Text>

      {/* 2. 위치 및 날짜 (이름 아래, itemSub보다 굵게) */}
      <Text style={styles.locationDateText}>
        {item.location}
        {item.date ? ` • ${formatDateWithWeekday(item.date)}` : ''}
      </Text>

          {/* 3. 인상착의 정보 (가장 작게) */}
          <Text style={styles.itemSub}>{item.info}</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          style={isTop ? styles.pillBtnRed : styles.pillBtnBlue}
          onPress={handlePress}
        >
          <Text style={styles.pillBtnText}>{buttonText}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* 찾는 중 */}
        <Text style={styles.sectionTitle}>찾는 중</Text>

        {myMissingPersons.length > 0 ? (
          <>
            {myMissingPersons.map((item, index) => (
              <React.Fragment key={item.id}>
                <Item item={item} variant="top" />
                {index < myMissingPersons.length - 1 && <View style={styles.separator} />}
              </React.Fragment>
            ))}
          </>
        ) : basicData.length > 0 ? (
          <>
            <Item item={basicData[0]} variant="top" />
          </>
        ) : null}
        <View style={styles.separator} />

        {/* 실종자 목록 */}
        <View style={styles.listHeader}>
          <Text style={styles.sectionTitle}>실종자 목록</Text>

          <View style={styles.switchWrap}>
            <TouchableOpacity onPress={() => setSource('basic')}>
              <Text style={[styles.switchText, source === 'basic' ? styles.switchActive : styles.switchInactive]}>
                기본
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setSource('police')} style={{ marginLeft: 16 }}>
              <Text style={[styles.switchText, source === 'police' ? styles.switchActive : styles.switchInactive]}>
                경찰청
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 가까운 경찰청 찾기 버튼 */}
        <TouchableOpacity
          style={[styles.findPoliceButton, isFindingPolice && styles.findPoliceButtonDisabled]}
          onPress={handleFindPolice}
          disabled={isFindingPolice}
        >
          {isFindingPolice ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Ionicons name="map" size={18} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.findPoliceButtonText}>가까운 경찰청 찾기</Text>
            </>
          )}
        </TouchableOpacity>

        <FlatList
          data={pagedData}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => (
            <>
              <Item
                item={item}
                variant={source === 'police' ? 'police' : 'basic'}
              />
              <View style={styles.separator} />
            </>
          )}
          scrollEnabled={false}
        />

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            style={[styles.pillBtnBlue, { opacity: page === 0 ? 0.4 : 1 }]}
          >
            <Text style={styles.pillBtnText}>이전</Text>
          </TouchableOpacity>

          <Text style={{ color: '#111', fontWeight: '700' }}>
            {page + 1} / {totalPages}
          </Text>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            style={[styles.pillBtnBlue, { opacity: page >= totalPages - 1 ? 0.4 : 1 }]}
          >
            <Text style={styles.pillBtnText}>다음</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
