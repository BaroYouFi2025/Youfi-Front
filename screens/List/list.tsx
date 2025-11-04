import React, { useMemo, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { styles } from './list.styles';
import { useRouter } from 'expo-router';

type MissingPerson = {
  id: string;
  name: string;
  location: string;
  date?: string;   // 실종 일자 (경찰청 탭에서만 표시)
  info: string;    // 인상착의
  lat?: string;    // 위도
  lng?: string;    // 경도
};

// 기본/경찰청 더미 데이터
const BASIC_DATA: MissingPerson[] = [
  { id: '1', name: '이름', location: '실종 위치', info: '(인상착의 정보)', lat: '35.1465', lng: '129.0336' },
  { id: '2', name: '이름', location: '실종 위치', info: '(인상착의 정보)', lat: '35.1470', lng: '129.0340' },
];

const POLICE_DATA: MissingPerson[] = [
  { id: '1', name: '이름', location: '실종 위치', date: '실종 일자', info: '(인상착의 정보) - 키, 몸무게, 체형', lat: '35.1465', lng: '129.0336' },
  { id: '2', name: '이름', location: '실종 위치', date: '실종 일자', info: '(인상착의 정보) - 키, 몸무게, 체형', lat: '35.1470', lng: '129.0340' },
];

export default function MissingList() {
  const [source, setSource] = useState<'basic' | 'police'>('basic');
  const router = useRouter();

  const data = useMemo(() => (source === 'basic' ? BASIC_DATA : POLICE_DATA), [source]);

  const TopItem = ({ item }: { item: MissingPerson }) => (
    <View style={styles.itemRow}>
      <Image source={{ uri: 'https://via.placeholder.com/72' }} style={styles.avatar} />
      <View style={styles.itemTextWrap}>
        <Text style={styles.itemTitle}>
          {item.name} • {item.location}
          {source === 'police' && item.date ? ` • ${item.date}` : ''}
        </Text>
        <Text style={styles.itemSub}>{item.info}</Text>
      </View>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.pillBtn2}
        onPress={() =>
          router.push({
            pathname: '../screens/List/detail',
            params: { ...item },
          })
        }
      >
        <Text style={styles.pillBtnText}>자세히 보기</Text>
      </TouchableOpacity>
    </View>
  );

  const Item = ({ item }: { item: MissingPerson }) => (
    <View style={styles.itemRow}>
      <Image source={{ uri: 'https://via.placeholder.com/72' }} style={styles.avatar} />
      <View style={styles.itemTextWrap}>    
        <Text style={styles.itemTitle}>
          {item.name} • {item.location}
          {source === 'police' && item.date ? ` • ${item.date}` : ''}
        </Text>
        <Text style={styles.itemSub}>{item.info}</Text>
      </View>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.pillBtn}
        onPress={() =>
          router.push({
            pathname: '../screens/List/detail',
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
        <Text style={styles.sectionTitle}>찾는 중</Text>
        <TopItem item={data[0]} />
        <View style={styles.separator} />

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
