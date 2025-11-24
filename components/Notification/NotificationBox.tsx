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

  return (
    <NotificationBoxContainer>
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onAccept={onAccept}
          onReject={onReject}
          onDetail={onDetail}
          onMarkAsRead={onMarkAsRead}
          onSelect={onSelect}
          isSelected={selectedId === notification.id}
        />
      ))}
    </NotificationBoxContainer>
  );
}


