import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React, { useMemo, useState } from 'react';
import KakaoMap from '../../components/KakaoMap';
import {
  Avatar,
  BottomPanel,
  ChipsWrap,
  Container,
  ContentCard,
  ContentScroll,
  Divider,
  HandleBar,
  MapWrapper,
  MemberName,
  MemberRow,
  MemberSection,
  PanelTitle,
  RelationButton,
  RelationButtonText,
  RelationChip,
  RelationChipText,
  SearchField,
  SearchRow,
  SubmitButton,
  SubmitButtonText,
  Title
} from './GpsAddScreen.styles';

const MOCK_MEMBERS = ['김철수', '김영희'];
const RELATION_OPTIONS = ['가족', '친구', '연인', '이웃', '아버지', '어머니', '기타'];

export default function GpsAddScreen() {
  const [selectedName] = useState(MOCK_MEMBERS[0]);

  const relations = useMemo(() => RELATION_OPTIONS, []);

  return (
    <Container edges={['top']}>
      <StatusBar style="dark" />
      <MapWrapper>
        <KakaoMap latitude={37.5665} longitude={126.9780} zoom={3} />
      </MapWrapper>

      <ContentCard>
        <ContentScroll>
          <HandleBar />
          <Title>구성원 추가</Title>

          <SearchRow>
            <Ionicons name="search" size={20} color="#bdbdbd" />
            <SearchField
              placeholder="초대할 사용자의 아이디를 입력하세요."
              placeholderTextColor="rgba(0, 0, 0, 0.4)"
              returnKeyType="search"
            />
          </SearchRow>

          <MemberSection>
            {MOCK_MEMBERS.map((name, index) => (
              <React.Fragment key={name}>
                <MemberRow>
                  <Avatar />
                  <MemberName>{name}</MemberName>
                  <RelationButton activeOpacity={0.85}>
                    <RelationButtonText>관계 설정 +</RelationButtonText>
                  </RelationButton>
                </MemberRow>
                {index !== MOCK_MEMBERS.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </MemberSection>

          <BottomPanel>
            <PanelTitle>{`${selectedName}님의 관계를 선택해주세요.`}</PanelTitle>
            <ChipsWrap>
              {relations.map((relation) => (
                <RelationChip key={relation} activeOpacity={0.85}>
                  <RelationChipText>{relation}</RelationChipText>
                </RelationChip>
              ))}
            </ChipsWrap>
            <SubmitButton activeOpacity={0.9}>
              <SubmitButtonText>추가 요청하기</SubmitButtonText>
            </SubmitButton>
          </BottomPanel>
        </ContentScroll>
      </ContentCard>
    </Container>
  );
}
