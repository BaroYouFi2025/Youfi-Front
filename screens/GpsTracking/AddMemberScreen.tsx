import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { inviteMember } from '../../services/memberAPI';
import { searchUsers } from '../../services/userAPI';
import { UserSummary } from '../../types/UserTypes';
import { getAccessToken } from '../../utils/authStorage';
import {
  BackButton,
  Container,
  EmptyText,
  ErrorText,
  Header,
  SearchContainer,
  SearchIcon,
  SearchInput,
  SearchResultContainer,
  Title,
} from './AddMemberScreen.styles';
import RelationshipBottomModal from './RelationshipBottomModal';

const AddMemberScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserSummary[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserSummary | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setError(null);

    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const token = await getAccessToken();
      const response = await searchUsers(
        {
          uid: query.trim(),
          page: 0,
          size: 20,
        },
        token || undefined
      );

      setSearchResults(response.content);
    } catch (err) {
      setError('사용자 검색에 실패했습니다.');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectUser = (user: UserSummary) => {
    console.log('🔍 선택된 사용자 전체 데이터:', JSON.stringify(user, null, 2));
    console.log('🔍 user.id:', user.id);
    console.log('🔍 user.userId:', user.userId);
    console.log('🔍 user.uid:', user.uid);
    console.log('🔍 user.name:', user.name);
    setSelectedUser(user);
    setIsModalVisible(true);
  };

  const handleConfirmRelationship = async (relationship: string) => {
    if (!selectedUser) {
      Alert.alert('오류', '사용자 정보가 없습니다.');
      return;
    }

    // API 응답에서 id 또는 userId 사용
    const inviteeUserId = selectedUser.id || selectedUser.userId;

    if (!inviteeUserId) {
      Alert.alert('오류', '사용자 ID를 찾을 수 없습니다.');
      return;
    }

    try {
      // 멤버 초대 API 호출
      const response = await inviteMember({
        inviteeUserId: inviteeUserId,
        relation: relationship,
      });

      console.log('✅ 멤버 초대 성공:', response);

      // 모달 닫기
      setIsModalVisible(false);
      setSelectedUser(null);

      // 성공 메시지 표시
      Alert.alert(
        '초대 완료',
        `${selectedUser.name}님에게 멤버 초대를 보냈습니다.`,
        [
          {
            text: '확인',
            onPress: () => {
              // GPS 추적 화면으로 돌아가기
              router.back();
            },
          },
        ]
      );
    } catch (error) {
      console.error('❌ 멤버 초대 실패:', error);

      const errorMessage = error instanceof Error ? error.message : '멤버 초대에 실패했습니다.';

      Alert.alert('초대 실패', errorMessage, [{ text: '확인' }]);
    }
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedUser(null);
  };

  const handleBack = () => {
    router.back();
  };

  // Figma 디자인 기반의 사용자 아이템 렌더링
  const renderUserItem = ({ item }: { item: UserSummary }) => {
    const isSelected = selectedUser?.uid === item.uid;
    const backgroundColor = item.profileBackgroundColor || '#F9FDFE';
    // API 응답에서 profile_url 또는 profileUrl 사용
    const profileImageUrl = item.profile_url || item.profileUrl;

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => handleSelectUser(item)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 8,
          paddingHorizontal: 5,
          backgroundColor: isSelected ? '#F0F9FC' : 'transparent',
          borderRadius: 8,
          marginBottom: 4,
        }}
      >
        {/* 프로필 이미지 - Figma: 55x55 rounded */}
        <View
          style={{
            width: 55,
            height: 55,
            borderRadius: 32,
            backgroundColor: backgroundColor,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.12,
            shadowRadius: 4,
            elevation: 2,
            marginRight: 12,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {profileImageUrl && profileImageUrl.startsWith('http') ? (
            <Image
              source={{ uri: profileImageUrl }}
              style={{
                width: 55,
                height: 55,
                borderRadius: 32,
              }}
            />
          ) : (
            <Text style={{ fontSize: 20, fontWeight: '600', color: '#16171A' }}>
              {item.name?.[0] || '?'}
            </Text>
          )}
        </View>

        {/* 이름 - Figma: Title-S (20px, Bold, #16171A) */}
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontFamily: 'WantedSans-Bold',
              fontSize: 20,
              fontWeight: '700',
              lineHeight: 22,
              color: '#16171A',
              letterSpacing: -0.2,
            }}
          >
            {item.name || '이름 없음'}
          </Text>
        </View>

        {/* 관계 설정 버튼 - Figma: 67x26, rounded 12px, border lightblue-50 */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => handleSelectUser(item)}
          style={{
            width: 67,
            height: 26,
            borderRadius: 12,
            backgroundColor: '#F9FDFE',
            borderWidth: 1.5,
            borderColor: '#4DC0E7',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontFamily: 'WantedSans-Medium',
              fontSize: 10,
              fontWeight: '500',
              lineHeight: 13,
              color: '#000000',
              letterSpacing: -0.2,
            }}
          >
            관계 설정 +
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <Container edges={['top']}>
      <Header>
        <BackButton onPress={handleBack}>
          <Ionicons name="chevron-back" size={28} color="#000000" />
        </BackButton>
        <Title>멤버 추가</Title>
        <View style={{ width: 28 }} />
      </Header>

      <SearchContainer>
        <SearchIcon>
          <Ionicons name="search" size={20} color="#848587" />
        </SearchIcon>
        <SearchInput
          placeholder="사용자 ID를 입력하세요"
          value={searchQuery}
          onChangeText={handleSearch}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </SearchContainer>

      {error && <ErrorText>{error}</ErrorText>}

      <SearchResultContainer>
        {isSearching ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#25b2e2" />
          </View>
        ) : searchQuery && searchResults.length === 0 ? (
          <EmptyText>검색 결과가 없습니다</EmptyText>
        ) : !searchQuery ? (
          <EmptyText>사용자 ID를 입력하여 검색하세요</EmptyText>
        ) : (
          <FlatList
            data={searchResults}
            renderItem={renderUserItem}
            keyExtractor={(item, index) =>
              item.id?.toString() ||
              item.userId?.toString() ||
              item.uid ||
              `user-${index}`
            }
            showsVerticalScrollIndicator={false}
            extraData={selectedUser}
            contentContainerStyle={{ paddingVertical: 8 }}
          />
        )}
      </SearchResultContainer>

      <RelationshipBottomModal
        visible={isModalVisible}
        onClose={handleCloseModal}
        onConfirm={handleConfirmRelationship}
        userName={selectedUser?.name}
      />
    </Container>
  );
};

export default AddMemberScreen;
