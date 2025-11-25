import { NotificationResponse, NotificationType } from '@/types/NotificationTypes';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useState } from 'react';
import { Animated, Modal, PanResponder, ScrollView, TouchableOpacity, View } from 'react-native';
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
}: NotificationItemProps) {
  const [relationModalVisible, setRelationModalVisible] = useState(false);
  const pan = useRef(new Animated.ValueXY()).current;
  const scale = useRef(new Animated.Value(1)).current;
  const [isDragging, setIsDragging] = useState(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // 드래그로 간주할 최소 거리
        return Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5;
      },
      onMoveShouldSetPanResponderCapture: (_, gestureState) => {
        // 알림 박스 내부 터치를 캡처하여 스크롤 방지
        return Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5;
      },
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: () => {
        // 터치 시작 시 즉시 선택
        if (onSelect) {
          onSelect(notification.id);
        }
        // 애니메이션 초기화
        pan.setOffset({
          x: (pan.x as any)._value || 0,
          y: (pan.y as any)._value || 0,
        });
        pan.setValue({ x: 0, y: 0 });
        // 약간 확대 효과
        Animated.spring(scale, {
          toValue: 1.02,
          useNativeDriver: true,
          tension: 300,
          friction: 30,
        }).start();
      },
      onPanResponderMove: (evt, gestureState) => {
        // 드래그 애니메이션
        pan.setValue({ x: gestureState.dx, y: gestureState.dy });
        // 드래그 중일 때
        if (!isDragging && (Math.abs(gestureState.dx) > 10 || Math.abs(gestureState.dy) > 10)) {
          setIsDragging(true);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        pan.flattenOffset();
        setIsDragging(false);
        
        // 탭인지 드래그인지 판단
        const isTap = Math.abs(gestureState.dx) < 10 && Math.abs(gestureState.dy) < 10;
        
        if (isTap) {
          // 탭인 경우: 선택만 처리하고 원위치로
          Animated.parallel([
            Animated.spring(pan, {
              toValue: { x: 0, y: 0 },
              useNativeDriver: false,
              tension: 300,
              friction: 30,
            }),
            Animated.spring(scale, {
              toValue: 1,
              useNativeDriver: true,
              tension: 300,
              friction: 30,
            }),
          ]).start();
        } else {
          // 드래그인 경우: 원위치로 부드럽게 복귀
          Animated.parallel([
            Animated.spring(pan, {
              toValue: { x: 0, y: 0 },
              useNativeDriver: false,
              tension: 200,
              friction: 20,
            }),
            Animated.spring(scale, {
              toValue: 1,
              useNativeDriver: true,
              tension: 300,
              friction: 30,
            }),
          ]).start();
        }
      },
      onPanResponderTerminate: () => {
        // 터치가 중단된 경우 원위치로
        pan.flattenOffset();
        setIsDragging(false);
        Animated.parallel([
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
            tension: 200,
            friction: 20,
          }),
          Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: true,
            tension: 300,
            friction: 30,
          }),
        ]).start();
      },
    })
  ).current;
  
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

  const handleSelect = async () => {
    if (onSelect) {
      await onSelect(notification.id);
    }
  };

  // FOUND_REPORT 타입일 때 특별한 디자인 렌더링
  if (notification.type === NotificationType.FOUND_REPORT) {
    return (
      <Animated.View
        style={{
          transform: [
            { translateX: pan.x },
            { translateY: pan.y },
            { scale: scale },
          ],
        }}
        {...panResponder.panHandlers}
      >
        <FoundReportContainer 
          isSelected={isSelected} 
          isLast={isLast} 
          index={index} 
          totalCount={totalCount}
          isUnread={isUnread !== undefined ? isUnread : !notification.isRead}
          collapsable={false}
        >
        {/* 읽음 상태일 때 상단 그라데이션 */}
        {notification.isRead && <ReadNotificationOverlay />}
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
        <NotificationSelectableArea 
          activeOpacity={0.7} 
          onPress={handleSelect}
          pointerEvents="box-none"
        >
          <FoundReportTitleRow>
            <NotificationTitleText 
              isUnread={isUnread !== undefined ? isUnread : !notification.isRead}
              style={{ fontSize: 20, lineHeight: 22, letterSpacing: -0.2, fontWeight: '700', flex: 1 }}
            >
              {notification.title}
            </NotificationTitleText>
            <NotificationTime style={{ fontSize: 10, lineHeight: 13, fontWeight: '500' }}>
              {timeString}
            </NotificationTime>
          </FoundReportTitleRow>
          <FoundReportMessageRow>
            <NotificationMessage 
              isUnread={isUnread !== undefined ? isUnread : !notification.isRead}
              style={{ fontSize: 14, lineHeight: 18, letterSpacing: -0.14, flex: 1, fontWeight: '500' }}
            >
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
        </NotificationSelectableArea>
        </FoundReportContainer>
      </Animated.View>
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
                <ActionButtonText style={{ color: '#25b2e2' }}>수락</ActionButtonText>
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
      case NotificationType.NEARBY_ALERT:
        // 주변 실종자 알림은 자세히 보기 버튼 없음
        return null;
      default:
        return null;
    }
  };

  return (
    <>
      <NotificationItemContainer 
        isUnread={isUnread !== undefined ? isUnread : !notification.isRead} 
        isSelected={isSelected} 
        isLast={isLast} 
        index={index} 
        totalCount={totalCount}
        {...panResponder.panHandlers}
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
            <NotificationTitleText isUnread={isUnread !== undefined ? isUnread : !notification.isRead}>
              {notification.title}
            </NotificationTitleText>
            <NotificationTime>{timeString}</NotificationTime>
          </NotificationHeaderText>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 0, height: 18, gap: 16 }}>
            <NotificationMessage 
              isUnread={isUnread !== undefined ? isUnread : !notification.isRead}
              style={{ flex: 1 }}
            >
              {notification.message}
            </NotificationMessage>
            {notification.type === NotificationType.INVITE_REQUEST && !notification.isRead && (
              <View style={{ flexDirection: 'row', gap: 12 }}>
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
          </View>
        </NotificationSelectableArea>
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


