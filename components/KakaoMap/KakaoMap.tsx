import React, { useRef } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { WebView } from 'react-native-webview';

interface Marker {
  lat: number;
  lng: number;
  title?: string;
}

interface KakaoMapProps {
  latitude: number;
  longitude: number;
  markers?: Marker[];
  zoom?: number;
  style?: any;
}

export default function KakaoMap({
  latitude,
  longitude,
  markers = [],
  zoom = 3,
  style
}: KakaoMapProps) {
  const webViewRef = useRef<WebView>(null);
  const apiKey = process.env.EXPO_PUBLIC_KAKAO_MAP_API_KEY;

  console.log('KakaoMap API Key:', apiKey ? '키 존재' : '키 없음');
  console.log('KakaoMap 좌표:', latitude, longitude);

  if (!apiKey || apiKey === 'your_kakao_javascript_key_here') {
    return (
      <View style={[{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#eaf6ff' }, style]}>
        <ActivityIndicator size="large" color="#25b2e2" />
      </View>
    );
  }

  const markersScript = markers.map((marker, index) => `
    var marker${index} = new kakao.maps.Marker({
      position: new kakao.maps.LatLng(${marker.lat}, ${marker.lng}),
      map: map
    });
    ${marker.title ? `
    var infowindow${index} = new kakao.maps.InfoWindow({
      content: '<div style="padding:5px;font-size:12px;">${marker.title}</div>'
    });
    kakao.maps.event.addListener(marker${index}, 'click', function() {
      infowindow${index}.open(map, marker${index});
    });
    ` : ''}
  `).join('\n');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <meta charset="utf-8">
      <style>
        * { margin: 0; padding: 0; }
        html, body { width: 100%; height: 100%; overflow: hidden; }
        #map { width: 100%; height: 100%; }
        #error { 
          display: none;
          padding: 20px; 
          text-align: center; 
          color: #ff0000;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <div id="error"></div>
      
      <script type="text/javascript" src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}"></script>
      <script>
        function initMap() {
          try {
            console.log('카카오맵 초기화 시작');
            console.log('API Key:', '${apiKey}');
            console.log('좌표:', ${latitude}, ${longitude});
            
            if (typeof kakao === 'undefined') {
              throw new Error('카카오맵 SDK 로드 실패 - kakao 객체 없음');
            }
            
            if (!kakao.maps) {
              throw new Error('카카오맵 SDK 로드 실패 - kakao.maps 없음');
            }
            
            kakao.maps.load(function() {
              console.log('카카오맵 SDK 로드 완료');
              
              var container = document.getElementById('map');
              var options = {
                center: new kakao.maps.LatLng(${latitude}, ${longitude}),
                level: ${zoom}
              };
              var map = new kakao.maps.Map(container, options);
              
              console.log('지도 생성 완료');
              
              // 중심 마커 추가
              var centerMarker = new kakao.maps.Marker({
                position: new kakao.maps.LatLng(${latitude}, ${longitude}),
                map: map
              });
              
              console.log('마커 추가 완료');
              
              // 추가 마커들
              ${markersScript}
              
              // React Native로 성공 메시지 전송
              if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'success' }));
              }
            });
          } catch (error) {
            console.error('카카오맵 에러:', error);
            document.getElementById('map').style.display = 'none';
            var errorDiv = document.getElementById('error');
            errorDiv.style.display = 'block';
            errorDiv.textContent = '지도 로드 실패: ' + error.message;
            
            // React Native로 에러 메시지 전송
            if (window.ReactNativeWebView) {
              window.ReactNativeWebView.postMessage(JSON.stringify({ 
                type: 'error', 
                message: error.message 
              }));
            }
          }
        }
        
        // SDK 로드 대기
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', initMap);
        } else {
          initMap();
        }
      </script>
    </body>
    </html>
  `;

  const handleWebViewMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      console.log('WebView 메시지:', data);
      if (data.type === 'error') {
        console.error('카카오맵 에러:', data.message);
      }
    } catch (error) {
      console.error('메시지 파싱 에러:', error);
    }
  };

  return (
    <View style={[{ flex: 1 }, style]}>
      <WebView
        ref={webViewRef}
        source={{ html }}
        style={{ flex: 1, backgroundColor: 'transparent' }}
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        startInLoadingState={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onMessage={handleWebViewMessage}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error('WebView 에러:', nativeEvent);
        }}
        onHttpError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error('HTTP 에러:', nativeEvent.statusCode, nativeEvent.url);
        }}
        renderLoading={() => (
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: '#eaf6ff' }}>
            <ActivityIndicator size="large" color="#25b2e2" />
          </View>
        )}
      />
    </View>
  );
}
