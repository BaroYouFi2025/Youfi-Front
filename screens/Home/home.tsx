import * as Location from 'expo-location';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, AppState } from 'react-native';
import KakaoMap from '../../components/KakaoMap/KakaoMap';
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

// Firebase는 네이티브 빌드에서만 사용 가능 (v22+ 모듈식 API)
let firebaseApp: any = null;
let getMessagingFunc: any = null;
let onMessageFunc: any = null;
try {
  const app = require('@react-native-firebase/app').default;
  const messagingModule = require('@react-native-firebase/messaging');
  firebaseApp = app;
  getMessagingFunc = messagingModule.getMessaging;
  onMessageFunc = messagingModule.onMessage;
} catch (e) {
  // Expo Go에서는 Firebase 사용 불가 (정상 동작)
  // 실제 기기 테스트는 npx expo run:ios 또는 npx expo run:android 사용
}

// 임시로 로고 이미지를 지도 배경으로 사용 (실제 지도 이미지로 교체 필요)
const mapImage = require('../../assets/images/react-logo.png');

export default function HomeScreen() {
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
  const [readNotifications, setReadNotifications] = useState<NotificationResponse[]>([]);
  const [selectedNotificationId, setSelectedNotificationId] = useState<number | null>(null);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [nearbyPersons, setNearbyPersons] = useState<NearbyMissingPerson[]>([]);
  const [loadingNearby, setLoadingNearby] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [lastQueryLocation, setLastQueryLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [lastQueryTime, setLastQueryTime] = useState<number | null>(null);
  const [lastNotificationLoadTime, setLastNotificationLoadTime] = useState<number | null>(null);

  // 설정값
  const TIME_INTERVAL = 60000; // 1분
  const DISTANCE_THRESHOLD = 10; // 10미터
  const LOCATION_CHECK_INTERVAL = 10000; // 10초마다 위치 체크
  const MIN_LOAD_INTERVAL = 3000; // 최소 조회 간격: 3초 (중복 호출 방지)

  type KakaoMapPerson = {
    id: number | string;
    name: string;
    latitude: number;
    longitude: number;
    photo_url?: string;
  };

  // 두 좌표 간 거리 계산 (미터)
  const calculateDistance = useCallback((
    loc1: { latitude: number; longitude: number },
    loc2: { latitude: number; longitude: number }
  ): number => {
    const R = 6371e3; // 지구 반지름 (미터)
    const φ1 = (loc1.latitude * Math.PI) / 180;
    const φ2 = (loc2.latitude * Math.PI) / 180;
    const Δφ = ((loc2.latitude - loc1.latitude) * Math.PI) / 180;
    const Δλ = ((loc2.longitude - loc1.longitude) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // 거리 (미터)
  }, []);

  // 조회 필요 여부 판단
  const shouldFetchNearbyPersons = useCallback((currentLoc: { latitude: number; longitude: number }): boolean => {
    // 초기 로딩 (한 번도 조회 안 함)
    if (!lastQueryLocation || !lastQueryTime) {
      return true;
    }

    // 시간 기반: 1분 경과
    const timeSinceLastQuery = Date.now() - lastQueryTime;
    if (timeSinceLastQuery >= TIME_INTERVAL) {
      return true;
    }

    // 거리 기반: 10m 이상 이동
    const distance = calculateDistance(lastQueryLocation, currentLoc);
    if (distance >= DISTANCE_THRESHOLD) {
      return true; // 거리 로그는 위치 체크에서 이미 출력됨
    }

    // 조회 불필요
    return false;
  }, [lastQueryLocation, lastQueryTime, TIME_INTERVAL, DISTANCE_THRESHOLD, calculateDistance]);

  // 위치 정보 가져오기
  const getCurrentLocation = useCallback(async () => {
    try {
      // 1. 위치 서비스 활성화 여부 확인
      const enabled = await Location.hasServicesEnabledAsync();
      if (!enabled) {
        return null;
      }

      // 2. 권한 확인
      let { status } = await Location.getForegroundPermissionsAsync();
      if (status !== 'granted') {
        const permissionResult = await Location.requestForegroundPermissionsAsync();
        status = permissionResult.status;
        if (status !== 'granted') {
          return null;
        }
      }

      // 3. 마지막으로 알려진 위치 먼저 시도 (빠름)
      let location = await Location.getLastKnownPositionAsync();

      // 4. 없으면 현재 위치 조회 (정확함, 느림)
      if (!location) {
        location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
      }

      if (location) {
        const coords = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        setCurrentLocation(coords);
        return coords;
      }

      return null;
    } catch (error) {
      console.error('❌ 위치 조회 실패:', error);
      return null;
    }
  }, []);

  // 근처 실종자 조회 (Time + Distance 최적화)
  const loadNearbyPersons = useCallback(async (force: boolean = false) => {
    try {
      // 로딩 중이면 중복 호출 방지
      if (loadingNearby) {
        return;
      }

      // 최소 간격 체크 (3초 이내 재호출 방지) - force일 때도 적용
      if (lastQueryTime && Date.now() - lastQueryTime < MIN_LOAD_INTERVAL) {
        return;
      }

      // 위치 정보가 없으면 가져오기
      let location = currentLocation;
      if (!location) {
        location = await getCurrentLocation();
        if (!location) {
          return;
        }
      }

      // 조회 필요 여부 판단 (force가 true면 무조건 조회)
      if (!force && !shouldFetchNearbyPersons(location)) {
        return;
      }

      setLoadingNearby(true);

      // 근처 실종자 조회 (반경 1km)
      const response = await getNearbyMissingPersons(
        location.latitude,
        location.longitude,
        1000 // 1km
      );

      // 조회 성공 시 마지막 조회 위치/시간 업데이트
      setLastQueryLocation(location);
      setLastQueryTime(Date.now());

      // 최대 2명만 표시
      const displayedPersons = response.content.slice(0, 2);

      if (displayedPersons.length > 0) {
        displayedPersons.forEach((person, index) => {
        });
      }

      setNearbyPersons(displayedPersons);
    } catch (error) {
      console.error('❌ 근처 실종자 로드 실패:', error);
      // 에러가 발생해도 빈 배열로 설정하여 UI가 깨지지 않도록 함
      setNearbyPersons([]);
    } finally {
      setLoadingNearby(false);
    }
  }, [currentLocation, getCurrentLocation, shouldFetchNearbyPersons, loadingNearby, lastQueryTime, MIN_LOAD_INTERVAL]);

  const loadNotifications = useCallback(async () => {
    try {
      // 로딩 중이면 중복 호출 방지
      if (loadingNotifications) {
        return;
      }

      // 최소 간격 체크 (3초 이내 재호출 방지)
      if (lastNotificationLoadTime && Date.now() - lastNotificationLoadTime < MIN_LOAD_INTERVAL) {
        return;
      }

      setLoadingNotifications(true);
      setLastNotificationLoadTime(Date.now());

      // 모든 알림 조회 (최신순)
      const allNotifications = await getMyNotifications();

      // 읽지 않은 알림과 읽은 알림 분리
      const unreadNotifications = allNotifications.filter(n => !n.isRead);
      const readNotifications = allNotifications.filter(n => n.isRead);

      // 읽지 않은 알림은 최신순으로 정렬
      const sortedUnread = unreadNotifications.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      // 읽은 알림도 최신순으로 정렬
      const sortedRead = readNotifications.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      // 읽지 않은 알림과 읽은 알림을 분리해서 상태 업데이트
      setNotifications(sortedUnread);
      setReadNotifications(sortedRead);
      setSelectedNotificationId((prev) => {
        if (!prev) {
          return prev;
        }
        const stillExists = [...sortedUnread, ...sortedRead].some((notification) => notification.id === prev);
        return stillExists ? prev : null;
      });
    } catch (error) {
      console.error('❌ 알림 로드 실패:', error instanceof Error ? error.message : String(error));
      // 에러가 발생해도 빈 배열로 설정하여 UI가 깨지지 않도록 함
      setNotifications([]);
    } finally {
      setLoadingNotifications(false);
    }
  }, [loadingNotifications, lastNotificationLoadTime, MIN_LOAD_INTERVAL]);

  const handleSelectNotification = useCallback(async (id: number) => {
    setSelectedNotificationId(id);
    const target = notifications.find((notif) => notif.id === id) || readNotifications.find((notif) => notif.id === id);

    // 이미 읽은 알림이면 처리하지 않음
    if (target?.isRead) {
      return;
    }

    // 읽지 않은 알림을 읽은 알림으로 이동
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    if (target) {
      setReadNotifications((prev) => [{ ...target, isRead: true }, ...prev]);
    }

    try {
      await markAsRead(id);
      // 알림 목록 새로고침
      await loadNotifications();
    } catch (error) {
      console.error('❌ 알림 읽음 처리 실패 (선택 이벤트):', error);
    }
  }, [notifications, readNotifications, loadNotifications]);

  const kakaoMapPersons: KakaoMapPerson[] = useMemo(
    () =>
      nearbyPersons.map((person, index) => ({
        id: person.id
          ?? person.missingPersonId
          ?? person.personId
          ?? person.missing_person_id
          ?? `nearby-${index}`,
        name: person.name,
        latitude: person.latitude,
        longitude: person.longitude,
        photo_url: person.photo_url,
      })),
    [nearbyPersons],
  );

  useEffect(() => {
    loadNotifications();
    loadNearbyPersons(true);
  }, [loadNotifications, loadNearbyPersons]);

  // 화면이 포커스될 때마다 알림 및 근처 실종자 새로고침
  useFocusEffect(
    useCallback(() => {
      loadNotifications();
      loadNearbyPersons(true); // 화면 포커스 시 강제 조회
    }, [loadNotifications, loadNearbyPersons])
  );

  // 포그라운드에 있을 때 주기적으로 새로고침 (30초마다)
  useEffect(() => {
    const interval = setInterval(() => {
      if (AppState.currentState === 'active') {
        loadNotifications();
        loadNearbyPersons(); // 주기적 조회는 Time+Distance 최적화 적용 (force=false)
      }
    }, 30000); // 30초마다

    return () => {
      clearInterval(interval);
    };
  }, [loadNotifications, loadNearbyPersons]);

  // 푸시 알림 수신 시 알림 목록 새로고침 (권한이 있을 때만)
  useEffect(() => {
    if (!firebaseApp || !getMessagingFunc || !onMessageFunc) {
      return;
    }

    const messaging = getMessagingFunc(firebaseApp);

    // 포그라운드에서 푸시 알림 수신 시
    const unsubscribe = onMessageFunc(messaging, async (remoteMessage: any) => {
      // 알림 목록 새로고침
      loadNotifications();
    });

    return () => {
      unsubscribe();
    };
  }, [loadNotifications]);

  // 주기적으로 위치 체크하여 거리 변화 감지 (5초마다)
  useEffect(() => {
    const locationCheckInterval = setInterval(async () => {
      if (AppState.currentState === 'active') {
        try {
          // 위치 권한 확인
          const { status } = await Location.getForegroundPermissionsAsync();
          if (status !== 'granted') {
            return;
          }

          // 현재 위치 가져오기
          const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });

          const newCoords = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          };

          // 이전 위치와 비교
          if (currentLocation) {
            const distance = calculateDistance(currentLocation, newCoords);

            // 10m 이상 이동 시 즉시 근처 실종자 조회
            if (distance >= DISTANCE_THRESHOLD) {
              setCurrentLocation(newCoords);
              // 위치가 업데이트되면 loadNearbyPersons()가 자동으로 거리 체크 후 조회
              loadNearbyPersons();
            } else {
              // 작은 이동은 currentLocation만 업데이트 (로그 생략)
              setCurrentLocation(newCoords);
            }
          } else {
            // 초기 위치 설정
            setCurrentLocation(newCoords);
          }
        } catch (error) {
          // 위치 조회 에러는 조용히 무시 (너무 빈번함)
        }
      }
    }, LOCATION_CHECK_INTERVAL); // 10초마다

    return () => {
      clearInterval(locationCheckInterval);
    };
  }, [currentLocation, calculateDistance, DISTANCE_THRESHOLD, LOCATION_CHECK_INTERVAL, loadNearbyPersons]);


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
          {/* 알림 박스 (읽지 않은 알림 + 읽은 알림 스택 형태) */}
          <NotificationBox
            notifications={[...notifications, ...readNotifications]}
            loading={loadingNotifications}
            selectedId={selectedNotificationId}
            onSelect={handleSelectNotification}
            onAccept={async (id, relation) => {
              try {
                setSelectedNotificationId(id);
                const target = notifications.find((notif) => notif.id === id);
                
                // 읽지 않은 알림을 읽은 알림으로 이동
                if (target) {
                  setNotifications((prev) => prev.filter((notif) => notif.id !== id));
                  setReadNotifications((prev) => [{ ...target, isRead: true }, ...prev]);
                }
                
                await acceptInvitationFromNotification(id, {
                  relation: relation,
                });
                // 읽음 처리
                await markAsRead(id);
                // 알림 목록 새로고침
                await loadNotifications();
                Alert.alert('성공', '초대를 수락했습니다.');
              } catch (error) {
                console.error('❌ 초대 수락 실패:', error);
                // 실패 시 상태 롤백
                const target = readNotifications.find((notif) => notif.id === id);
                if (target) {
                  setReadNotifications((prev) => prev.filter((notif) => notif.id !== id));
                  setNotifications((prev) => [{ ...target, isRead: false }, ...prev]);
                }
                const errorMessage = error instanceof Error ? error.message : '초대 수락에 실패했습니다.';
                Alert.alert('실패', errorMessage);
              }
            }}
            onReject={async (id) => {
              try {
                setSelectedNotificationId(id);
                const target = notifications.find((notif) => notif.id === id);
                
                // 읽지 않은 알림을 읽은 알림으로 이동
                if (target) {
                  setNotifications((prev) => prev.filter((notif) => notif.id !== id));
                  setReadNotifications((prev) => [{ ...target, isRead: true }, ...prev]);
                }
                
                await rejectInvitationFromNotification(id);
                // 읽음 처리
                await markAsRead(id);
                // 알림 목록 새로고침
                await loadNotifications();
                Alert.alert('성공', '초대를 거절했습니다.');
              } catch (error) {
                console.error('❌ 초대 거절 실패:', error);
                // 실패 시 상태 롤백
                const target = readNotifications.find((notif) => notif.id === id);
                if (target) {
                  setReadNotifications((prev) => prev.filter((notif) => notif.id !== id));
                  setNotifications((prev) => [{ ...target, isRead: false }, ...prev]);
                }
                const errorMessage = error instanceof Error ? error.message : '초대 거절에 실패했습니다.';
                Alert.alert('실패', errorMessage);
              }
            }}
            onDetail={async (id) => {
              try {
                const target = notifications.find((notif) => notif.id === id) || readNotifications.find((notif) => notif.id === id);
                
                // 읽지 않은 알림을 읽은 알림으로 이동
                if (target && !target.isRead) {
                  setNotifications((prev) => prev.filter((notif) => notif.id !== id));
                  setReadNotifications((prev) => [{ ...target, isRead: true }, ...prev]);
                }

                // 읽음 처리 API 호출
                await markAsRead(id);

                // 발견되었다 페이지로 이동
                router.push({
                  pathname: '/person-found',
                  params: { notificationId: id.toString() },
                });
              } catch (error) {
                console.error('❌ 읽음 처리 실패:', error);
                router.push({
                  pathname: '/person-found',
                  params: { notificationId: id.toString() },
                });
              }
            }}
            onMarkAsRead={async (id) => {
              try {
                const target = notifications.find((notif) => notif.id === id);
                
                // 읽지 않은 알림을 읽은 알림으로 이동
                if (target) {
                  setNotifications((prev) => prev.filter((notif) => notif.id !== id));
                  setReadNotifications((prev) => [{ ...target, isRead: true }, ...prev]);
                }
                
                await markAsRead(id);
                await loadNotifications();
              } catch (error) {
                console.error('❌ 읽음 처리 실패:', error);
              }
            }}
          />

          {/* Map */}
          <MapContainer>
            <KakaoMap
              currentLocation={currentLocation}
              nearbyPersons={kakaoMapPersons}
            />
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
              nearbyPersons.map((person, index) => {
                const personKey = person.id ?? person.missingPersonId ?? person.personId ?? person.missing_person_id ?? `nearby-${index}`;
                return (
                  <PersonItem key={personKey} style={{ borderBottomWidth: index === nearbyPersons.length - 1 ? 0 : 1 }}>
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
                );
              })
            )}
          </MissingPersonCard>
        </ContentArea>
      </ScrollContainer>
    </Container>
  );
}
