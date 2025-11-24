import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

interface Location {
  latitude: number;
  longitude: number;
}

interface MissingPerson {
  id?: number | string;
  name: string;
  latitude: number;
  longitude: number;
  photo_url?: string;
}

interface MemberLocation {
  userId: number;
  name: string;
  relationship: string;
  batteryLevel: number;
  distance: number;
  location: {
    latitude: number;
    longitude: number;
  };
}

interface KakaoMapProps {
  currentLocation: Location | null;
  nearbyPersons: MissingPerson[];
  memberLocations?: MemberLocation[];
}

export default function KakaoMap({ currentLocation, nearbyPersons = [], memberLocations = [] }: KakaoMapProps) {
  const KAKAO_MAP_API_KEY = process.env.EXPO_PUBLIC_KAKAO_MAP_API_KEY || '';

  if (!KAKAO_MAP_API_KEY) {
    return (
      <View style={styles.container}>
        <Text style={{ color: '#ff6b6b', textAlign: 'center' }}>
          Kakao Map API 키가 설정되지 않았습니다.{'\n'}
          EXPO_PUBLIC_KAKAO_MAP_API_KEY 환경 변수를 확인해주세요.
        </Text>
      </View>
    );
  }


  if (nearbyPersons.length > 0) {
    nearbyPersons.forEach((person, index) => {
    });
  }

  // 기본 위치 (서울)
  const defaultLat = currentLocation?.latitude || 37.5665;
  const defaultLng = currentLocation?.longitude || 126.9780;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <title>지도</title>
        <script type="text/javascript" src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_API_KEY}"></script>
        <style>
            * { margin: 0; padding: 0; }
            html, body { width: 100%; height: 100%; overflow: hidden; }
            #map { width: 100%; height: 100%; }
        </style>
    </head>
    <body>
        <div id="map"></div>
        <script>
            try {
                
                // kakao 객체 확인
                if (typeof kakao === 'undefined') {
                    throw new Error('Kakao Maps SDK가 로드되지 않았습니다');
                }
                
                // 지도 생성
                var container = document.getElementById('map');
                if (!container) {
                    throw new Error('Map container를 찾을 수 없습니다');
                }
                
                var options = {
                    center: new kakao.maps.LatLng(${defaultLat}, ${defaultLng}),
                    level: 5
                };
                var map = new kakao.maps.Map(container, options);

            // 내 위치 마커 (파란색)
            ${currentLocation ? `
                var myPosition = new kakao.maps.LatLng(${currentLocation.latitude}, ${currentLocation.longitude});
                
                // 내 위치 커스텀 오버레이
                var myContent = '<div style="width: 30px; height: 30px; border-radius: 50%; background-color: #4285F4; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>';
                var myOverlay = new kakao.maps.CustomOverlay({
                    map: map,
                    position: myPosition,
                    content: myContent,
                    yAnchor: 0.5
                });
            ` : ''}

            // 실종자 위치 마커들 (빨간색)
            ${nearbyPersons.map((person, index) => `
                var position${index} = new kakao.maps.LatLng(${person.latitude}, ${person.longitude});
                
                // 실종자 마커 커스텀 오버레이
                var content${index} = '<div style="padding: 5px 10px; background-color: #FF5252; color: white; border-radius: 15px; font-size: 12px; font-weight: bold; box-shadow: 0 2px 5px rgba(0,0,0,0.3); white-space: nowrap;">${person.name}</div>';
                var overlay${index} = new kakao.maps.CustomOverlay({
                    map: map,
                    position: position${index},
                    content: content${index},
                    yAnchor: 1.5
                });
                
                // 빨간 점 마커
                var dotContent${index} = '<div style="width: 12px; height: 12px; border-radius: 50%; background-color: #FF5252; border: 2px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.3);"></div>';
                var dotOverlay${index} = new kakao.maps.CustomOverlay({
                    map: map,
                    position: position${index},
                    content: dotContent${index},
                    yAnchor: 0.5
                });
            `).join('\n')}

            // 구성원 위치 마커들 (초록색)
            ${memberLocations.map((member, index) => `
                var memberPosition${index} = new kakao.maps.LatLng(${member.location.latitude}, ${member.location.longitude});
                
                // 구성원 마커 커스텀 오버레이 (이름 + 관계)
                var memberContent${index} = '<div style="padding: 5px 10px; background-color: #4CAF50; color: white; border-radius: 15px; font-size: 12px; font-weight: bold; box-shadow: 0 2px 5px rgba(0,0,0,0.3); white-space: nowrap;">${member.name} (${member.relationship})</div>';
                var memberOverlay${index} = new kakao.maps.CustomOverlay({
                    map: map,
                    position: memberPosition${index},
                    content: memberContent${index},
                    yAnchor: 1.5
                });
                
                // 초록 점 마커
                var memberDotContent${index} = '<div style="width: 12px; height: 12px; border-radius: 50%; background-color: #4CAF50; border: 2px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.3);"></div>';
                var memberDotOverlay${index} = new kakao.maps.CustomOverlay({
                    map: map,
                    position: memberPosition${index},
                    content: memberDotContent${index},
                    yAnchor: 0.5
                });
            `).join('\n')}

            // 모든 마커가 보이도록 지도 범위 재설정
            ${(nearbyPersons.length > 0 || memberLocations.length > 0) && currentLocation ? `
                var bounds = new kakao.maps.LatLngBounds();
                
                // 내 위치 추가
                bounds.extend(new kakao.maps.LatLng(${currentLocation.latitude}, ${currentLocation.longitude}));
                
                // 실종자 위치들 추가
                ${nearbyPersons.map((person, index) => `
                    bounds.extend(new kakao.maps.LatLng(${person.latitude}, ${person.longitude}));
                `).join('\n')}
                
                // 구성원 위치들 추가
                ${memberLocations.map((member, index) => `
                    bounds.extend(new kakao.maps.LatLng(${member.location.latitude}, ${member.location.longitude}));
                `).join('\n')}
                
                // 지도 범위 재설정
                map.setBounds(bounds);
            ` : ''}
                
                
                // React Native로 성공 메시지 전달
                if (window.ReactNativeWebView) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'success',
                        message: 'Map loaded successfully'
                    }));
                }
            } catch (error) {
                console.error('❌ Kakao Maps 에러:', error);
                
                // React Native로 에러 전달
                if (window.ReactNativeWebView) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'error',
                        message: error.message || 'Unknown error'
                    }));
                }
                
                // 에러 메시지 표시
                document.body.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #ff0000; padding: 20px; text-align: center; font-size: 14px;">' + error.message + '</div>';
            }
        </script>
    </body>
    </html>
  `;

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'error') {
        console.error('🗺️ WebView 에러:', data.message);
      } else if (data.type === 'success') {
      }
    } catch (error) {
      console.error('🗺️ 메시지 파싱 에러:', error);
    }
  };

  const handleError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.error('🗺️ WebView 로드 에러:', nativeEvent);
  };

  const handleLoadEnd = () => {
  };

  // memberLocations가 변경될 때 WebView를 다시 렌더링하기 위한 키
  const webViewKey = `map-${memberLocations.length}-${JSON.stringify(memberLocations.map(m => m.userId))}`;

  return (
    <View style={styles.container}>
      <WebView
        key={webViewKey}  // memberLocations 변경 시 WebView 재생성
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        onMessage={handleMessage}
        onError={handleError}
        onLoadEnd={handleLoadEnd}
        renderLoading={() => (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
          </View>
        )}
        renderError={(errorName) => (
          <View style={styles.loadingContainer}>
            <Text style={{ color: '#ff0000', textAlign: 'center', padding: 20 }}>
              지도 로드 실패: {errorName}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});
