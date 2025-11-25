import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, View } from 'react-native';
import {
  CloseButton,
  ConfirmButton,
  ConfirmButtonText,
  Container,
  ModalContainer,
  OptionsContainer,
  RelationshipPill,
  RelationshipText,
  Title,
} from './RelationshipBottomModal.styles';

type RelationshipBottomModalProps = {
  visible: boolean;
  onClose: () => void;
  onConfirm: (relationship: string) => void;
  userName?: string;
};

const RELATIONSHIPS = [
  { id: '1', label: '가족', value: '가족' },
  { id: '2', label: '친구', value: '친구' },
  { id: '3', label: '연인', value: '연인' },
  { id: '4', label: '이웃', value: '이웃' },
  { id: '5', label: '아버지', value: '아버지' },
  { id: '6', label: '어머니', value: '어머니' },
  { id: '7', label: '기타', value: '기타' },
];

const RelationshipBottomModal: React.FC<RelationshipBottomModalProps> = ({
  visible,
  onClose,
  onConfirm,
  userName,
}) => {
  const [selectedRelationship, setSelectedRelationship] = useState<string | null>(null);

  const handleClose = () => {
    setSelectedRelationship(null);
    onClose();
  };

  const handleConfirm = () => {
    if (selectedRelationship) {
      onConfirm(selectedRelationship);
      setSelectedRelationship(null);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={handleClose}
    >
      <ModalContainer onPress={handleClose} activeOpacity={1}>
        <Container onPress={(e) => e.stopPropagation()} activeOpacity={1}>
          <CloseButton onPress={handleClose}>
            <Ionicons name="close" size={24} color="#000000" />
          </CloseButton>

          <Title>
            {userName ? `${userName}님의 관계를 선택해주세요.` : '관계를 선택해주세요.'}
          </Title>

          <OptionsContainer>
            {RELATIONSHIPS.map((item) => {
              const isSelected = selectedRelationship === item.value;
              return (
                <RelationshipPill
                  key={item.id}
                  onPress={() => setSelectedRelationship(item.value)}
                  $selected={isSelected}
                >
                  <RelationshipText $selected={isSelected}>
                    {item.label}
                  </RelationshipText>
                </RelationshipPill>
              );
            })}
          </OptionsContainer>

          <ConfirmButton
            onPress={handleConfirm}
            disabled={!selectedRelationship}
            $disabled={!selectedRelationship}
          >
            <ConfirmButtonText $disabled={!selectedRelationship}>
              추가 요청하기
            </ConfirmButtonText>
          </ConfirmButton>
        </Container>
      </ModalContainer>
    </Modal>
  );
};

export default RelationshipBottomModal;
