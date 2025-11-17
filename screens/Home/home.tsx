import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert } from 'react-native';
import YouFiLogo from '../../components/YouFiLogo';
import { registerDevice } from '../../services/deviceAPI';
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
  NotificationBox,
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
  const [isRegistering, setIsRegistering] = useState(false);

  const handleNavPress = (tab: string) => {
    setActiveTab(tab);
    
    if (tab === 'profile') {
      router.push('/login');
    }
    // TODO: Implement other navigation
  };

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
            <MapImage source={mapImage} resizeMode="cover">
              <MapOverlay />
              <MapMarker>
                <MarkerIcon />
              </MapMarker>
            </MapImage>
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
            <CardTitle>근처 실종자</CardTitle>
            
            {/* Person 1 */}
            <PersonItem>
              <PersonImage />
              <PersonInfo>
                <PersonMainInfo>
                  <PersonText>이름</PersonText>
                  <Dot />
                  <PersonText>실종 위치</PersonText>
                </PersonMainInfo>
                <PersonDescription>(인상착의 정보)</PersonDescription>
              </PersonInfo>
              <ReportButton onPress={() => router.push('/missing-report')}>
                <ReportButtonText>신고하기</ReportButtonText>
              </ReportButton>
            </PersonItem>

            {/* Person 2 */}
            <PersonItem style={{ borderBottomWidth: 0 }}>
              <PersonInfo style={{ marginLeft: 16 }}>
                <PersonMainInfo>
                  <PersonText>실종 일자</PersonText>
                  <Dot />
                  <PersonText>치매 여부</PersonText>
                </PersonMainInfo>
              </PersonInfo>
            </PersonItem>
          </MissingPersonCard>
        </ContentArea>
      </ScrollContainer>
    </Container>
  );
}