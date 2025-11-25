import React, { useCallback, useEffect, useState } from 'react';
import { Modal, ActivityIndicator, Alert } from 'react-native';
import { generateAIImage, applyAIImage } from '@/services/missingPersonAPI';
import { AIAssetType } from '@/types/MissingPersonTypes';
import {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  CloseButton,
  CloseButtonText,
  LoadingContainer,
  LoadingText,
  LoadingSubText,
  ImagesGrid,
  ImageWrapper,
  GeneratedImage,
  CheckboxWrapper,
  CheckboxInner,
  CheckIcon,
  SelectedBorder,
  ErrorContainer,
  ErrorText,
  RetryButton,
  RetryButtonText,
  FullImageOverlay,
  FullImage,
  FullImageCloseButton,
  FullImageCloseText,
  ButtonsContainer,
  ApplyButton,
  ApplyButtonText,
  CancelButton,
  CancelButtonText,
} from './GeneratedImagesModal.styles';

interface GeneratedImagesModalProps {
  visible: boolean;
  onClose: () => void;
  missingPersonId: number;
  assetType: AIAssetType;
  onApplySuccess?: (appliedUrl: string) => void;
}

type ModalState = 'loading' | 'success' | 'error' | 'applying';

const ASSET_TYPE_LABELS: Record<AIAssetType, { title: string; loadingText: string }> = {
  AGE_PROGRESSION: {
    title: '현재 얼굴 사진',
    loadingText: '현재 얼굴 사진을 생성하고 있습니다',
  },
  GENERATED_IMAGE: {
    title: '인상착의 이미지',
    loadingText: '인상착의 이미지를 생성하고 있습니다',
  },
};

export default function GeneratedImagesModal({
  visible,
  onClose,
  missingPersonId,
  assetType,
  onApplySuccess,
}: GeneratedImagesModalProps) {
  const [state, setState] = useState<ModalState>('loading');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [checkedImageUrl, setCheckedImageUrl] = useState<string | null>(null);

  const labels = ASSET_TYPE_LABELS[assetType];
  const showApplyButton = assetType === 'AGE_PROGRESSION';

  const generateImages = useCallback(async () => {
    setState('loading');
    setError(null);
    setImageUrls([]);
    setCheckedImageUrl(null);

    try {
      const response = await generateAIImage(missingPersonId, assetType);
      setImageUrls(response.imageUrls);
      setState('success');
    } catch (err) {
      const message = err instanceof Error ? err.message : '이미지 생성에 실패했습니다.';
      setError(message);
      setState('error');
    }
  }, [assetType, missingPersonId]);

  useEffect(() => {
    if (visible) {
      generateImages();
    } else {
      // 모달이 닫힐 때 상태 초기화
      setState('loading');
      setImageUrls([]);
      setError(null);
      setSelectedImage(null);
      setCheckedImageUrl(null);
    }
  }, [assetType, generateImages, missingPersonId, visible]);

  const handleClose = () => {
    setSelectedImage(null);
    setCheckedImageUrl(null);
    onClose();
  };

  const handleImagePress = (url: string) => {
    setSelectedImage(url);
  };

  const handleCheckboxPress = (url: string) => {
    if (!showApplyButton) return;
    setCheckedImageUrl(checkedImageUrl === url ? null : url);
  };

  const handleFullImageClose = () => {
    setSelectedImage(null);
  };

  const handleApply = async () => {
    if (!checkedImageUrl || !showApplyButton) return;

    setState('applying');
    try {
      const response = await applyAIImage(
        missingPersonId,
        assetType,
        checkedImageUrl
      );
      Alert.alert('성공', '이미지가 적용되었습니다.', [
        {
          text: '확인',
          onPress: () => {
            onApplySuccess?.(response.appliedUrl);
            handleClose();
          },
        },
      ]);
    } catch (err) {
      const message = err instanceof Error ? err.message : '이미지 적용에 실패했습니다.';
      Alert.alert('오류', message);
      setState('success');
    }
  };

  const renderContent = () => {
    switch (state) {
      case 'loading':
        return (
          <LoadingContainer>
            <ActivityIndicator size="large" color="#25b2e2" />
            <LoadingText>{labels.loadingText}</LoadingText>
            <LoadingSubText>AI가 이미지를 생성하는 중입니다.{'\n'}잠시만 기다려주세요...</LoadingSubText>
          </LoadingContainer>
        );

      case 'applying':
        return (
          <LoadingContainer>
            <ActivityIndicator size="large" color="#25b2e2" />
            <LoadingText>이미지를 적용하고 있습니다</LoadingText>
            <LoadingSubText>잠시만 기다려주세요...</LoadingSubText>
          </LoadingContainer>
        );

      case 'error':
        return (
          <ErrorContainer>
            <ErrorText>{error}</ErrorText>
            <RetryButton onPress={generateImages}>
              <RetryButtonText>다시 시도</RetryButtonText>
            </RetryButton>
          </ErrorContainer>
        );

      case 'success':
        return (
          <>
            <ImagesGrid>
              {imageUrls.map((url, index) => (
                <ImageWrapper key={`${url}-${index}`} onPress={() => handleImagePress(url)}>
                  <GeneratedImage source={{ uri: url }} resizeMode="cover" />
                  {showApplyButton && checkedImageUrl === url && <SelectedBorder />}
                  {showApplyButton && (
                    <CheckboxWrapper onPress={() => handleCheckboxPress(url)}>
                      <CheckboxInner isSelected={checkedImageUrl === url}>
                        {checkedImageUrl === url && <CheckIcon>✓</CheckIcon>}
                      </CheckboxInner>
                    </CheckboxWrapper>
                  )}
                </ImageWrapper>
              ))}
            </ImagesGrid>
            <ButtonsContainer>
              <CancelButton onPress={handleClose}>
                <CancelButtonText>{showApplyButton ? '취소' : '닫기'}</CancelButtonText>
              </CancelButton>
              {showApplyButton && (
                <ApplyButton
                  disabled={!checkedImageUrl}
                  onPress={handleApply}
                >
                  <ApplyButtonText>적용하기</ApplyButtonText>
                </ApplyButton>
              )}
            </ButtonsContainer>
          </>
        );
    }
  };

  const getTitle = () => {
    switch (state) {
      case 'loading':
        return 'AI 이미지 생성 중';
      case 'applying':
        return '이미지 적용 중';
      case 'success':
        return `생성된 ${labels.title}`;
      case 'error':
        return '오류 발생';
    }
  };

  return (
    <>
      <Modal
        visible={visible && !selectedImage}
        transparent
        animationType="fade"
        onRequestClose={handleClose}
      >
        <ModalOverlay>
          <ModalContainer>
            <ModalHeader>
              <ModalTitle>{getTitle()}</ModalTitle>
              <CloseButton onPress={handleClose}>
                <CloseButtonText>×</CloseButtonText>
              </CloseButton>
            </ModalHeader>
            {renderContent()}
          </ModalContainer>
        </ModalOverlay>
      </Modal>

      {/* 전체 화면 이미지 보기 모달 */}
      <Modal
        visible={!!selectedImage}
        transparent
        animationType="fade"
        onRequestClose={handleFullImageClose}
      >
        <FullImageOverlay>
          <FullImageCloseButton onPress={handleFullImageClose}>
            <FullImageCloseText>×</FullImageCloseText>
          </FullImageCloseButton>
          {selectedImage && (
            <FullImage source={{ uri: selectedImage }} resizeMode="contain" />
          )}
        </FullImageOverlay>
      </Modal>
    </>
  );
}
