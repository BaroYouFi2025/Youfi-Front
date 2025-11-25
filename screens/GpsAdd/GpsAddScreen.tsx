import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert } from 'react-native';

import KakaoMap from '@/components/KakaoMap';
import { searchUsers } from '@/services/userAPI';
import { UserSummary } from '@/types/UserTypes';
import { getAccessToken } from '@/utils/authStorage';
import {
  Avatar,
  AvatarImage,
  BottomPanel,
  ChipsWrap,
  Container,
  ContentCard,
  ContentScroll,
  Divider,
  HandleBar,
  ListEmptyText,
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
  SearchStatus,
  SearchStatusText,
  SubmitButton,
  SubmitButtonText,
  Title
} from './GpsAddScreen.styles';

const RELATION_OPTIONS = ['가족', '친구', '연인', '이웃', '아버지', '어머니', '기타'];

export default function GpsAddScreen() {
  const [members, setMembers] = useState<UserSummary[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedRelation, setSelectedRelation] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const relations = useMemo(() => RELATION_OPTIONS, []);

  const handleSearch = useCallback(
    async (term?: string) => {
      // 빈 검색어일 때는 검색하지 않음
      if (!term || !term.trim()) {
        setMembers([]);
        setSelectedUserId(null);
        setSearchPerformed(false);
        return;
      }

      setLoading(true);
      setSearchPerformed(true);
      try {
        const token = await getAccessToken();
        if (!token) {
          Alert.alert('로그인이 필요해요', '다시 로그인한 후 검색을 진행해주세요.');
          setLoading(false);
          return;
        }

        const response = await searchUsers(
          {
            uid: term.trim(),
            page: 0,
            size: 20,
          },
          token,
        );

        const content = response.content || [];
        setMembers(content);

        if (content.length > 0) {
          setSelectedUserId(content[0].userId ?? null);
        } else {
          setSelectedUserId(null);
        }
      } catch (error) {
        Alert.alert('검색에 실패했어요', error instanceof Error ? error.message : '다시 시도해주세요.');
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // 초기 로드 시 검색하지 않음
  // useEffect(() => {
  //   handleSearch();
  // }, [handleSearch]);

  const selectedMemberName =
    members.find((member) => member.userId === selectedUserId)?.name ||
    members.find((member) => member.userId === selectedUserId)?.uid ||
    (members[0]?.name ?? members[0]?.uid) ||
    '구성원';

  const handleSelectRelation = (relation: string) => {
    setSelectedRelation(relation);
  };

  const handleSubmit = () => {
    if (!selectedUserId) {
      Alert.alert('구성원을 먼저 선택해주세요.');
      return;
    }
    if (!selectedRelation) {
      Alert.alert('관계를 선택해주세요.');
      return;
    }
    Alert.alert('추가 요청 준비 완료', `${selectedMemberName}님을 ${selectedRelation}으로 요청합니다.`, [
      { text: '확인' },
    ]);
  };

  return (
    <Container edges={['top']}>
      <StatusBar style="dark" />
      <MapWrapper>
        <KakaoMap currentLocation={{ latitude: 37.5665, longitude: 126.9780 }} nearbyPersons={[]} />
      </MapWrapper>

      <ContentCard>
        <ContentScroll>
          <HandleBar />
          <Title>구성원 추가</Title>

          <SearchStatus>
            {loading ? (
              <ActivityIndicator size="small" color="#25b2e2" />
            ) : (
              <SearchStatusText>
                {searchPerformed ? `검색 결과 ${members.length}명` : '주변 구성원을 불러오고 있어요'}
              </SearchStatusText>
            )}
          </SearchStatus>

          <SearchRow>
            <Ionicons name="search" size={20} color="#bdbdbd" />
            <SearchField
              value={searchTerm}
              onChangeText={setSearchTerm}
              placeholder="초대할 사용자의 아이디를 입력하세요."
              placeholderTextColor="rgba(0, 0, 0, 0.4)"
              returnKeyType="search"
              autoCapitalize="none"
              autoCorrect={false}
              onSubmitEditing={() => handleSearch(searchTerm)}
            />
          </SearchRow>

          <MemberSection>
            {members.map((member, index) => (
              <React.Fragment key={member.userId ?? member.uid ?? index}>
                <MemberRow>
                  {member.profileUrl ? (
                    <AvatarImage source={{ uri: member.profileUrl }} />
                  ) : (
                    <Avatar />
                  )}
                  <MemberName>{member.name || member.uid || '이름 없음'}</MemberName>
                  <RelationButton
                    activeOpacity={0.85}
                    $active={selectedUserId !== null && member.userId === selectedUserId}
                    onPress={() => {
                      setSelectedUserId(member.userId ?? null);
                      setSelectedRelation(null);
                    }}
                  >
                    <RelationButtonText>관계 설정 +</RelationButtonText>
                  </RelationButton>
                </MemberRow>
                {index !== members.length - 1 && <Divider />}
              </React.Fragment>
            ))}
            {!loading && members.length === 0 && searchPerformed && (
              <ListEmptyText>검색 결과가 없습니다.</ListEmptyText>
            )}
          </MemberSection>

          <BottomPanel>
            <PanelTitle>{`${selectedMemberName}님의 관계를 선택해주세요.`}</PanelTitle>
            <ChipsWrap>
              {relations.map((relation) => (
                <RelationChip
                  key={relation}
                  activeOpacity={0.85}
                  $active={selectedRelation === relation}
                  onPress={() => handleSelectRelation(relation)}
                >
                  <RelationChipText $active={selectedRelation === relation}>
                    {relation}
                  </RelationChipText>
                </RelationChip>
              ))}
            </ChipsWrap>
            <SubmitButton
              activeOpacity={0.9}
              disabled={!selectedUserId || !selectedRelation}
              onPress={handleSubmit}
            >
              <SubmitButtonText>추가 요청하기</SubmitButtonText>
            </SubmitButton>
          </BottomPanel>
        </ContentScroll>
      </ContentCard>
    </Container>
  );
}
