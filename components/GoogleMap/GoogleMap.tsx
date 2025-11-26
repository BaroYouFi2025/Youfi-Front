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

  const defaultRegion: Region = {
    latitude: currentLocation?.latitude || 37.5665,
    longitude: currentLocation?.longitude || 126.9780,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  useEffect(() => {
    if (currentLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);
    }
  }, [currentLocation]);

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
