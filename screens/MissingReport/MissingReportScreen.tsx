import { router } from 'expo-router';
import React from 'react';
import {
  BackButton,
  BackIcon,
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
  StatusBarContainer,
  StatusBarTime,
  Title
} from './MissingReportScreen.styles';

// Temporarily commented out to prevent crashes from localhost images
// const imgFrame26 = "http://localhost:3845/assets/3ef005867145012ea76d41793d430543e38d9d4f.png";
// const imgCellularConnection = "http://localhost:3845/assets/2f7af92a290b833d2dc02c2deffbd3cfb362cb8e.svg";
// const imgWifi = "http://localhost:3845/assets/f7362d49a3a3be2994a501c3031ce41d8e27f562.svg";
// const imgBattery = "http://localhost:3845/assets/146ff8f9e983bba6c0eef87deb916af7baef0c43.svg";

export default function MissingReportScreen() {
  const handleBack = () => {
    router.back();
  };

  const handleReport = (personName: string) => {
    // 선택한 구성원의 이름을 전달하여 실종자 등록 화면으로 이동
    router.push({
      pathname: '/(tabs)/register',
      params: { name: personName }
    });
  };

  const handleMainReport = () => {
    // 실종자 등록 화면으로 이동
    router.push('/(tabs)/register');
  };

  return (
    <Container>
      {/* Status Bar */}
      <StatusBarContainer>
        <StatusBarTime>9:41</StatusBarTime>
        {/* StatusBarIcons temporarily removed to prevent crashes */}
      </StatusBarContainer>

      {/* Content */}
      <ContentContainer>
        {/* Header */}
        <Header>
          <BackButton onPress={handleBack}>
            <BackIcon />
          </BackButton>
          <Title>실종 신고</Title>
        </Header>

        {/* Person List */}
        {/* Person 1 - 김철수 */}
        <PersonItem>
          {/* Temporarily removed PersonImage to prevent crashes */}
          <PersonInfo>
            <PersonName>김철수</PersonName>
            <PersonRelation>동생</PersonRelation>
          </PersonInfo>
          <PersonButton onPress={() => handleReport('김철수')}>
            <ReportButtonText>신고 하기</ReportButtonText>
          </PersonButton>
        </PersonItem>

        <Divider />

        {/* Person 2 - 김영희 */}
        <PersonItem>
          {/* Temporarily removed PersonImage to prevent crashes */}
          <PersonInfo>
            <PersonName>김영희</PersonName>
            <PersonRelation>누나</PersonRelation>
          </PersonInfo>
          <PersonButton onPress={() => handleReport('김영희')}>
            <ReportButtonText>신고 하기</ReportButtonText>
          </PersonButton>
        </PersonItem>

        <Divider />
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