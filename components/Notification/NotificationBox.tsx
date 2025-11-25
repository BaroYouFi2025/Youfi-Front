import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NotificationResponse } from '@/types/NotificationTypes';
import NotificationItem from './NotificationItem';
import {
  NotificationBoxContainer,
  NotificationContent,
  MoreButton,
  MoreButtonText,
} from './NotificationBox.styles';

interface NotificationBoxProps {
  notifications: NotificationResponse[];
  loading?: boolean;
  onAccept?: (id: number, relation: string) => Promise<void>;
  onReject?: (id: number) => Promise<void>;
  onDetail?: (id: number) => Promise<void>;
  onMarkAsRead?: (id: number) => Promise<void>;
  onSelect?: (id: number) => Promise<void> | void;
  selectedId?: number | null;
}

export default function NotificationBox({
  notifications,
  loading = false,
  onAccept,
  onReject,
  onDetail,
  onMarkAsRead,
  onSelect,
  selectedId,
}: NotificationBoxProps) {
  const router = useRouter();

  if (loading) {
    return (
      <NotificationBoxContainer>
        <ActivityIndicator size="small" color="#25b2e2" style={{ marginTop: 20 }} />
      </NotificationBoxContainer>
    );
  }

  // 읽지 않은 알림과 읽은 알림을 모두 포함하여 최신순 정렬
  const sortedNotifications = [...notifications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // 동일한 ID가 중복되어 들어올 때 키 충돌을 막기 위해 ID 기준으로 중복 제거
  const uniqueNotifications = sortedNotifications.filter(
    (notification, index, self) => self.findIndex((n) => n.id === notification.id) === index
  );

  // 읽지 않은 알림 우선, 그 다음 읽은 알림 순서로 정렬
  const unreadNotifications = uniqueNotifications.filter((n) => !n.isRead);
  const readNotifications = uniqueNotifications.filter((n) => n.isRead);
  
  // 읽지 않은 알림을 먼저 표시하고, 부족하면 읽은 알림으로 채움 (최대 3개)
  const displayedNotifications = [
    ...unreadNotifications.slice(0, 3),
    ...readNotifications.slice(0, Math.max(0, 3 - unreadNotifications.length))
  ].slice(0, 3);
  
  const hasMoreNotifications = notifications.length > displayedNotifications.length;

  if (displayedNotifications.length === 0) {
    return (
      <NotificationBoxContainer>
        <NotificationContent>알림이 없습니다</NotificationContent>
      </NotificationBoxContainer>
    );
  }

  return (
    <NotificationBoxContainer>
      <View>
        {displayedNotifications.map((item, index) => (
          <View key={item.id} style={{ marginBottom: index < displayedNotifications.length - 1 ? 8 : 0 }}>
            <NotificationItem
              notification={item}
              onAccept={onAccept}
              onReject={onReject}
              onDetail={onDetail}
              onMarkAsRead={onMarkAsRead}
              onSelect={onSelect}
              isSelected={selectedId === item.id}
              isLast={index === displayedNotifications.length - 1}
              index={index}
              totalCount={displayedNotifications.length}
              isUnread={!item.isRead}
            />
          </View>
        ))}
      </View>
      
      {hasMoreNotifications && (
        <MoreButton onPress={() => router.push('/notifications')}>
          <MoreButtonText>더보기</MoreButtonText>
        </MoreButton>
      )}
    </NotificationBoxContainer>
  );
}

