import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import axios from 'axios';
import { styles } from './list.styles';
import { getAccessToken } from '@/utils/authStorage';

type MissingPerson = {
  id: string;
  name: string;
  location: string;
  date?: string;
  info: string;
  photoUrl?: string;
};

const POLICE_DATA: MissingPerson[] = [
  { id: '1', name: '이름', location: '실종 위치', info: '착의사항' },
  { id: '2', name: '이름', location: '실종 위치', info: '착의사항' },
];

export default function MissingList() {
  const router = useRouter();
  const [source, setSource] = useState<'basic' | 'police'>('basic');

  // 👉 API에서 불러올 데이터
  const [basicData, setBasicData] = useState<MissingPerson[]>([]);

  // ------------------------------------------------
  // 🔥 1) API 연동
  // ------------------------------------------------
  const fetchBasicData = async () => {
    try {
      const token = await getAccessToken();
      if (!token) return;

      const res = await axios.get('https://jjm.jojaemin.com/missing-persons/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const mapped = res.data.map((it: any) => ({
        id: it.missingPersonId.toString(),
        name: it.name,
        location: it.address,
        info: `(인상착의 정보) - ${it.height}cm, ${it.weight}kg, ${it.body}`,
        date: it.missing_date,
        photoUrl: it.photoUrl
      }));

      setBasicData(mapped);
    } catch (err) {
      console.log('❌ 실종자 불러오기 실패:', err);
    }
  };

  useEffect(() => {
    fetchBasicData();
  }, []);

  // ------------------------------------------------
  // 🔥 2) 기존 코드 유지 — 데이터만 API로 교체
  // ------------------------------------------------
  const data = useMemo(
    () => (source === 'basic' ? basicData : POLICE_DATA),
    [source, basicData]
  );

  // ------------------------------------------------
  // 🔥 3) 기존 Item UI 유지
  // ------------------------------------------------
  const Item = ({ item, isTop }: { item: MissingPerson; isTop?: boolean }) => (
    <View style={styles.itemRow}>
      <Image
        source={
          item.photoUrl
            ? { uri: item.photoUrl }
            : { uri: 'https://via.placeholder.com/72' }
        }
        style={styles.avatar}
      />

      <View style={styles.itemTextWrap}>
        <Text style={styles.itemTitle}>
          {item.name} • {item.location}
          {item.date ? ` • ${item.date}` : ''}
        </Text>

        <Text style={styles.itemSub}>{item.info}</Text>
      </View>

      <TouchableOpacity
        activeOpacity={0.8}
        style={isTop ? styles.pillBtnRed : styles.pillBtnBlue}
        onPress={() =>
          router.push({
            pathname: source === 'basic' ? '/detail' : '/police_detail',
            params: { ...item },
          })
        }
      >
        <Text style={styles.pillBtnText}>자세히 보기</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* 찾는 중 */}
        <Text style={styles.sectionTitle}>찾는 중</Text>

        {data[0] && <Item item={data[0]} isTop />}
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
          data={data.slice(1)}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => (
            <>
              <Item item={item} />
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
