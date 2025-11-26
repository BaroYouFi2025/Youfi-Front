import { NotificationResponse, NotificationType } from '@/types/NotificationTypes';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, ScrollView, TouchableOpacity, View } from 'react-native';
import {
  AcceptButton,
  ActionButtonText,
  NotificationHeaderText,
  NotificationIcon,
  NotificationIconContainer,
  NotificationItemContainer,
  NotificationMessage,
  NotificationSelectableArea,
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
  RelationOptionText
} from './NotificationItem.styles';

interface NotificationItemProps {
  notification: NotificationResponse;
  onAccept?: (id: number, relation: string) => Promise<void>;
  onReject?: (id: number) => Promise<void>;
  onDetail?: (id: number) => Promise<void>;
  onMarkAsRead?: (id: number) => Promise<void>;
  onSelect?: (id: number) => Promise<void> | void;
  isSelected?: boolean;
  isLast?: boolean;
  index?: number;
  totalCount?: number;
  isUnread?: boolean;
  isActive?: boolean;
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
  onSelect,
  isSelected = false,
  isLast = false,
  index = 0,
  totalCount = 0,
  isUnread,
  isActive = false,
}: NotificationItemProps) {
  const [relationModalVisible, setRelationModalVisible] = useState(false);
  
  // 시간 포맷팅
  const createdAt = new Date(notification.createdAt);
  const timeString = createdAt.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  // FOUND_REPORT 타입 알림 메시지에서 "찾은 팀"과 "발견위치" 정보 제거
  const getFilteredMessage = (message: string): string => {
    if (notification.type !== NotificationType.FOUND_REPORT) {
      return message;
    }
    
    // "찾은 팀" 또는 "발견위치" 관련 텍스트 제거
    let filtered = message;
    
    // "찾은 팀: ..." 패턴 제거
    filtered = filtered.replace(/찾은\s*팀\s*[:：]\s*[^\n]*/gi, '');
    filtered = filtered.replace(/찾은\s*팀\s*[^\n]*/gi, '');
    
    // "발견위치: ..." 패턴 제거
    filtered = filtered.replace(/발견\s*위치\s*[:：]\s*[^\n]*/gi, '');
    filtered = filtered.replace(/발견\s*위치\s*[^\n]*/gi, '');
    
    // "발견 위치: ..." 패턴 제거
    filtered = filtered.replace(/발견\s*위치\s*[:：]\s*[^\n]*/gi, '');
    
    // 연속된 줄바꿈 정리
    filtered = filtered.replace(/\n\n+/g, '\n').trim();
    
    return filtered;
  };

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

  const handleSelect = async () => {
    if (onSelect) {
      await onSelect(notification.id);
    }
    
    // 알림 타입별 클릭 동작 처리
    switch (notification.type) {
      case NotificationType.FOUND_REPORT:
        // "자세히 보기" 버튼이 있는 알림: 클릭 시 자세히 보기 효과
        if (onDetail) {
          await handleDetail();
        }
        break;
      
      case NotificationType.INVITE_REQUEST:
        // "수락/거절" 버튼이 있는 알림: 클릭해도 아무 동작 없음
        // 수락/거절 버튼을 눌렀을 때만 읽음 처리됨
        break;
      
      default:
        // 그 외 알림: 클릭 시 읽음 처리만 수행
        if (onMarkAsRead && !notification.isRead) {
          try {
            await onMarkAsRead(notification.id);
          } catch (error) {
            console.error('❌ 알림 읽음 처리 실패:', error);
          }
        }
        break;
    }
  };

  // 자세히 보기 클릭 시 읽음 처리 후 상세 페이지로 이동
  const handleDetail = async () => {
    if (!onDetail) return;
    
    try {
      // 읽지 않은 알림인 경우 읽음 처리
      if (onMarkAsRead && !notification.isRead) {
        await onMarkAsRead(notification.id);
      }
      // 상세 페이지로 이동
      await onDetail(notification.id);
    } catch (error) {
      console.error('❌ 자세히 보기 처리 실패:', error);
      // 에러가 있어도 페이지는 이동 시도
      try {
        await onDetail(notification.id);
      } catch (detailError) {
        console.error('❌ 상세 페이지 이동 실패:', detailError);
      }
    }
  };

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


  return (
    <>
      <View>
        <NotificationItemContainer 
          isUnread={isUnread !== undefined ? isUnread : !notification.isRead} 
          isSelected={isSelected} 
          isLast={isLast} 
          index={index} 
          totalCount={totalCount}
          collapsable={false}
        >
        {/* 읽음 상태일 때 상단 그라데이션 */}
        {notification.isRead && <ReadNotificationOverlay />}
        <NotificationIconContainer>
          <NotificationIcon>{renderIcon()}</NotificationIcon>
          {!notification.isRead && <NotificationUnreadDot />}
        </NotificationIconContainer>
        <NotificationSelectableArea 
          activeOpacity={0.7} 
          onPress={handleSelect}
          pointerEvents="box-none"
        >
          <NotificationHeaderText>
            <View style={{ flex: 1, minWidth: 0, marginRight: 8 }}>
              <NotificationTitleText 
                isUnread={isUnread !== undefined ? isUnread : !notification.isRead}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {notification.title}
              </NotificationTitleText>
            </View>
            <NotificationTime style={{ flexShrink: 0 }}>{timeString}</NotificationTime>
          </NotificationHeaderText>
          <View style={{ marginTop: 4 }}>
            <NotificationMessage 
              isUnread={isUnread !== undefined ? isUnread : !notification.isRead}
            >
              {notification.type === NotificationType.FOUND_REPORT 
                ? getFilteredMessage(notification.message) 
                : notification.message}
            </NotificationMessage>
            
            {/* INVITE_REQUEST: 수락/거절 버튼 */}
            {notification.type === NotificationType.INVITE_REQUEST && !notification.isRead && (
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
                {onReject && (
                  <RejectButton onPress={async () => { await onReject(notification.id); }}>
                    <ActionButtonText style={{ color: '#ff6f61' }}>거절</ActionButtonText>
                  </RejectButton>
                )}
                {onAccept && (
                  <AcceptButton onPress={handleAcceptClick}>
                    <ActionButtonText style={{ color: '#25b2e2' }}>수락</ActionButtonText>
                  </AcceptButton>
                )}
              </View>
            )}
            
            {/* FOUND_REPORT: 자세히 보기 버튼 */}
            {notification.type === NotificationType.FOUND_REPORT && onDetail && (
              <TouchableOpacity
                onPress={handleDetail}
                style={{ marginTop: 8, alignSelf: 'flex-start' }}
              >
                <ActionButtonText style={{ color: '#25b2e2' }}>자세히 보기</ActionButtonText>
              </TouchableOpacity>
            )}
          </View>
        </NotificationSelectableArea>
      </NotificationItemContainer>
      </View>

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


