import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import { styles } from './list.styles';
import { getAccessToken } from '@/utils/authStorage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://jjm.jojaemin.com';
const DEFAULT_AVATAR = require('@/assets/images/default_profile.png');
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
  name: string;
  location: string;
  date?: string;
  info: string;
  photoUrl?: string;
};

export default function MissingList() {
  const router = useRouter();
  const [source, setSource] = useState<'basic' | 'police'>('basic');

  // 👉 API에서 불러올 데이터
  const [basicData, setBasicData] = useState<MissingPerson[]>([]);
  const [policeData, setPoliceData] = useState<MissingPerson[]>([]);

  // ------------------------------------------------
  // 🔥 1) API 연동
  // ------------------------------------------------
  const resolvePhotoUrl = (url?: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const base = API_BASE_URL.replace(/\/+$/, '');
    const path = url.startsWith('/') ? url : `/${url}`;
    return `${base}${path}`;
  };

  const mapToListData = (items: any[]): MissingPerson[] => items
    .map((it: any) => {
      const id = (it.missingPersonId ?? it.missingPersonPoliceId ?? it.id ?? '').toString();

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
        id,
        name: it.name || '이름 미상',
        location: it.address || '위치 정보 없음',
        info: infoParts.length ? infoParts.join(', ') : '추가 정보 없음',
        date: it.missing_date ?? it.missingDate ?? it.occurrenceDate ?? it.occurredDate ?? it.createdAt,
        photoUrl: resolvePhotoUrl(it.photoUrl),
      } as MissingPerson;
    })
    .filter((it: MissingPerson) => !!it.id);

  const fetchBasicData = async () => {
    try {
      const token = await getAccessToken();

      const res = await axios.get(`${API_BASE_URL}/missing-persons/search`, {
        params: { page: 0, size: 20 },
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      // API 응답이 페이지 객체({ content: [...] }) 형태라 content를 우선 사용
      const raw = res.data;
      const items = Array.isArray(raw)
        ? raw
        : raw?.content
          ?? raw?.data?.content
          ?? [];

      setBasicData(mapToListData(items));
    } catch (err) {
      console.log('❌ 실종자 불러오기 실패:', err);
    }
  };

  const fetchPoliceData = async () => {
    try {
      const token = await getAccessToken();

      const res = await axios.get('https://jjm.jojaemin.com/missing/police/missing-persons', {
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

  useEffect(() => {
    fetchBasicData();
  }, []);

  useEffect(() => {
    if (source === 'police' && policeData.length === 0) {
      fetchPoliceData();
    }
  }, [source, policeData.length]);

  // ------------------------------------------------
  // 🔥 2) 기존 코드 유지 — 데이터만 API로 교체
  // ------------------------------------------------
  const data = useMemo(
    () => (source === 'basic' ? basicData : policeData),
    [source, basicData, policeData]
  );

  // 상단 "찾는 중" 카드에는 항상 내가 등록한 실종자 중 첫 번째 데이터를 사용
  const topItem = basicData[0];

  // ------------------------------------------------
  // 🔥 3) Item UI 수정: 텍스트를 두 줄로 분리
  // ------------------------------------------------
  const Item = ({ item, variant }: { item: MissingPerson; variant: 'top' | 'basic' | 'police' }) => {
    const isTop = variant === 'top';
    const isPolice = variant === 'police';
    const buttonText = isTop ? '수정하기' : '자세히 보기';
    const targetPath = isPolice ? '/police_detail' : '/detail';

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
            {item.date ? ` • ${item.date}` : ''}
          </Text>

          {/* 3. 인상착의 정보 (가장 작게) */}
          <Text style={styles.itemSub}>{item.info}</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          style={isTop ? styles.pillBtnRed : styles.pillBtnBlue}
          onPress={() => {
            router.push({
              pathname: targetPath,
              params: { ...item },
            });
          }}
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
          data={data}
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

        <TouchableOpacity activeOpacity={0.9} style={styles.ctaBtn}>
          <Text style={styles.ctaBtnText}>인근 실종자 목록 지도로 보기</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}
