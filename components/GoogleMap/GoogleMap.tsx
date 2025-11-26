import React, { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';

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
  address?: string;
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

interface GoogleMapProps {
  currentLocation?: Location | null;
  nearbyPersons?: MissingPerson[];
  memberLocations?: MemberLocation[];
}

export default function GoogleMap({
  currentLocation,
  nearbyPersons = [],
  memberLocations = [],
}: GoogleMapProps) {
  const mapRef = useRef<MapView>(null);

  // 실종자 위치가 있으면 실종자 위치를, 없으면 사용자 위치를 기본으로
  const firstMissingPerson = nearbyPersons.length > 0 ? nearbyPersons[0] : null;
  const defaultRegion: Region = {
    latitude: firstMissingPerson?.latitude || currentLocation?.latitude || 37.5665,
    longitude: firstMissingPerson?.longitude || currentLocation?.longitude || 126.9780,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  useEffect(() => {
    // 지도와 마커들이 준비되면 모든 위치를 포함하도록 조정
    if (!mapRef.current) return;

    const coordinates: Array<{ latitude: number; longitude: number }> = [];

    // 실종자 위치 추가
    nearbyPersons.forEach((person) => {
      coordinates.push({
        latitude: person.latitude,
        longitude: person.longitude,
      });
    });

    // 멤버 위치 추가
    memberLocations.forEach((member) => {
      coordinates.push(member.location);
    });

    // 사용자 위치 추가
    if (currentLocation) {
      coordinates.push(currentLocation);
    }

    // 좌표가 2개 이상이면 모두 포함하도록 지도 조정
    if (coordinates.length >= 2) {
      // 약간의 지연을 주어 지도가 완전히 렌더링된 후 실행
      setTimeout(() => {
        mapRef.current?.fitToCoordinates(coordinates, {
          edgePadding: { top: 100, right: 50, bottom: 100, left: 50 },
          animated: true,
        });
      }, 500);
    } else if (coordinates.length === 1) {
      // 좌표가 1개만 있으면 그 위치로 이동
      setTimeout(() => {
        mapRef.current?.animateToRegion({
          ...coordinates[0],
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }, 1000);
      }, 500);
    }
  }, [currentLocation, nearbyPersons, memberLocations]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={defaultRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {/* 근처 실종자 마커 */}
        {nearbyPersons.map((person, index) => {
          const key = person.id ?? `person-${index}`;
          return (
            <Marker
              key={key}
              coordinate={{
                latitude: person.latitude,
                longitude: person.longitude,
              }}
              title={person.name}
              description={person.address}
              pinColor="red"
            />
          );
        })}

        {/* 멤버 위치 마커 */}
        {memberLocations.map((member, index) => (
          <Marker
            key={`member-${index}`}
            coordinate={{
              latitude: member.location.latitude,
              longitude: member.location.longitude,
            }}
            title={`${member.name} (${member.relationship})`}
            description={`배터리: ${member.batteryLevel}%`}
            pinColor="green"
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
