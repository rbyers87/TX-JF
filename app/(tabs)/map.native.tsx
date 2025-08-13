import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import MapView, { Marker, Polygon, PROVIDER_GOOGLE } from 'react-native-maps';
import { MapPin, Layers, RefreshCw } from 'lucide-react-native';
import { LocationData } from '@/types/location';
import { JurisdictionService } from '@/services/jurisdictionService';
import { getCurrentLocation } from '@/services/locationService';
import type { LocationObject } from '@/services/locationService';

export default function MapScreen() {
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [boundaries, setBoundaries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showBoundaries, setShowBoundaries] = useState(true);
  const [mapType, setMapType] = useState<'standard' | 'satellite'>('standard');
  const mapRef = useRef<MapView>(null);

  const initialRegion = { latitude: 31.0, longitude: -100.0, latitudeDelta: 8.0, longitudeDelta: 8.0 };

  const loadLocation = async () => {
    setLoading(true);
    try {
      const currentLocation = await getCurrentLocation();
      setLocation(currentLocation);

      const jurisdictionData = await JurisdictionService.getJurisdictionByCoordinates(
        currentLocation.coords.latitude,
        currentLocation.coords.longitude
      );
      setLocationData(jurisdictionData);

      if (mapRef.current) {
        mapRef.current.animateToRegion({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }, 1000);
      }

      // Load static boundaries (or fetch if needed)
      setBoundaries([
        // ...your boundary data
      ]);
    } catch (err) {
      Alert.alert('Error', 'Failed to get current location.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onMapPress = async (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    try {
      const jurisdictionData = await JurisdictionService.getJurisdictionByCoordinates(latitude, longitude);
      setLocationData(jurisdictionData);
      setLocation({
        coords: { latitude, longitude, accuracy: 0, altitude: null, altitudeAccuracy: null, heading: null, speed: null },
        timestamp: Date.now(),
      });
    } catch {
      Alert.alert('Error', 'Failed to get jurisdiction information.');
    }
  };

  useEffect(() => {
    loadLocation();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        mapType={mapType}
        initialRegion={initialRegion}
        onPress={onMapPress}
        showsUserLocation
      >
        {location && (
          <Marker
            coordinate={{ latitude: location.coords.latitude, longitude: location.coords.longitude }}
            title="Your Location"
            description={locationData ? `${locationData.primaryAgency.name} Jurisdiction` : 'Loading...'}
            pinColor="#1e40af"
          />
        )}
        {showBoundaries && boundaries.map((b) => (
          <Polygon key={b.id} coordinates={b.coordinates} fillColor={`${b.color}20`} strokeColor={b.color} strokeWidth={2} />
        ))}
      </MapView>

      <View style={styles.controlsContainer}>
        <TouchableOpacity style={styles.controlButton} onPress={loadLocation} disabled={loading}>
          {loading ? <ActivityIndicator size="small" color="#fff" /> : <MapPin size={20} color="#fff" />}
        </TouchableOpacity>
        <TouchableOpacity style={[styles.controlButton, showBoundaries && styles.controlButtonActive]} onPress={() => setShowBoundaries(!showBoundaries)}>
          <Layers size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={() => setMapType(mapType === 'standard' ? 'satellite' : 'standard')}>
          <RefreshCw size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  controlsContainer: { position: 'absolute', top: 60, right: 20, flexDirection: 'column', gap: 12 },
  controlButton: {
    backgroundColor: '#1e40af',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  controlButtonActive: { backgroundColor: '#059669' },
});
