import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Platform } from 'react-native';
import { MapPin, Layers, RefreshCw } from 'lucide-react-native';
import { LocationData } from '@/types/location';
import { JurisdictionService } from '@/services/jurisdictionService';
import { getCurrentLocation } from '@/services/locationService';
import type { LocationObject } from '@/services/locationService';

// For web maps (Leaflet)
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

export default function MapScreen() {
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [boundaries, setBoundaries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showBoundaries, setShowBoundaries] = useState(true);
  const [mapType, setMapType] = useState<'standard' | 'satellite'>('standard');
  const mapRef = useRef<any>(null); // Will be MapView (native) or Leaflet map (web)

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

      if (Platform.OS !== 'web' && mapRef.current) {
        mapRef.current.animateToRegion({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }, 1000);
      } else if (Platform.OS === 'web' && mapRef.current) {
        mapRef.current.setView([currentLocation.coords.latitude, currentLocation.coords.longitude], 13);
      }

      await loadJurisdictionBoundaries();
    } catch (err) {
      Alert.alert('Error', 'Failed to get current location.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadJurisdictionBoundaries = async () => {
    setBoundaries([
      /* static boundaries here if needed */
    ]);
  };

  const onMapPress = async (lat: number, lng: number) => {
    try {
      const jurisdictionData = await JurisdictionService.getJurisdictionByCoordinates(lat, lng);
      setLocationData(jurisdictionData);
      setLocation({
        coords: { latitude: lat, longitude: lng, accuracy: 0, altitude: null, altitudeAccuracy: null, heading: null, speed: null },
        timestamp: Date.now(),
      });
    } catch {
      Alert.alert('Error', 'Failed to get jurisdiction information.');
    }
  };

  useEffect(() => {
    if (Platform.OS === 'web') {
      // Setup Leaflet map
      const map = L.map('web-map').setView([initialRegion.latitude, initialRegion.longitude], 6);
      mapRef.current = map;

      L.tileLayer(
        mapType === 'satellite'
          ? 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
          : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        { maxZoom: 19 }
      ).addTo(map);

      map.on('click', (e: any) => {
        onMapPress(e.latlng.lat, e.latlng.lng);
      });
    }
    loadLocation();
  }, [mapType]);

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <div id="web-map" style={{ height: '100%', width: '100%' }} />
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

  // Native map version
  const MapView = require('react-native-maps').default;
  const { Marker, Polygon, PROVIDER_GOOGLE } = require('react-native-maps');

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        mapType={mapType}
        initialRegion={initialRegion}
        onPress={(e: any) => {
          const { latitude, longitude } = e.nativeEvent.coordinate;
          onMapPress(latitude, longitude);
        }}
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
  controlsContainer: {
    position: 'absolute',
    top: 60,
    right: 20,
    flexDirection: 'column',
    gap: 12,
  },
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
