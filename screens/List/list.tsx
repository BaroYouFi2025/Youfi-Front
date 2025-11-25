import apiClient from '@/services/apiClient';
import { getMyMissingPersons } from '@/services/missingPersonAPI';
import { getAccessToken } from '@/utils/authStorage';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, Image, Platform, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './list.styles';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080';
const DEFAULT_AVATAR = require('@/assets/images/default_profile.png');

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
  const [myBasicData, setMyBasicData] = useState<MissingPerson[]>([]);
  const [basicData, setBasicData] = useState<MissingPerson[]>([]);
  const [policeData, setPoliceData] = useState<MissingPerson[]>([]);
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

const resolvePhotoUrl = (url?: string) => {
  if (!url) return '';
  const normalizedInput = normalizeHostForDevice(url);
  if (normalizedInput.startsWith('http')) return normalizedInput;
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

  const enrichWithDetailPhotos = async (items: MissingPerson[]) => {
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

        // 1) 대시 경로 우선
        const detailDash = await fetchDetail(item.id, `/missing-persons/${item.id}`);
        const detail = detailDash || await fetchDetail(item.id, `/missing_persons/${item.id}`);

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
      setPoliceData(mapped);
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

        {topItem && <Item item={topItem} variant="top" />}
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
