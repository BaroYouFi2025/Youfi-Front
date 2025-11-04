import React from 'react';
import { SafeAreaView, View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { styles } from './detail.styles';

export default function MissingDetail() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    id: string;
    name?: string;
    age?: string;
    appearance?: string;
    foundAt?: string;
    avatar?: string;
  }>();

  const name = params.name ?? '실종자1';
  const age = params.age ?? '13';
  const appearance = params.appearance ?? '000,000,000';
  const foundAt = params.foundAt ?? '부산소프트웨어마이스터고등학교';
  const avatar = params.avatar ?? 'https://via.placeholder.com/84';

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>

        {/* 상단 뒤로가기 */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Text style={styles.backArrow}>{'‹'}</Text>
          </TouchableOpacity>
        </View>

        {/* 지도 박스 (현재는 이미지, 추후 MapView로 교체 가능) */}
        <Image
          source={{ uri: 'https://static-map.roadgoat.com/placeholder-map.png' }}
          style={styles.mapBox}
          resizeMode="cover"
        />

        {/* 프로필 영역 */}
        <View style={styles.profileRow}>
          <Image source={{ uri: avatar }} style={styles.profileAvatar} />
          <Text style={styles.profileName}>{name}</Text>
        </View>

        {/* 정보 카드 */}
        <View style={styles.card}>
          <Text style={styles.itemLine}><Text style={styles.itemLabel}>이름: </Text>000({age}세)</Text>
          <Text style={styles.itemLine}><Text style={styles.itemLabel}>인상착의: </Text>{appearance}</Text>
          <Text style={styles.itemLine}><Text style={styles.itemLabel}>발견위치: </Text>{foundAt}</Text>

          <Text style={styles.warnText}>
            위 정보들과 일치합니까?{'\n'}
            일치하지 않거나 허위 정보일 시 불이익이 있을 수 있습니다.
          </Text>

          <TouchableOpacity style={styles.reportBtn} activeOpacity={0.9} onPress={() => {/* TODO: 신고 처리 */}}>
            <Text style={styles.reportBtnText}>신고하기</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
