import { getSightingDetailFromNotification, markAsRead } from '@/services/notificationAPI';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import {
  BackButton,
  Container,
  ContentContainer,
  DescriptionText,
  FoundBadge,
  FoundBadgeText,
  Header,
  InfoCard,
  NameText,
  Section,
  SectionTitle,
  Title
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
          <Ionicons name="chevron-back" size={24} color="#16171a" />
        </BackButton>
        <Title>발견</Title>
      </Header>

      <ScrollView showsVerticalScrollIndicator={false}>
        <ContentContainer>
          {/* 발견 배지 */}
          <FoundBadge>
            <Ionicons name="checkmark-circle" size={32} color="#24c879" />
            <FoundBadgeText>발견되었습니다</FoundBadgeText>
          </FoundBadge>

          {/* 실종자 이름 */}
          <View style={{ alignItems: 'center', marginTop: 24, marginBottom: 16 }}>
            <NameText>{personInfo.name}</NameText>
          </View>

          {/* 정보 카드 */}
          <InfoCard>
            <Section>
              <SectionTitle>신고자</SectionTitle>
              <DescriptionText>{personInfo.reporterName}</DescriptionText>
            </Section>

            <Section style={{ marginTop: 20 }}>
              <SectionTitle>발견 위치</SectionTitle>
              <DescriptionText>{personInfo.address}</DescriptionText>
              {personInfo.latitude && personInfo.longitude && (
                <DescriptionText style={{ marginTop: 4, fontSize: 12, color: '#949494' }}>
                  위도: {personInfo.latitude.toFixed(6)}, 경도: {personInfo.longitude.toFixed(6)}
                </DescriptionText>
              )}
            </Section>

            {personInfo.reportedAt && (
              <Section style={{ marginTop: 20 }}>
                <SectionTitle>신고 일시</SectionTitle>
                <DescriptionText>{new Date(personInfo.reportedAt).toLocaleString('ko-KR')}</DescriptionText>
              </Section>
            )}

            <Section style={{ marginTop: 20 }}>
              <SectionTitle>신고 ID</SectionTitle>
              <DescriptionText>#{personInfo.sightingId}</DescriptionText>
            </Section>
          </InfoCard>
        </ContentContainer>
      </ScrollView>
    </Container>
  );
}

