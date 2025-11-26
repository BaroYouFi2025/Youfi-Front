import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Text } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { getMemberLocations } from '../../services/memberAPI';
import { MemberLocation } from '../../types/MemberLocationTypes';
import {
  BottomContainer,
  Container,
  ContentContainer,
  Divider,
  Header,
  HomeIndicator,
  PersonButton,
  PersonInfo,
  PersonItem,
  PersonName,
  PersonRelation,
  ReportButton,
  ReportButtonText,
  Title
} from './MissingReportScreen.styles';

// Temporarily commented out to prevent crashes from localhost images
// const imgFrame26 = "http://localhost:3845/assets/3ef005867145012ea76d41793d430543e38d9d4f.png";
// const imgCellularConnection = "http://localhost:3845/assets/2f7af92a290b833d2dc02c2deffbd3cfb362cb8e.svg";
// const imgWifi = "http://localhost:3845/assets/f7362d49a3a3be2994a501c3031ce41d8e27f562.svg";
// const imgBattery = "http://localhost:3845/assets/146ff8f9e983bba6c0eef87deb916af7baef0c43.svg";

export default function MissingReportScreen() {
  const [members, setMembers] = useState<MemberLocation[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMembers = useCallback(async () => {
    try {
      setLoading(true);
      const memberList = await getMemberLocations();
      setMembers(memberList);
    } catch (error) {
      console.error('❌ 구성원 목록 불러오기 실패:', error);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadMembers();
    }, [loadMembers])
  );

  const handleBack = () => {
    router.back();
  };

  const handleReport = (member: MemberLocation) => {
    // 선택한 구성원의 정보를 전달하여 실종자 등록 화면으로 이동
    router.push({
      pathname: '/(tabs)/register',
      params: {
        name: member.name,
        latitude: member.location.latitude.toString(),
        longitude: member.location.longitude.toString(),
      }
    });
  };

  const handleMainReport = () => {
    // 실종자 등록 화면으로 이동
    router.push('/(tabs)/register');
  };

  return (
    <Container>
      {/* Content */}
      <ContentContainer>
        {/* Header */}
        <Header>
          <Title>실종 신고</Title>
        </Header>

        {/* Person List */}
        {loading ? (
          <PersonItem>
            <PersonInfo>
              <ActivityIndicator size="small" color="#25b2e2" style={{ marginRight: 8 }} />
              <PersonName>구성원 목록을 불러오는 중...</PersonName>
            </PersonInfo>
          </PersonItem>
        ) : members.length === 0 ? (
          <PersonItem>
            <PersonInfo>
              <PersonName>구성원이 없습니다</PersonName>
            </PersonInfo>
          </PersonItem>
        ) : (
          members.map((member, index) => (
            <React.Fragment key={member.userId}>
              <PersonItem>
                {/* Temporarily removed PersonImage to prevent crashes */}
                <PersonInfo>
                  <PersonName>{member.name}</PersonName>
                  <PersonRelation>{member.relationship}</PersonRelation>
                </PersonInfo>
                <PersonButton onPress={() => handleReport(member)}>
                  <ReportButtonText>신고 하기</ReportButtonText>
                </PersonButton>
              </PersonItem>
              {index < members.length - 1 && <Divider />}
            </React.Fragment>
          ))
        )}
      </ContentContainer>

      {/* Bottom Section */}
      <BottomContainer>
        <ReportButton onPress={handleMainReport}>
          <ReportButtonText style={{ color: 'white', fontSize: 20 }}>실종 신고</ReportButtonText>
        </ReportButton>
      </BottomContainer>

      {/* Home Indicator */}
      <HomeIndicator />
    </Container>
  );
}