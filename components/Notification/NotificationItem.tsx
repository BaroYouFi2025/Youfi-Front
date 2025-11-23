import { NotificationResponse, NotificationType } from '@/types/NotificationTypes';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Modal, ScrollView, TouchableOpacity, View } from 'react-native';
import {
  AcceptButton,
  ActionButtonText,
  DetailButton,
  FoundReportContainer,
  FoundReportIconContainer,
  FoundReportIconGradient,
  FoundReportMessageRow,
  FoundReportTitleRow,
  NotificationActions,
  NotificationHeader,
  NotificationHeaderText,
  NotificationIcon,
  NotificationIconContainer,
  NotificationItemContainer,
  NotificationMessage,
  NotificationTime,
  NotificationTitleText,
  NotificationUnreadDot,
  ReadNotificationOverlay,
  RejectButton,
  RelationModalCloseButton,
  RelationModalCloseText,
  RelationModalContent,
  RelationModalOverlay,
  RelationModalTitle,
  RelationOption,
  RelationOptionText,
} from './NotificationItem.styles';

interface NotificationItemProps {
  notification: NotificationResponse;
  onAccept?: (id: number, relation: string) => Promise<void>;
  onReject?: (id: number) => Promise<void>;
  onDetail?: (id: number) => Promise<void>;
  onMarkAsRead?: (id: number) => Promise<void>;
}

// 관계 옵션 목록
const RELATION_OPTIONS = [
  '아버지',
  '어머니',
  '형',
  '누나',
  '동생',
  '아들',
  '딸',
  '할아버지',
  '할머니',
  '손자',
  '손녀',
  '삼촌',
  '고모',
  '이모',
  '조카',
  '사촌',
  '기타',
];

export default function NotificationItem({
  notification,
  onAccept,
  onReject,
  onDetail,
  onMarkAsRead,
}: NotificationItemProps) {
  const [relationModalVisible, setRelationModalVisible] = useState(false);
  
  // 시간 포맷팅
  const createdAt = new Date(notification.createdAt);
  const timeString = createdAt.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  // 관계 선택 후 수락 처리
  const handleAcceptWithRelation = async (relation: string) => {
    setRelationModalVisible(false);
    if (onAccept) {
      await onAccept(notification.id, relation);
    }
  };

  // 수락 버튼 클릭 시 관계 선택 모달 표시
  const handleAcceptClick = () => {
    setRelationModalVisible(true);
  };

  // FOUND_REPORT 타입일 때 특별한 디자인 렌더링
  if (notification.type === NotificationType.FOUND_REPORT) {
    return (
      <FoundReportContainer>
        {/* 읽음 상태일 때 상단 그라데이션 */}
        {notification.isRead && <ReadNotificationOverlay />}
        <FoundReportTitleRow>
          <FoundReportIconContainer>
            <FoundReportIconGradient>
              <LinearGradient
                key="gradient-1"
                colors={['#cef1fc', '#2ccbff']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={{
                  position: 'absolute',
                  width: 28.8,
                  height: 28.8,
                  borderRadius: 6,
                  transform: [{ rotate: '314.314deg' }],
                }}
              />
              <LinearGradient
                key="gradient-2"
                colors={['#cef1fc', '#2ccbff']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={{
                  position: 'absolute',
                  width: 22.629,
                  height: 22.628,
                  borderRadius: 6,
                  left: 4.42,
                  top: 6.17,
                  transform: [{ rotate: '314.314deg' }],
                }}
              />
              <LinearGradient
                key="gradient-3"
                colors={['#cef1fc', '#2ccbff']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={{
                  position: 'absolute',
                  width: 18.514,
                  height: 18.514,
                  borderRadius: 6,
                  left: 7.36,
                  top: 10.29,
                  transform: [{ rotate: '314.314deg' }],
                }}
              />
              <LinearGradient
                key="gradient-4"
                colors={['#cef1fc', '#2ccbff']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={{
                  position: 'absolute',
                  width: 14.4,
                  height: 14.4,
                  borderRadius: 4.8,
                  left: 10.3,
                  top: 14.4,
                  transform: [{ rotate: '314.314deg' }],
                }}
              />
            </FoundReportIconGradient>
          </FoundReportIconContainer>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end', gap: 8 }}>
            <NotificationTitleText style={{ fontSize: 20, lineHeight: 22, letterSpacing: -0.2, fontWeight: '700' }}>
              {notification.title}
            </NotificationTitleText>
            <NotificationTime style={{ fontSize: 10, lineHeight: 13, fontWeight: '500' }}>
              {timeString}
            </NotificationTime>
          </View>
        </FoundReportTitleRow>
        <FoundReportMessageRow>
          <NotificationMessage style={{ fontSize: 14, lineHeight: 18, letterSpacing: -0.14, flex: 1, fontWeight: '500' }}>
            {notification.message}
          </NotificationMessage>
          {onDetail && (
            <TouchableOpacity
              onPress={async () => {
                await onDetail(notification.id);
              }}
            >
              <ActionButtonText style={{ color: '#25b2e2', fontSize: 13, lineHeight: 16, letterSpacing: -0.13, fontWeight: '500' }}>
                자세히 보기
              </ActionButtonText>
            </TouchableOpacity>
          )}
        </FoundReportMessageRow>
      </FoundReportContainer>
    );
  }

  // 타입별 아이콘 렌더링
  const renderIcon = () => {
    switch (notification.type) {
      case NotificationType.INVITE_REQUEST:
        return <Ionicons name="person-add" size={20} color="#25b2e2" />;
      case NotificationType.FOUND_REPORT:
        return <Ionicons name="location" size={20} color="#25b2e2" />;
      case NotificationType.NEARBY_ALERT:
        return <Ionicons name="notifications" size={20} color="#25b2e2" />;
      default:
        return <Ionicons name="notifications" size={20} color="#25b2e2" />;
    }
  };

  // 타입별 액션 렌더링
  const renderActions = () => {
    switch (notification.type) {
      case NotificationType.INVITE_REQUEST:
        // 읽음 상태면 버튼을 표시하지 않음
        if (notification.isRead === true) {
          return null;
        }
        // 읽지 않은 알림일 때만 버튼 표시
        return (
          <NotificationActions>
            {onAccept && (
              <AcceptButton
                onPress={handleAcceptClick}
              >
                <ActionButtonText style={{ color: '#ffffff' }}>수락</ActionButtonText>
              </AcceptButton>
            )}
            {onReject && (
              <RejectButton
                onPress={async () => {
                  await onReject(notification.id);
                }}
              >
                <ActionButtonText style={{ color: '#ff6f61' }}>거절</ActionButtonText>
              </RejectButton>
            )}
          </NotificationActions>
        );
      case NotificationType.FOUND_REPORT:
      case NotificationType.NEARBY_ALERT:
        return (
          onDetail && (
            <DetailButton
              onPress={async () => {
                await onDetail(notification.id);
              }}
            >
              <ActionButtonText style={{ color: '#25b2e2' }}>자세히 보기</ActionButtonText>
            </DetailButton>
          )
        );
      default:
        return null;
    }
  };

  return (
    <>
      <NotificationItemContainer isUnread={!notification.isRead}>
        {/* 읽음 상태일 때 상단 그라데이션 */}
        {notification.isRead && <ReadNotificationOverlay />}
        <NotificationHeader>
          <NotificationIconContainer>
            <NotificationIcon>{renderIcon()}</NotificationIcon>
            {!notification.isRead && <NotificationUnreadDot />}
          </NotificationIconContainer>
          <NotificationHeaderText>
            <NotificationTitleText>{notification.title}</NotificationTitleText>
            <NotificationTime>{timeString}</NotificationTime>
          </NotificationHeaderText>
        </NotificationHeader>
        <NotificationMessage>{notification.message}</NotificationMessage>
        {renderActions()}
      </NotificationItemContainer>

      {/* 관계 선택 모달 */}
      {notification.type === NotificationType.INVITE_REQUEST && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={relationModalVisible}
          onRequestClose={() => setRelationModalVisible(false)}
        >
          <RelationModalOverlay>
            <RelationModalContent>
              <RelationModalTitle>관계 선택</RelationModalTitle>
              <ScrollView style={{ maxHeight: 400 }}>
                {RELATION_OPTIONS.map((relation) => (
                  <RelationOption
                    key={relation}
                    onPress={() => handleAcceptWithRelation(relation)}
                  >
                    <RelationOptionText>{relation}</RelationOptionText>
                  </RelationOption>
                ))}
              </ScrollView>
              <RelationModalCloseButton onPress={() => setRelationModalVisible(false)}>
                <RelationModalCloseText>취소</RelationModalCloseText>
              </RelationModalCloseButton>
            </RelationModalContent>
          </RelationModalOverlay>
        </Modal>
      )}
    </>
  );
}


