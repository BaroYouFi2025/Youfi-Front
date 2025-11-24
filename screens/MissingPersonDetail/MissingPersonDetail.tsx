import GeneratedImagesModal from '@/components/GeneratedImagesModal';
import { getMissingPersonById, closeMissingPerson } from '@/services/missingPersonAPI';
import { AIAssetType, MissingPersonDetailResponse } from '@/types/MissingPersonTypes';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, ImageSourcePropType, Modal } from 'react-native';
import {
  Avatar,
  Bullet,
  CloseButton,
  CloseButtonText,
  Container,
  Divider,
  EditButton,
  ErrorText,
  ErrorWrap,
  FieldLabel,
  FieldRow,
  FieldValue,
  FooterButton,
  FooterButtonText,
  HeaderRow,
  LoadingWrap,
  NameColumn,
  NameText,
  ScrollArea,
  SelectionModalOverlay,
  SelectionModalContainer,
  SelectionModalTitle,
  SelectionButton,
  SelectionButtonText,
  SelectionCancelButton,
  SelectionCancelButtonText,
  ConfirmModalDescription,
  ConfirmButton,
  ConfirmButtonText,
} from './MissingPersonDetail.styles';

const DEFAULT_AVATAR = 'https://via.placeholder.com/88';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080';

const convertToInternalUrl = (url?: string): string | undefined => {
  if (!url) return undefined;
  // 외부 URL에서 경로 부분만 추출하여 내부 API URL과 조합
  try {
    const urlObj = new URL(url);
    // /images/... 경로만 추출
    const path = urlObj.pathname;
    // API_URL 끝의 슬래시 제거 후 경로 조합
    const baseUrl = API_URL.replace(/\/$/, '');
    return `${baseUrl}${path}`;
  } catch {
    return url;
  }
};

const formatKoreanDate = (value?: string) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
};

const formatAge = (value?: string) => {
  if (!value) return null;
  const birth = new Date(value);
  if (Number.isNaN(birth.getTime())) return null;

  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();
  const dateDiff = now.getDate() - birth.getDate();
  if (monthDiff < 0 || (monthDiff === 0 && dateDiff < 0)) {
    age -= 1;
  }
  return `${age}세`;
};

const formatMissingDateTime = (value?: string) => {
  if (!value) return '정보 없음';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const hours = date.getHours();
  const minutes = `${date.getMinutes()}`.padStart(2, '0');
  const period = hours >= 12 ? '오후' : '오전';
  const displayHour = hours % 12 === 0 ? 12 : hours % 12;

  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${period} ${displayHour}:${minutes}`;
};

const buildClothes = (detail?: MissingPersonDetailResponse | null) => {
  if (!detail) return '정보 없음';
  const parts = [detail.clothesTop, detail.clothesBottom, detail.clothesEtc].filter(Boolean);
  return parts.length ? parts.join(', ') : '정보 없음';
};

const buildBodyInfo = (detail?: MissingPersonDetailResponse | null) => {
  if (!detail) return '정보 없음';
  const parts = [];
  if (detail.height) parts.push(`${detail.height}cm`);
  if (detail.weight) parts.push(`${detail.weight}kg`);
  if (detail.body) parts.push(detail.body);
  return parts.length ? parts.join(', ') : '정보 없음';
};

export default function MissingPersonDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [detail, setDetail] = useState<MissingPersonDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSelectionModalVisible, setIsSelectionModalVisible] = useState(false);
  const [isGenerateModalVisible, setIsGenerateModalVisible] = useState(false);
  const [selectedAssetType, setSelectedAssetType] = useState<AIAssetType>('AGE_PROGRESSION');
  const [isCloseConfirmModalVisible, setIsCloseConfirmModalVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const missingPersonId = Array.isArray(id) ? id[0] : id;

  const birthLabel = useMemo(() => {
    const label = formatKoreanDate(detail?.birthDate);
    return label ? `${label} 출생` : '정보 없음';
  }, [detail?.birthDate]);

  const ageLabel = useMemo(() => formatAge(detail?.birthDate) ?? '정보 없음', [detail?.birthDate]);
  const genderLabel = detail?.gender ?? '정보 없음';
  const missingDateLabel = formatMissingDateTime(detail?.missingDate);
  const bodyInfoLabel = buildBodyInfo(detail);
  const clothesLabel = buildClothes(detail);
  const otherBodyFeature = detail?.bodyEtc?.trim() || '없음';

  const loadDetail = async () => {
    if (!missingPersonId) {
      setError('실종자 ID가 없습니다.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await getMissingPersonById(missingPersonId);
      setDetail(response);
    } catch (err) {
      const message = err instanceof Error ? err.message : '실종자 정보를 불러오지 못했습니다.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadDetail();
    }, [missingPersonId])
  );

  const internalPhotoUrl = convertToInternalUrl(detail?.photoUrl);
  const avatarSource: ImageSourcePropType = internalPhotoUrl
    ? { uri: internalPhotoUrl }
    : { uri: DEFAULT_AVATAR };


  const handleEdit = () => {
    if (!missingPersonId) return;
    router.push(`/missing-persons/edit/${missingPersonId}` as any);
  };

  const handleOpenSelectionModal = () => {
    if (!detail?.photoUrl) {
      Alert.alert(
        '사진 필요',
        'AI 이미지를 생성하려면 실종자 사진이 등록되어 있어야 합니다.\n정보 수정에서 사진을 먼저 등록해주세요.'
      );
      return;
    }
    setIsSelectionModalVisible(true);
  };

  const handleCloseSelectionModal = () => {
    setIsSelectionModalVisible(false);
  };

  const handleSelectAssetType = (assetType: AIAssetType) => {
    setSelectedAssetType(assetType);
    setIsSelectionModalVisible(false);
    setIsGenerateModalVisible(true);
  };

  const handleCloseGenerateModal = () => {
    setIsGenerateModalVisible(false);
  };

  const handleOpenCloseConfirmModal = () => {
    setIsCloseConfirmModalVisible(true);
  };

  const handleCloseCloseConfirmModal = () => {
    setIsCloseConfirmModalVisible(false);
  };

  const handleConfirmClose = async () => {
    if (!missingPersonId) return;

    setIsClosing(true);
    try {
      await closeMissingPerson(missingPersonId);
      setIsCloseConfirmModalVisible(false);
      Alert.alert('완료', '사건이 종료되었습니다.', [
        {
          text: '확인',
          onPress: () => router.back(),
        },
      ]);
    } catch (err) {
      const message = err instanceof Error ? err.message : '실종 종료 처리에 실패했습니다.';
      Alert.alert('오류', message);
    } finally {
      setIsClosing(false);
    }
  };

  if (isLoading) {
    return (
      <Container>
        <LoadingWrap>
          <ActivityIndicator size="large" color="#25b2e2" />
        </LoadingWrap>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorWrap>
          <ErrorText>{error}</ErrorText>
          <FooterButton onPress={loadDetail}>
            <FooterButtonText>다시 시도</FooterButtonText>
          </FooterButton>
          <FooterButton style={{ marginTop: 12, backgroundColor: '#ff6f61' }} onPress={() => router.back()}>
            <FooterButtonText>뒤로 가기</FooterButtonText>
          </FooterButton>
        </ErrorWrap>
      </Container>
    );
  }

  return (
    <Container>
      <ScrollArea showsVerticalScrollIndicator={false}>
        <HeaderRow>
          <Avatar
            source={avatarSource}
          />
          <NameColumn>
            <NameText>{detail?.name ?? '이름 미확인'}</NameText>
          </NameColumn>
          <CloseButton onPress={handleOpenCloseConfirmModal}>
            <CloseButtonText>닫기</CloseButtonText>
          </CloseButton>
        </HeaderRow>

        <Divider />

        <FieldRow>
          <FieldLabel>실종자 나이 / 생년월일</FieldLabel>
          <Bullet />
          <FieldValue>
            {ageLabel} / {birthLabel}
          </FieldValue>
        </FieldRow>

        <FieldRow>
          <FieldLabel>성별 정보</FieldLabel>
          <Bullet />
          <FieldValue>{genderLabel}</FieldValue>
        </FieldRow>

        <FieldRow>
          <FieldLabel>신체 특징(키, 몸무게, 체형)</FieldLabel>
          <Bullet />
          <FieldValue>{bodyInfoLabel}</FieldValue>
        </FieldRow>

        <FieldRow>
          <FieldLabel>실종 시간</FieldLabel>
          <Bullet />
          <FieldValue>{missingDateLabel}</FieldValue>
        </FieldRow>

        <FieldRow>
          <FieldLabel>기타 신체 특징</FieldLabel>
          <Bullet />
          <FieldValue>{otherBodyFeature}</FieldValue>
        </FieldRow>

        <FieldRow>
          <FieldLabel>인상착의(상의, 하의, 기타)</FieldLabel>
          <Bullet />
          <FieldValue>{clothesLabel}</FieldValue>
        </FieldRow>

        <EditButton onPress={handleEdit}>
          <FooterButtonText>정보 수정</FooterButtonText>
        </EditButton>

        <FooterButton onPress={handleOpenSelectionModal}>
          <FooterButtonText>AI 이미지 생성</FooterButtonText>
        </FooterButton>
      </ScrollArea>

      {/* AI 이미지 생성 타입 선택 모달 */}
      <Modal
        visible={isSelectionModalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCloseSelectionModal}
      >
        <SelectionModalOverlay>
          <SelectionModalContainer>
            <SelectionModalTitle>AI 이미지 생성</SelectionModalTitle>
            <SelectionButton onPress={() => handleSelectAssetType('GENERATED_IMAGE')}>
              <SelectionButtonText>인상착의 생성</SelectionButtonText>
            </SelectionButton>
            <SelectionButton onPress={() => handleSelectAssetType('AGE_PROGRESSION')}>
              <SelectionButtonText>현재 얼굴 사진 생성</SelectionButtonText>
            </SelectionButton>
            <SelectionCancelButton onPress={handleCloseSelectionModal}>
              <SelectionCancelButtonText>취소</SelectionCancelButtonText>
            </SelectionCancelButton>
          </SelectionModalContainer>
        </SelectionModalOverlay>
      </Modal>

      {/* 실종 종료 확인 모달 */}
      <Modal
        visible={isCloseConfirmModalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCloseCloseConfirmModal}
      >
        <SelectionModalOverlay>
          <SelectionModalContainer>
            <SelectionModalTitle>사건 종료</SelectionModalTitle>
            <ConfirmModalDescription>
              정말로 사건 종료 처리를 하시겠습니까?{'\n'}
              종료 시 내 실종자 목록에서 삭제됩니다.
            </ConfirmModalDescription>
            <ConfirmButton onPress={handleConfirmClose} disabled={isClosing}>
              <ConfirmButtonText>
                {isClosing ? '처리 중...' : '사건 종료'}
              </ConfirmButtonText>
            </ConfirmButton>
            <SelectionCancelButton onPress={handleCloseCloseConfirmModal} disabled={isClosing}>
              <SelectionCancelButtonText>취소</SelectionCancelButtonText>
            </SelectionCancelButton>
          </SelectionModalContainer>
        </SelectionModalOverlay>
      </Modal>

      {detail && (
        <GeneratedImagesModal
          visible={isGenerateModalVisible}
          onClose={handleCloseGenerateModal}
          missingPersonId={detail.missingPersonId}
          assetType={selectedAssetType}
        />
      )}
    </Container>
  );
}
