import apiClient from '@/services/apiClient';
import { API_BASE_URL } from '@/services/config';
import { getMyMissingPersons } from '@/services/missingPersonAPI';
import { getNearbyPoliceOffices } from '@/services/policeOfficeAPI';
import { PoliceOffice } from '@/types/PoliceOfficeTypes';
import { getAccessToken } from '@/utils/authStorage';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, Linking, Platform, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './list.styles';

const DEFAULT_AVATAR = require('@/assets/images/default_profile.png');
const LOCAL_HOSTS = ['localhost', '127.0.0.1', '10.0.2.2'];

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
  const [myBasicData, setMyBasicData] = useState<MissingPerson[]>([]);
  const [basicData, setBasicData] = useState<MissingPerson[]>([]);
  const [policeData, setPoliceData] = useState<MissingPerson[]>([]);

  // 가까운 경찰청 찾기 상태
  const [isFindingPolice, setIsFindingPolice] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 20;
  const [basicTotalPages, setBasicTotalPages] = useState(1);
  const [basicHasMore, setBasicHasMore] = useState(true);
  const [policeTotalPages, setPoliceTotalPages] = useState(1);
  const [policeHasMore, setPoliceHasMore] = useState(true);
  const scrollRef = useRef<ScrollView | null>(null);

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

const API_BASE_FOR_DEVICE = normalizeHostForDevice(API_BASE_URL.replace(/\/+$/, ''));
const API_HOST = (() => {
  try {
    return new URL(API_BASE_FOR_DEVICE).host;
  } catch {
    return null;
  }
})();

const resolvePhotoUrl = (url?: string) => {
  if (!url) return '';
  const normalizedInput = normalizeHostForDevice(url);
  const base = API_BASE_FOR_DEVICE;

  try {
    const parsed = new URL(normalizedInput);
    const host = parsed.hostname;
    const shouldUseApiHost = (API_HOST && host === API_HOST) || LOCAL_HOSTS.includes(host);

    if (shouldUseApiHost) {
      return `${base}${parsed.pathname}${parsed.search ?? ''}`;
    }

    return parsed.toString();
  } catch {
    // If parsing fails, treat as relative and attach to API base
  }

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
      const rawPhoto =
        it.photoUrl
        ?? it.photoURL
        ?? it.photo_url
        ?? it.imageUrl
        ?? it.image_url
        ?? it.profileUrl
        ?? it.profile_url
        ?? it.appearanceImageUrl
        ?? it.appearance_image_url
        ?? it.predictedFaceUrl
        ?? it.predicted_face_url
        ?? it.image;
      const photoUrl = resolvePhotoUrl(rawPhoto);

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
        photoUrl,
      } as MissingPerson;
    })
    .filter((it: MissingPerson | null): it is MissingPerson => !!it);

  const enrichWithDetailPhotos = async (
    items: MissingPerson[],
    options?: { police?: boolean }
  ) => {
    const token = await getAccessToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

    const fetchDetail = async (id: string, path: string) => {
      try {
        const res = await apiClient.get(path, { headers });
        return res.data;
      } catch (error) {
        return null;
      }
    };

    const enriched = await Promise.all(
      items.map(async (item) => {
        if (item.photoUrl) return item;

        const detailId = item.policeId ?? item.id;
        const paths = options?.police
          ? [
              `/missing/police/missing-persons/${detailId}`,
              `/missing/police/missing_persons/${detailId}`,
              `/missing/police/${detailId}`,
            ]
          : [
              `/missing-persons/${detailId}`,
              `/missing_persons/${detailId}`,
            ];

        let detail = null;
        for (const path of paths) {
          detail = await fetchDetail(detailId, path);
          if (detail) break;
        }

        if (detail) {
          const detailPhoto =
            detail?.photoUrl
            ?? detail?.photoURL
            ?? detail?.photo_url
            ?? detail?.appearanceImageUrl
            ?? detail?.appearance_image_url
            ?? detail?.predictedFaceUrl
            ?? detail?.predicted_face_url
            ?? detail?.image;

          if (detailPhoto) {
            return { ...item, photoUrl: resolvePhotoUrl(detailPhoto) };
          }
        }

        return item;
      })
    );
    return enriched;
  };

  // "찾는 중" 섹션용: 내가 등록한 실종자 조회
  const fetchMyMissingPersons = async () => {
    try {
      const items = await getMyMissingPersons();
      const mapped = mapToListData(items);
      const enriched = await enrichWithDetailPhotos(mapped);
      setMyMissingPersons(enriched);
    } catch (err) {
      console.log('❌ 내가 등록한 실종자 불러오기 실패:', err);
      setMyMissingPersons([]); // API 실패 시 빈 배열
    }
  };

  const fetchBasicData = async (pageIndex: number = 0) => {
    try {
      const token = await getAccessToken();
      const res = await apiClient.get('/missing-persons/search', {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        params: { page: pageIndex, size: PAGE_SIZE },
      });

      const raw = res.data;
      const items = Array.isArray(raw)
        ? raw
        : raw?.content
          ?? raw?.data?.content
          ?? [];

      const totalElements = raw?.totalElements ?? raw?.data?.totalElements ?? raw?.total_elements;
      const total = raw?.totalPages
        ?? raw?.data?.totalPages
        ?? raw?.total_pages
        ?? (typeof totalElements === 'number' ? Math.ceil(totalElements / PAGE_SIZE) : 1);

      const mapped = mapToListData(items);
      const enriched = await enrichWithDetailPhotos(mapped);
      setBasicData(enriched);
      const nextTotalPages = Math.max(1, Number(total) || 1);
      setBasicTotalPages(nextTotalPages);

      const hasMoreByTotal = Number.isFinite(nextTotalPages) ? pageIndex + 1 < nextTotalPages : false;
      const hasMoreByCount = mapped.length === PAGE_SIZE;
      const hasMore = hasMoreByTotal || (!Number.isFinite(nextTotalPages) && hasMoreByCount);
      setBasicHasMore(hasMore);
    } catch (err) {
      setBasicData([]);
      setBasicTotalPages(1);
      setBasicHasMore(false);
    }
  };

  const fetchMyData = async () => {
    try {
      const list = await getMyMissingPersons();
      const mapped = mapToListData(list);
      const enriched = await enrichWithDetailPhotos(mapped);
      setMyBasicData(enriched);
    } catch (err) {
      setMyBasicData([]);
    }
  };

  const fetchPoliceData = async () => {
    try {
      const token = await getAccessToken();

      const res = await apiClient.get('/missing/police/missing-persons', {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        params: { page, size: PAGE_SIZE },
      });

      const raw = res.data;
      const items = Array.isArray(raw)
        ? raw
        : raw?.content
          ?? raw?.data?.content
          ?? [];

      const totalElements = raw?.totalElements ?? raw?.data?.totalElements ?? raw?.total_elements;
      const total = raw?.totalPages
        ?? raw?.data?.totalPages
        ?? raw?.total_pages
        ?? (typeof totalElements === 'number' ? Math.ceil(totalElements / PAGE_SIZE) : 1);

      const mapped = mapToListData(items);
      const enriched = await enrichWithDetailPhotos(mapped, { police: true });
      setPoliceData(enriched);
      const nextTotalPages = Math.max(1, Number(total) || 1);
      setPoliceTotalPages(nextTotalPages);
      const hasMoreByTotal = Number.isFinite(nextTotalPages) ? page + 1 < nextTotalPages : false;
      const hasMoreByCount = mapped.length === PAGE_SIZE;
      const hasMore = hasMoreByTotal || (!Number.isFinite(nextTotalPages) && hasMoreByCount);
      setPoliceHasMore(hasMore);
    } catch (err) {
      setPoliceData([]);
      setPoliceTotalPages(1);
      setPoliceHasMore(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchMyMissingPersons();
      fetchMyData();
      if (source === 'basic') {
        fetchBasicData(page);
      } else {
        fetchPoliceData();
      }
    }, [source, page])
  );

  useEffect(() => {
    if (source === 'basic') {
      fetchBasicData(page);
    } else {
      fetchPoliceData();
    }
  }, [page, source]);

  useEffect(() => {
    setPage(0);
  }, [source]);

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

      console.log('🔎 Fetching nearby police offices with coords:', coords);
      const offices = await getNearbyPoliceOffices({
        latitude: coords.latitude,
        longitude: coords.longitude,
        radiusMeters: 2000,
        limit: 1,
      });
      console.log('🔎 Nearby police offices response:', offices);

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
    scrollRef.current?.scrollTo({ y: 0, animated: true });
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
    return policeData;
  }, [source, basicData, policeData]);

  const displayTotalPages = useMemo(() => {
    if (source === 'basic') {
      return Math.max(basicTotalPages, page + 1 + (basicHasMore ? 1 : 0));
    }
    return Math.max(policeTotalPages, page + 1 + (policeHasMore ? 1 : 0));
  }, [source, basicTotalPages, page, basicHasMore, policeTotalPages, policeHasMore]);

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
      <ScrollView ref={scrollRef} contentContainerStyle={styles.scrollContent}>

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
            {page + 1} / {displayTotalPages}
          </Text>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              if (source === 'basic' && !basicHasMore) return;
              if (source === 'police' && !policeHasMore) return;
              setPage((p) => p + 1);
            }}
            disabled={source === 'basic' ? !basicHasMore : !policeHasMore}
            style={[
              styles.pillBtnBlue,
              {
                opacity:
                  source === 'basic'
                    ? basicHasMore ? 1 : 0.4
                    : policeHasMore ? 1 : 0.4,
              },
            ]}
          >
            <Text style={styles.pillBtnText}>다음</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
