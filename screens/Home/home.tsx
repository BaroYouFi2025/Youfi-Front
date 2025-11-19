import * as Location from 'expo-location';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert } from 'react-native';
import KakaoMap from '../../components/KakaoMap/KakaoMap';
import YouFiLogo from '../../components/YouFiLogo';
import { registerDevice } from '../../services/deviceAPI';
import { getNearbyMissingPersons } from '../../services/missingPersonAPI';
import type { NearbyMissingPerson } from '../../types/MissingPersonTypes';
import {
    CardTitle,
    Container,
    ContentArea,
    Dot,
    HeaderContainer,
    MapContainer,
    MissingPersonCard,
    NotificationBox,
    NotificationTitle,
    PersonDescription,
    PersonImage,
    PersonImagePlaceholder,
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



export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState('home');
  const [isRegistering, setIsRegistering] = useState(false);
  const [nearbyPersons, setNearbyPersons] = useState<NearbyMissingPerson[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const handleNavPress = (tab: string) => {
    setActiveTab(tab);
    
    if (tab === 'profile') {
      router.push('/login');
    }
    // TODO: Implement other navigation
  };

  const fetchNearbyMissingPersons = useCallback(async () => {
    if (!currentLocation) return;

    setIsLoading(true);
    try {
      const response = await getNearbyMissingPersons(
        currentLocation.latitude,
        currentLocation.longitude,
        1000, // 1km 반경
        0,
        20
      );
      setNearbyPersons(response.content || []);
    } catch (error) {
      console.error('Error fetching nearby missing persons:', error);
      Alert.alert('오류', '주변 실종자 조회에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [currentLocation]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('권한 필요', '위치 권한이 필요합니다.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  useEffect(() => {
    if (currentLocation) {
      fetchNearbyMissingPersons();
    }
  }, [currentLocation, fetchNearbyMissingPersons]);

  const handleRegisterDevice = useCallback(async () => {
    if (!messaging) {
      Alert.alert(
        '개발 모드',
        'Firebase는 네이티브 빌드에서만 사용 가능합니다.\n\nnpx expo run:android 또는\nnpx expo run:ios 로 실행해주세요.'
      );
      return;
    }

    setIsRegistering(true);
    try {
      // FCM 토큰 발급
      const token = await messaging().getToken();
      console.log('FCM Token:', token);

      // 서버로 토큰 전송
      const response = await registerDevice(token);
      
      Alert.alert('성공', '기기가 성공적으로 등록되었습니다.');
      console.log('Device registered:', response);
    } catch (error) {
      console.error('Error registering device:', error);
      Alert.alert('오류', error instanceof Error ? error.message : '기기 등록에 실패했습니다.');
    } finally {
      setIsRegistering(false);
    }
  }, []);

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
          <NotificationBox />

          {/* Map */}
          <MapContainer>
            {currentLocation ? (
              <KakaoMap
                latitude={currentLocation.latitude}
                longitude={currentLocation.longitude}
                zoom={5}
                markers={nearbyPersons.map(person => ({
                  lat: person.latitude,
                  lng: person.longitude,
                  title: person.name
                }))}
              />
            ) : (
              <ActivityIndicator size="large" color="#25b2e2" style={{ flex: 1 }} />
            )}
          </MapContainer>

          {/* FCM Device Registration Button */}
          <ReportButton 
            onPress={handleRegisterDevice}
            disabled={isRegistering}
            style={{ marginBottom: 16, opacity: isRegistering ? 0.6 : 1 }}
          >
            {isRegistering ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <ReportButtonText>FCM 기기 등록하기</ReportButtonText>
            )}
          </ReportButton>

          {/* Missing Person Card */}
          <MissingPersonCard>
            <CardTitle>근처 실종자 ({nearbyPersons.length}명)</CardTitle>
            
            {isLoading ? (
              <ActivityIndicator size="large" color="#007AFF" style={{ marginVertical: 20 }} />
            ) : nearbyPersons.length === 0 ? (
              <PersonItem style={{ borderBottomWidth: 0 }}>
                <PersonInfo style={{ marginLeft: 16 }}>
                  <PersonText>주변에 실종자가 없습니다.</PersonText>
                </PersonInfo>
              </PersonItem>
            ) : (
              nearbyPersons.map((person, index) => (
                <PersonItem key={person.id} style={{ borderBottomWidth: index === nearbyPersons.length - 1 ? 0 : 1 }}>
                  {person.photo_url ? (
                    <PersonImage source={{ uri: person.photo_url }} />
                  ) : (
                    <PersonImagePlaceholder />
                  )}
                  <PersonInfo style={{ flex: 1 }}>
                    <PersonMainInfo>
                      <PersonText>{person.name}</PersonText>
                      <Dot />
                      <PersonText>{person.address || '위치 정보 없음'}</PersonText>
                    </PersonMainInfo>
                    <PersonDescription>
                      {person.clothes_top} / {person.clothes_bottom}
                    </PersonDescription>
                    <PersonMainInfo>
                      <PersonText style={{ fontSize: 12, color: '#666' }}>
                        실종일: {new Date(person.missing_date).toLocaleDateString()}
                      </PersonText>
                      {person.distance && (
                        <>
                          <Dot />
                          <PersonText style={{ fontSize: 12, color: '#666' }}>
                            {person.distance < 1 
                              ? `${Math.round(person.distance * 1000)}m` 
                              : `${person.distance.toFixed(1)}km`}
                          </PersonText>
                        </>
                      )}
                    </PersonMainInfo>
                  </PersonInfo>
                  <ReportButton onPress={() => router.push(`/missing-report?id=${person.id}`)}>
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