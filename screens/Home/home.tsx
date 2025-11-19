import * as Location from 'expo-location';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert } from 'react-native';
import KakaoMap from '../../components/KakaoMap/KakaoMap';
import YouFiLogo from '../../components/YouFiLogo';
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

export default function HomeScreen() {
  const [nearbyPersons, setNearbyPersons] = useState<NearbyMissingPerson[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);

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