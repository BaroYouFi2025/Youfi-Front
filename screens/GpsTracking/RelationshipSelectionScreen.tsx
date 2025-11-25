import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Alert, FlatList, View } from 'react-native';
import { inviteMember } from '../../services/memberAPI';
import {
  BackButton,
  CancelButton,
  CancelButtonText,
  ConfirmButton,
  ConfirmButtonText,
  Container,
  Footer,
  Header,
  RelationshipOption,
  RelationshipText,
  Title,
} from './RelationshipSelectionScreen.styles';

const RELATIONSHIPS = [
  { id: '1', label: '가족', value: '가족' },
  { id: '2', label: '친구', value: '친구' },
  { id: '3', label: '동료', value: '동료' },
  { id: '4', label: '지인', value: '지인' },
  { id: '5', label: '이웃', value: '이웃' },
  { id: '6', label: '기타', value: '기타' },
];

const RelationshipSelectionScreen: React.FC = () => {
  const params = useLocalSearchParams<{ userId: string; userName: string }>();
  const [selectedRelationship, setSelectedRelationship] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  const handleConfirm = async () => {
    if (!selectedRelationship || !params.userId) {
      return;
    }

    setIsSubmitting(true);
    try {
      // 멤버 초대 API 호출
      const response = await inviteMember({
        inviteeUserId: parseInt(params.userId, 10),
        relation: selectedRelationship,
      });

      // 성공 메시지 표시
      Alert.alert(
        '초대 완료',
        `${params.userName}님에게 멤버 초대를 보냈습니다.`,
        [
          {
            text: '확인',
            onPress: () => {
              // GPS 추적 화면으로 돌아가기 (2단계 뒤로)
              router.back();
              router.back();
            },
          },
        ]
      );
    } catch (error) {
      console.error('❌ 멤버 초대 실패:', error);

      const errorMessage = error instanceof Error ? error.message : '멤버 초대에 실패했습니다.';

      Alert.alert(
        '초대 실패',
        errorMessage,
        [{ text: '확인' }]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderRelationshipItem = ({ item }: { item: { id: string; label: string; value: string } }) => {
    const isSelected = selectedRelationship === item.value;

    return (
      <RelationshipOption
        onPress={() => setSelectedRelationship(item.value)}
        $selected={isSelected}
      >
        <RelationshipText $selected={isSelected}>{item.label}</RelationshipText>
        {isSelected && <Ionicons name="checkmark-circle" size={24} color="#25b2e2" />}
      </RelationshipOption>
    );
  };

  return (
    <Container edges={['top']}>
      <Header>
        <BackButton onPress={handleBack}>
          <Ionicons name="chevron-back" size={28} color="#000000" />
        </BackButton>
        <Title>관계 선택</Title>
        <View style={{ width: 28 }} />
      </Header>

      <FlatList
        data={RELATIONSHIPS}
        renderItem={renderRelationshipItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16 }}
      />

      <Footer>
        <CancelButton onPress={handleCancel}>
          <CancelButtonText>취소</CancelButtonText>
        </CancelButton>

        <ConfirmButton
          onPress={handleConfirm}
          disabled={!selectedRelationship || isSubmitting}
          $disabled={!selectedRelationship || isSubmitting}
        >
          <ConfirmButtonText $disabled={!selectedRelationship || isSubmitting}>
            {isSubmitting ? '처리 중...' : '확인'}
          </ConfirmButtonText>
        </ConfirmButton>
      </Footer>
    </Container>
  );
};

export default RelationshipSelectionScreen;
