import { getSightingDetailFromNotification, markAsRead } from '@/services/notificationAPI';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import YouFiLogo from '@/components/YouFiLogo/YouFiLogo';
import {
  BackButton,
  Container,
  ContentContainer,
  FoundLocationText,
  FoundPersonText,
  FoundTitleText,
  Header,
  PersonImage,
  PersonImageContainer
} from './PersonFoundScreen.styles';

export default function PersonFoundScreen() {
  const params = useLocalSearchParams();
  const notificationId = params.notificationId ? Number(params.notificationId) : null;

  const [loading, setLoading] = useState(true);
  const [foundData, setFoundData] = useState<any>(null);

  useEffect(() => {
    if (notificationId) {
      loadFoundDetail();
      markNotificationAsRead();
    }
  }, [notificationId]);

  const loadFoundDetail = async () => {
    if (!notificationId) return;

    try {
      setLoading(true);

      const data = await getSightingDetailFromNotification(notificationId);

      setFoundData(data);
    } catch (error) {
      console.error('❌ 발견 정보 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const markNotificationAsRead = async () => {
    if (!notificationId) return;

    try {
      await markAsRead(notificationId);
    } catch (error) {
      console.error('❌ 알림 읽음 처리 실패:', error);
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <Container>
        <ActivityIndicator size="large" color="#25b2e2" style={{ marginTop: 100 }} />
      </Container>
    );
  }

  if (!foundData) {
    return (
      <Container>
        <View style={{ padding: 20, alignItems: 'center' }}>
          <Text style={{ color: '#949494' }}>데이터를 불러올 수 없습니다.</Text>
          <TouchableOpacity onPress={handleBack} style={{ marginTop: 20, padding: 10 }}>
            <Text style={{ color: '#25b2e2' }}>돌아가기</Text>
          </TouchableOpacity>
        </View>
      </Container>
    );
  }

  // API 응답 구조에 맞게 필드 매핑
  const personInfo = {
    name: foundData.missingPersonName || '이름 없음',
    reporterName: foundData.reporterName || '신고자 정보 없음',
    address: foundData.address || '위치 정보 없음',
    reportedAt: foundData.reportedAt || '',
    latitude: foundData.latitude,
    longitude: foundData.longitude,
    sightingId: foundData.sightingId,
    missingPersonId: foundData.missingPersonId,
  };

  return (
    <Container>
      {/* Header */}
      <Header>
        <BackButton onPress={handleBack}>
          <Ionicons name="chevron-back" size={24} color="#848587" />
        </BackButton>
      </Header>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, alignItems: 'center', paddingBottom: 100 }}
      >
        <ContentContainer>
          {/* 실종자 사진 */}
          <PersonImageContainer>
            {foundData.missingPersonPhotoUrl || foundData.photoUrl ? (
              <PersonImage
                source={{ uri: foundData.missingPersonPhotoUrl || foundData.photoUrl }}
                resizeMode="cover"
              />
            ) : (
              <View style={{ 
                width: '100%', 
                height: '100%', 
                backgroundColor: '#e5e7eb', 
                justifyContent: 'center', 
                alignItems: 'center' 
              }}>
                <Ionicons name="person" size={80} color="#949494" />
              </View>
            )}
          </PersonImageContainer>

          {/* 발견 메시지 */}
          <FoundTitleText>
            실종자 {personInfo.name}님이{'\n'}발견되었습니다
          </FoundTitleText>

          {/* 찾은 분 */}
          <FoundPersonText>
            찾은 분: {personInfo.reporterName} 님
          </FoundPersonText>

          {/* 발견 위치 */}
          <FoundLocationText>
            발견 위치: {personInfo.address}
          </FoundLocationText>
        </ContentContainer>
      </ScrollView>

      {/* 하단 YouFi 로고 */}
      <View style={{ position: 'absolute', bottom: 40, left: 0, right: 0, alignItems: 'center' }}>
        <YouFiLogo />
      </View>
    </Container>
  );
}

