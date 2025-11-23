import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import apiClient from '@/services/apiClient';
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

  // 👉 API 데이터 상태
  const [basicData, setBasicData] = useState<MissingPerson[]>([]);

  // ------------------------------------------------
  // 🔥 1) API 연동
  // ------------------------------------------------
  const fetchBasicData = async () => {
    try {
      const token = await getAccessToken();
      if (!token) return;

      const res = await apiClient.get('/missing-persons/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      // 🔥 res.data.content 기반
      const list = res.data.content;

      if (!Array.isArray(list)) {
        console.log('❌ content가 배열이 아님:', list);
        return;
      }

      const mapped = list.map((it: any) => ({
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
  // 🔥 2) 기본 / 경찰청 데이터 스위칭
  // ------------------------------------------------
  const data = useMemo(
    () => (source === 'basic' ? basicData : POLICE_DATA),
    [source, basicData]
  );

  // ------------------------------------------------
  // 🔥 3) Item UI - 버튼은 항상 "수정하기", 상단(isTop) 클릭은 비활성화
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
        <Text style={styles.nameText}>{item.name}</Text>

        <Text style={styles.locationDateText}>
          {item.location}
          {item.date ? ` • ${item.date}` : ''}
        </Text>

        <Text style={styles.itemSub}>{item.info}</Text>
      </View>

      <TouchableOpacity
        activeOpacity={0.8}
        style={isTop ? styles.pillBtnRed : styles.pillBtnBlue}
        onPress={() => {
          // 🔥 찾는 중 항목은 아무 동작 안함
          if (isTop) return;

          // 🔥 나머지는 수정하기 화면으로 이동 (경로 변경 가능)
          router.push({
            pathname: '/', //여기에 수정하기 경로 집어 넣으면 됨!!!!!!!
            params: { ...item },
          });
        }}
      >
        <Text style={styles.pillBtnText}>수정하기</Text>
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
