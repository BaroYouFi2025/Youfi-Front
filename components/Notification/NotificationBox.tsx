import React from 'react';
import { ActivityIndicator } from 'react-native';
import { NotificationResponse } from '@/types/NotificationTypes';
import NotificationItem from './NotificationItem';
import {
  NotificationBoxContainer,
  NotificationContent,
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
  if (loading) {
    return (
      <NotificationBoxContainer>
        <ActivityIndicator size="small" color="#25b2e2" style={{ marginTop: 20 }} />
      </NotificationBoxContainer>
    );
  }

  if (notifications.length === 0) {
    return (
      <NotificationBoxContainer>
        <NotificationContent>알림이 없습니다</NotificationContent>
      </NotificationBoxContainer>
    );
  }

  // 읽지 않은 알림과 읽은 알림을 분리하여 스택 형태로 표시
  const unreadNotifications = notifications.filter(n => !n.isRead);
  const readNotifications = notifications.filter(n => n.isRead);
  // 최신 알림이 위로 오도록 역순으로 정렬 (아이폰 알림 스택처럼)
  const allNotifications = [...unreadNotifications, ...readNotifications].reverse();

  return (
    <NotificationBoxContainer
      onStartShouldSetResponder={() => true}
      onMoveShouldSetResponder={() => true}
      onResponderTerminationRequest={() => false}
    >
      {allNotifications.map((notification, index) => {
        // 역순 인덱스 계산 (맨 위 알림이 index 0)
        const reverseIndex = allNotifications.length - 1 - index;
        return (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onAccept={onAccept}
            onReject={onReject}
            onDetail={onDetail}
            onMarkAsRead={onMarkAsRead}
            onSelect={onSelect}
            isSelected={selectedId === notification.id}
            isLast={index === allNotifications.length - 1}
            index={reverseIndex}
            totalCount={unreadNotifications.length}
            isUnread={!notification.isRead}
          />
        );
      })}
    </NotificationBoxContainer>
  );
}


