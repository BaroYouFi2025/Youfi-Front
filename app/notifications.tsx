import { acceptInvitationFromNotification, getMyNotifications, markAsRead, rejectInvitationFromNotification } from '@/services/notificationAPI';
import { NotificationResponse } from '@/types/NotificationTypes';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import NotificationItem from '@/components/Notification/NotificationItem';
import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
  background-color: #ffffff;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 16px;
  border-bottom-width: 1px;
  border-bottom-color: #e5e7eb;
`;

const BackButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  justify-content: center;
  align-items: center;
  margin-right: 8px;
`;

const Title = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: #16171a;
  font-family: 'Wanted Sans';
  letter-spacing: -0.2px;
  flex: 1;
`;

const ContentContainer = styled.ScrollView`
  flex: 1;
  padding: 16px;
`;

const ScrollContent = styled.View`
  flex-grow: 1;
  padding-bottom: 32px;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: #16171a;
  font-family: 'Wanted Sans';
  margin-bottom: 12px;
  margin-top: 8px;
`;

const EmptyText = styled.Text`
  font-size: 14px;
  color: #949494;
  text-align: center;
  margin-top: 40px;
  font-family: 'Wanted Sans';
`;

const Separator = styled.View`
  height: 1px;
  background-color: #e5e7eb;
  margin-vertical: 8px;
`;

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const notificationsRef = React.useRef<NotificationResponse[]>([]);

  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const allNotifications = await getMyNotifications();
      
      // 기존 알림 ID 목록 (ref 사용으로 최신 상태 참조)
      const currentNotificationIds = new Set(notificationsRef.current.map(n => n.id));
      
      // 새로운 알림만 필터링
      const newNotifications = allNotifications.filter(n => !currentNotificationIds.has(n.id));
      
      // 최신순 정렬
      const sorted = allNotifications.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      console.log('📬 전체 알림 개수:', sorted.length);
      console.log('📬 읽지 않은 알림:', sorted.filter(n => !n.isRead).length);
      console.log('📬 읽은 알림:', sorted.filter(n => n.isRead).length);
      console.log('📬 새로운 알림 개수:', newNotifications.length);
      
      // 새로운 알림이 있을 때만 상태 업데이트 (최적화)
      if (newNotifications.length > 0 || notificationsRef.current.length === 0) {
        setNotifications(sorted);
        notificationsRef.current = sorted;
      }
    } catch (error) {
      console.error('❌ 알림 목록 불러오기 실패:', error);
      setNotifications([]);
      notificationsRef.current = [];
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadNotifications();
    }, [loadNotifications])
  );

  // notifications 상태가 변경될 때 ref도 업데이트
  React.useEffect(() => {
    notificationsRef.current = notifications;
  }, [notifications]);

  const unreadNotifications = notifications.filter(n => !n.isRead);
  const readNotifications = notifications.filter(n => n.isRead);

  const handleMarkAsRead = async (id: number) => {
    try {
      await markAsRead(id);
      setNotifications(prev => {
        const updated = prev.map(n => n.id === id ? { ...n, isRead: true } : n);
        notificationsRef.current = updated;
        return updated;
      });
    } catch (error) {
      console.error('❌ 읽음 처리 실패:', error);
    }
  };

  const handleAccept = async (id: number, relation: string) => {
    try {
      console.log('📬 초대 수락 시작:', { id, relation });
      setNotifications(prev => {
        const updated = prev.map(n => n.id === id ? { ...n, isRead: true } : n);
        notificationsRef.current = updated;
        return updated;
      });
      await acceptInvitationFromNotification(id, { relation });
      console.log('📬 초대 수락 성공');
      await markAsRead(id);
      await loadNotifications();
      Alert.alert('성공', '초대를 수락했습니다.');
    } catch (error) {
      console.error('❌ 초대 수락 실패:', error);
      setNotifications(prev => {
        const updated = prev.map(n => n.id === id ? { ...n, isRead: false } : n);
        notificationsRef.current = updated;
        return updated;
      });
      const errorMessage = error instanceof Error ? error.message : '초대 수락에 실패했습니다.';
      Alert.alert('실패', errorMessage);
    }
  };

  const handleReject = async (id: number) => {
    try {
      console.log('📬 초대 거절 시작:', id);
      setNotifications(prev => {
        const updated = prev.map(n => n.id === id ? { ...n, isRead: true } : n);
        notificationsRef.current = updated;
        return updated;
      });
      await rejectInvitationFromNotification(id);
      console.log('📬 초대 거절 성공');
      await markAsRead(id);
      await loadNotifications();
      Alert.alert('성공', '초대를 거절했습니다.');
    } catch (error) {
      console.error('❌ 초대 거절 실패:', error);
      setNotifications(prev => {
        const updated = prev.map(n => n.id === id ? { ...n, isRead: false } : n);
        notificationsRef.current = updated;
        return updated;
      });
      const errorMessage = error instanceof Error ? error.message : '초대 거절에 실패했습니다.';
      Alert.alert('실패', errorMessage);
    }
  };

  const handleDetail = async (id: number) => {
    try {
      await handleMarkAsRead(id);
      router.push({
        pathname: '/person-found',
        params: { notificationId: id.toString() },
      });
    } catch (error) {
      console.error('❌ 상세보기 실패:', error);
    }
  };

  if (loading) {
    return (
      <Container>
        <Header>
          <BackButton onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#16171a" />
          </BackButton>
          <Title>알림</Title>
        </Header>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#25b2e2" />
        </View>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <BackButton onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#16171a" />
        </BackButton>
        <Title>알림</Title>
      </Header>

      <ContentContainer 
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <ScrollContent>
          {unreadNotifications.length > 0 && (
            <>
              <SectionTitle>읽지 않은 알림</SectionTitle>
              {unreadNotifications.map((notification, index) => (
                <View key={notification.id}>
                  <NotificationItem
                    notification={notification}
                    onAccept={handleAccept}
                    onReject={handleReject}
                    onDetail={handleDetail}
                    onMarkAsRead={handleMarkAsRead}
                    isUnread={true}
                    index={index}
                    totalCount={unreadNotifications.length}
                  />
                  {index < unreadNotifications.length - 1 && <Separator />}
                </View>
              ))}
            </>
          )}

          {readNotifications.length > 0 && (
            <>
              <SectionTitle style={{ marginTop: unreadNotifications.length > 0 ? 24 : 0 }}>
                읽은 알림
              </SectionTitle>
              {readNotifications.map((notification, index) => (
                <View key={notification.id}>
                  <NotificationItem
                    notification={notification}
                    onAccept={handleAccept}
                    onReject={handleReject}
                    onDetail={handleDetail}
                    onMarkAsRead={handleMarkAsRead}
                    isUnread={false}
                    index={index}
                    totalCount={readNotifications.length}
                  />
                  {index < readNotifications.length - 1 && <Separator />}
                </View>
              ))}
            </>
          )}

          {notifications.length === 0 && (
            <EmptyText>알림이 없습니다</EmptyText>
          )}
        </ScrollContent>
      </ContentContainer>
    </Container>
  );
}

