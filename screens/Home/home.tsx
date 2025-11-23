import * as Location from 'expo-location';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert, AppState } from 'react-native';
import { NotificationBox } from '../../components/Notification';
import YouFiLogo from '../../components/YouFiLogo';
import { getNearbyMissingPersons } from '../../services/missingPersonAPI';
import { acceptInvitationFromNotification, getMyNotifications, markAsRead, rejectInvitationFromNotification } from '../../services/notificationAPI';
import { NearbyMissingPerson } from '../../types/MissingPersonTypes';
import { NotificationResponse } from '../../types/NotificationTypes';
import {
  CardTitle,
  Container,
  ContentArea,
  Dot,
  HeaderContainer,
  MapContainer,
  MapImage,
  MapMarker,
  MapOverlay,
  MarkerIcon,
  MissingPersonCard,
  NotificationTitle,
  PersonDescription,
  PersonImage,
  PersonInfo,
  PersonItem,
  PersonMainInfo,
  PersonText,
  ReportButton,
  ReportButtonText,
  ScrollContainer
} from './home.styles';

// Firebase는 네이티브 빌드에서만 사용 가능 (Expo Go 불가)
let messaging: any = null;
try {
  messaging = require('@react-native-firebase/messaging').default;
} catch (e) {
  // Expo Go에서는 Firebase 사용 불가 (정상 동작)
  // 실제 기기 테스트는 npx expo run:ios 또는 npx expo run:android 사용
}

// 임시로 로고 이미지를 지도 배경으로 사용 (실제 지도 이미지로 교체 필요)
const mapImage = require('../../assets/images/react-logo.png');

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState('home');
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [nearbyPersons, setNearbyPersons] = useState<NearbyMissingPerson[]>([]);
  const [loadingNearby, setLoadingNearby] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const handleNavPress = (tab: string) => {
    setActiveTab(tab);
    
    if (tab === 'profile') {
      router.push('/login');
    }
    // TODO: Implement other navigation
  };

  // 위치 정보 가져오기
  const getCurrentLocation = useCallback(async () => {
    try {
      console.log('📍 위치 정보 가져오기 시작');
      
      // 먼저 현재 권한 상태 확인
      let { status } = await Location.getForegroundPermissionsAsync();
      console.log('📍 현재 위치 권한 상태:', status);
      
      // 권한이 없으면 요청
      if (status !== 'granted') {
        console.log('📍 위치 권한 요청 중...');
        const permissionResult = await Location.requestForegroundPermissionsAsync();
        status = permissionResult.status;
        console.log('📍 위치 권한 요청 결과:', status);
      }
      
      if (status !== 'granted') {
        console.warn('⚠️ 위치 권한이 거부되었습니다.');
        return null;
      }
      
      console.log('📍 위치 권한 확인 완료, 현재 위치 조회 중...');
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      
      console.log('📍 위치 정보 가져오기 성공:', {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
      });
      
      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      
      setCurrentLocation(coords);
      return coords;
    } catch (error) {
      console.error('❌ 위치 정보 가져오기 실패:', error);
      return null;
    }
  }, []);

  // 근처 실종자 조회
  const loadNearbyPersons = useCallback(async () => {
    try {
      setLoadingNearby(true);
      
      // 위치 정보가 없으면 가져오기
      let location = currentLocation;
      if (!location) {
        location = await getCurrentLocation();
        if (!location) {
          console.warn('⚠️ 위치 정보가 없어 근처 실종자를 조회할 수 없습니다.');
          return;
        }
      }
      
      // 근처 실종자 조회 (반경 1km)
      const response = await getNearbyMissingPersons(
        location.latitude,
        location.longitude,
        1000 // 1km
      );
      
      // 최대 2명만 표시
      const displayedPersons = response.content.slice(0, 2);
      setNearbyPersons(displayedPersons);
    } catch (error) {
      console.error('❌ 근처 실종자 로드 실패:', error);
      // 에러가 발생해도 빈 배열로 설정하여 UI가 깨지지 않도록 함
      setNearbyPersons([]);
    } finally {
      setLoadingNearby(false);
    }
  }, [currentLocation, getCurrentLocation]);

  const loadNotifications = useCallback(async () => {
    try {
      setLoadingNotifications(true);
      const startTime = Date.now();
      console.log('📬 ========== 알림 조회 시작 ==========');
      console.log('📬 조회 시점:', new Date().toISOString());
      console.log('📬 현재 앱 상태:', AppState.currentState);
      
      // 모든 알림 조회 (최신순)
      const allNotifications = await getMyNotifications();
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      console.log('📬 ========== 알림 조회 성공 ==========');
      console.log('📬 조회 소요 시간:', `${duration}ms`);
      console.log('📬 총 알림 개수:', allNotifications.length);
      console.log('📬 읽지 않은 알림 개수:', allNotifications.filter(n => !n.isRead).length);
      console.log('📬 읽은 알림 개수:', allNotifications.filter(n => n.isRead).length);
      
      if (allNotifications.length > 0) {
        console.log('📬 ========== 알림 상세 정보 ==========');
        allNotifications.forEach((notification, index) => {
          console.log(`📬 [${index + 1}] 알림 ID:`, notification.id);
          console.log(`📬 [${index + 1}] 메시지:`, notification.message);
          console.log(`📬 [${index + 1}] 읽음 상태:`, notification.isRead ? '✅ 읽음' : '❌ 읽지 않음');
          console.log(`📬 [${index + 1}] 생성 시간:`, notification.createdAt);
          console.log(`📬 [${index + 1}] 생성 시간 (포맷):`, new Date(notification.createdAt).toLocaleString('ko-KR'));
          if (notification.type) {
            console.log(`📬 [${index + 1}] 알림 타입:`, notification.type);
          }
          if (notification.relatedEntityId) {
            console.log(`📬 [${index + 1}] 관련 ID:`, notification.relatedEntityId);
          }
          console.log(`📬 [${index + 1}] 전체 데이터:`, JSON.stringify(notification, null, 2));
          console.log('📬 ----------------------------------------');
        });
      } else {
        console.log('📬 알림이 없습니다.');
      }
      
      // 최신순으로 정렬하고 최신 3개만 표시
      const sortedNotifications = allNotifications.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      const displayedNotifications = sortedNotifications.slice(0, 3);
      
      console.log('📬 ========== 화면에 표시할 알림 ==========');
      console.log('📬 표시할 알림 개수:', displayedNotifications.length);
      displayedNotifications.forEach((notification, index) => {
        console.log(`📬 [표시 ${index + 1}] ${notification.isRead ? '✅' : '❌'} ${notification.message.substring(0, 30)}...`);
      });
      console.log('📬 ========== 알림 조회 완료 ==========');
      
      setNotifications(displayedNotifications);
    } catch (error) {
      console.error('❌ ========== 알림 로드 실패 ==========');
      console.error('❌ 에러 발생 시점:', new Date().toISOString());
      console.error('❌ 에러 타입:', error instanceof Error ? error.constructor.name : typeof error);
      console.error('❌ 에러 메시지:', error instanceof Error ? error.message : String(error));
      console.error('❌ 에러 스택:', error instanceof Error ? error.stack : 'N/A');
      console.error('❌ 전체 에러 객체:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
      console.error('❌ ========================================');
      // 에러가 발생해도 빈 배열로 설정하여 UI가 깨지지 않도록 함
      setNotifications([]);
    } finally {
      setLoadingNotifications(false);
      console.log('📬 알림 로딩 상태: 완료');
    }
  }, []);

  // 화면이 포커스될 때마다 알림 및 근처 실종자 새로고침
  useFocusEffect(
    useCallback(() => {
      console.log('📬 홈 화면 포커스 - 알림 및 근처 실종자 조회 트리거');
      loadNotifications();
      loadNearbyPersons();
    }, [loadNotifications, loadNearbyPersons])
  );

  // 앱이 포그라운드에 있을 때 주기적으로 알림 목록 및 근처 실종자 새로고침
  useEffect(() => {
    // 앱이 포그라운드로 돌아올 때 즉시 새로고침
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      console.log('📬 앱 상태 변경:', {
        이전: AppState.currentState,
        다음: nextAppState,
        시점: new Date().toISOString(),
      });
      if (nextAppState === 'active') {
        console.log('📬 앱이 포그라운드로 복귀 - 알림 및 근처 실종자 조회 트리거');
        loadNotifications();
        loadNearbyPersons();
      }
    });

    // 포그라운드에 있을 때 주기적으로 새로고침 (30초마다)
    const interval = setInterval(() => {
      if (AppState.currentState === 'active') {
        console.log('📬 주기적 알림 및 근처 실종자 조회 트리거 (30초마다)');
        loadNotifications();
        loadNearbyPersons();
      }
    }, 30000); // 30초마다

    console.log('📬 주기적 조회 설정 완료 (30초 간격)');

    return () => {
      console.log('📬 조회 리스너 정리');
      subscription.remove();
      clearInterval(interval);
    };
  }, [loadNotifications, loadNearbyPersons]);

  // 푸시 알림 수신 시 알림 목록 새로고침 (권한이 있을 때만)
  useEffect(() => {
    if (!messaging) {
      return;
    }

    // 포그라운드에서 푸시 알림 수신 시
    const unsubscribe = messaging().onMessage(async (remoteMessage: any) => {
      console.log('📬 ========== 포그라운드 푸시 알림 수신 ==========');
      console.log('📬 수신 시점:', new Date().toISOString());
      console.log('📬 알림 데이터:', JSON.stringify(remoteMessage, null, 2));
      console.log('📬 알림 제목:', remoteMessage?.notification?.title || 'N/A');
      console.log('📬 알림 본문:', remoteMessage?.notification?.body || 'N/A');
      console.log('📬 알림 데이터 (data):', remoteMessage?.data || 'N/A');
      console.log('📬 메시지 ID:', remoteMessage?.messageId || 'N/A');
      console.log('📬 ============================================');
      // 알림 목록 새로고침
      console.log('📬 푸시 알림 수신으로 인한 알림 목록 새로고침 트리거');
      loadNotifications();
    });

    return () => {
      unsubscribe();
    };
  }, [loadNotifications]);


  return (
    <Container>
      <ScrollContainer showsVerticalScrollIndicator={false}>
        {/* Header with YouFi Logo */}
        <HeaderContainer>
          <YouFiLogo />
        </HeaderContainer>

        {/* Notification Title */}
        <NotificationTitle>알림</NotificationTitle>

        {/* Content Area */}
        <ContentArea>
          {/* Notification Box */}
          <NotificationBox
            notifications={notifications}
            loading={loadingNotifications}
            onAccept={async (id, relation) => {
              try {
                console.log('📬 초대 수락 시작:', { id, relation });
                // 로컬 상태 즉시 업데이트 (버튼 즉시 숨김)
                setNotifications((prev) =>
                  prev.map((notif) =>
                    notif.id === id ? { ...notif, isRead: true } : notif
                  )
                );
                await acceptInvitationFromNotification(id, {
                  relation: relation,
                                });
                                console.log('📬 초대 수락 성공');
                // 읽음 처리
                await markAsRead(id);
                console.log('📬 읽음 처리 완료');
                // 알림 목록 새로고침
                                await loadNotifications();
                Alert.alert('성공', '초대를 수락했습니다.');
                              } catch (error) {
                                console.error('❌ 초대 수락 실패:', error);
                // 실패 시 상태 롤백
                setNotifications((prev) =>
                  prev.map((notif) =>
                    notif.id === id ? { ...notif, isRead: false } : notif
                  )
                );
                const errorMessage = error instanceof Error ? error.message : '초대 수락에 실패했습니다.';
                Alert.alert('실패', errorMessage);
              }
            }}
            onReject={async (id) => {
                              try {
                console.log('📬 초대 거절 시작:', id);
                // 로컬 상태 즉시 업데이트 (버튼 즉시 숨김)
                setNotifications((prev) =>
                  prev.map((notif) =>
                    notif.id === id ? { ...notif, isRead: true } : notif
                  )
                );
                await rejectInvitationFromNotification(id);
                                console.log('📬 초대 거절 성공');
                // 읽음 처리
                await markAsRead(id);
                console.log('📬 읽음 처리 완료');
                // 알림 목록 새로고침
                                await loadNotifications();
                Alert.alert('성공', '초대를 거절했습니다.');
                              } catch (error) {
                                console.error('❌ 초대 거절 실패:', error);
                // 실패 시 상태 롤백
                setNotifications((prev) =>
                  prev.map((notif) =>
                    notif.id === id ? { ...notif, isRead: false } : notif
                  )
                );
                const errorMessage = error instanceof Error ? error.message : '초대 거절에 실패했습니다.';
                Alert.alert('실패', errorMessage);
              }
            }}
            onDetail={async (id) => {
              try {
                console.log('📬 자세히 보기 클릭:', { notificationId: id });
                
                // 1. 즉시 로컬 상태 업데이트 (읽음 상태로 변경)
                setNotifications((prev) =>
                  prev.map((notif) =>
                    notif.id === id ? { ...notif, isRead: true } : notif
                  )
                );
                console.log('✅ 알림 읽음 상태 즉시 업데이트 (프론트):', { notificationId: id });
                
                // 2. 읽음 처리 API 호출 (기다림)
                await markAsRead(id);
                console.log('✅ 읽음 처리 API 완료:', { notificationId: id });
                
                // 3. 발견되었다 페이지로 이동
                console.log('📬 발견되었다 페이지로 이동');
                router.push({
                  pathname: '/person-found',
                  params: { notificationId: id.toString() },
                });
              } catch (error) {
                console.error('❌ 읽음 처리 실패:', error);
                // 실패 시 상태 롤백
                setNotifications((prev) =>
                  prev.map((notif) =>
                    notif.id === id ? { ...notif, isRead: false } : notif
                  )
                );
                // 에러가 있어도 페이지는 이동
                router.push({
                  pathname: '/person-found',
                  params: { notificationId: id.toString() },
                });
              }
            }}
            onMarkAsRead={async (id) => {
              try {
                console.log('📬 알림 읽음 처리 시작 (Home):', { notificationId: id });
                await markAsRead(id);
                console.log('✅ 알림 읽음 처리 완료 (Home):', { notificationId: id });
                // 로컬 상태 즉시 업데이트
                setNotifications((prev) =>
                  prev.map((notif) =>
                    notif.id === id ? { ...notif, isRead: true } : notif
                  )
                );
                // 알림 목록 새로고침
                await loadNotifications();
              } catch (error) {
                console.error('❌ 읽음 처리 실패:', error);
              }
            }}
          />

          {/* Map */}
          <MapContainer>
            <MapImage source={mapImage} resizeMode="cover">
              <MapOverlay />
              <MapMarker>
                <MarkerIcon />
              </MapMarker>
            </MapImage>
          </MapContainer>

          {/* Missing Person Card */}
          <MissingPersonCard>
            <CardTitle>근처 실종자</CardTitle>
            
            {loadingNearby ? (
              <PersonItem>
                <PersonText>로딩 중...</PersonText>
              </PersonItem>
            ) : nearbyPersons.length === 0 ? (
              <PersonItem>
                <PersonText>근처에 실종자가 없습니다.</PersonText>
              </PersonItem>
            ) : (
              nearbyPersons.map((person, index) => (
                <PersonItem key={person.id} style={{ borderBottomWidth: index === nearbyPersons.length - 1 ? 0 : 1 }}>
                  {person.photo_url && <PersonImage source={{ uri: person.photo_url }} />}
                  {!person.photo_url && <PersonImage />}
                  <PersonInfo>
                    <PersonMainInfo>
                      <PersonText>{person.name}</PersonText>
                      <Dot />
                      <PersonText>{person.address || `${person.latitude.toFixed(4)}, ${person.longitude.toFixed(4)}`}</PersonText>
                    </PersonMainInfo>
                    <PersonDescription>
                      {person.missing_date} • {person.hasDementia ? '치매' : '일반'}
                      {person.distance && ` • ${person.distance}m`}
                    </PersonDescription>
                    <PersonDescription>
                      {person.top_clothing && `상의: ${person.top_clothing}`}
                      {person.bottom_clothing && ` / 하의: ${person.bottom_clothing}`}
                    </PersonDescription>
                  </PersonInfo>
                  <ReportButton onPress={() => router.push('/missing-report')}>
                    <ReportButtonText>신고하기</ReportButtonText>
                  </ReportButton>
                </PersonItem>
              ))
            )}
          </MissingPersonCard>
        </ContentArea>
      </ScrollContainer>
    </Container>
  );
}