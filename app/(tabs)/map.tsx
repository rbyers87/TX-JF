import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker, Polygon, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { MapPin, Layers, RefreshCw, Info } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { LocationData } from '@/types/location';
import { JurisdictionService } from '@/services/jurisdictionService';

interface JurisdictionBoundary {
  id: string;
  name: string;
  type: 'city' | 'county';
  coordinates: Array<{ latitude: number; longitude: number }>;
  color: string;
}

export default function MapScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [boundaries, setBoundaries] = useState<JurisdictionBoundary[]>([]);
  const [loading, setLoading] = useState(false);
  const [showBoundaries, setShowBoundaries] = useState(true);
  const [mapType, setMapType] = useState<'standard' | 'satellite'>('standard');
  const mapRef = useRef<MapView>(null);

  // Texas region - centered on the state
  const initialRegion = {
    latitude: 31.0,
    longitude: -100.0,
    latitudeDelta: 8.0,
    longitudeDelta: 8.0,
  };

  const getCurrentLocation = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Location permission is needed to show your position on the map.');
        setLoading(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setLocation(currentLocation);

      // Get jurisdiction data
      const jurisdictionData = await JurisdictionService.getJurisdictionByCoordinates(
        currentLocation.coords.latitude,
        currentLocation.coords.longitude
      );

      setLocationData(jurisdictionData);

      // Center map on user location
      if (mapRef.current) {
        mapRef.current.animateToRegion({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }, 1000);
      }

      // Load boundaries for the area
      await loadJurisdictionBoundaries(currentLocation.coords.latitude, currentLocation.coords.longitude);
    } catch (error) {
      Alert.alert('Error', 'Failed to get current location.');
      console.error('Location error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadJurisdictionBoundaries = async (latitude: number, longitude: number) => {
    try {
      // This is a simplified implementation - in a real app, you'd fetch actual boundary data
      // For now, we'll create sample boundaries around major Texas cities
      const sampleBoundaries: JurisdictionBoundary[] = [
        // Port Arthur city boundary (approximate)
        {
          id: 'port-arthur',
          name: 'Port Arthur',
          type: 'city',
          color: '#059669',
          coordinates: [
            { latitude: 29.9000, longitude: -93.9500 },
            { latitude: 29.9000, longitude: -93.9000 },
            { latitude: 29.8700, longitude: -93.9000 },
            { latitude: 29.8700, longitude: -93.9500 },
          ],
        },
        // Beaumont city boundary (approximate)
        {
          id: 'beaumont',
          name: 'Beaumont',
          type: 'city',
          color: '#0891b2',
          coordinates: [
            { latitude: 30.1000, longitude: -94.1500 },
            { latitude: 30.1000, longitude: -94.0500 },
            { latitude: 30.0500, longitude: -94.0500 },
            { latitude: 30.0500, longitude: -94.1500 },
          ],
        },
        // Jefferson County boundary (very approximate)
        {
          id: 'jefferson-county',
          name: 'Jefferson County',
          type: 'county',
          color: '#7c3aed',
          coordinates: [
            { latitude: 30.2000, longitude: -94.3000 },
            { latitude: 30.2000, longitude: -93.7000 },
            { latitude: 29.7000, longitude: -93.7000 },
            { latitude: 29.7000, longitude: -94.3000 },
          ],
        },
      ];

      setBoundaries(sampleBoundaries);
    } catch (error) {
      console.error('Error loading boundaries:', error);
    }
  };

  const onMapPress = async (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    
    try {
      const jurisdictionData = await JurisdictionService.getJurisdictionByCoordinates(latitude, longitude);
      setLocationData(jurisdictionData);
      
      // Add a temporary marker at the tapped location
      setLocation({
        coords: { latitude, longitude, accuracy: 0, altitude: null, altitudeAccuracy: null, heading: null, speed: null },
        timestamp: Date.now(),
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to get jurisdiction information for this location.');
    }
  };

  const toggleBoundaries = () => {
    setShowBoundaries(!showBoundaries);
  };

  const toggleMapType = () => {
    setMapType(mapType === 'standard' ? 'satellite' : 'standard');
  };

  useEffect(() => {
    getCurrentLocation();
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
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={true}
        showsScale={true}
      >
        {/* User location marker */}
        {location && (
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="Your Location"
            description={locationData ? `${locationData.primaryAgency.name} Jurisdiction` : 'Loading jurisdiction...'}
            pinColor="#1e40af"
          />
        )}

        {/* Jurisdiction boundaries */}
        {showBoundaries && boundaries.map((boundary) => (
          <Polygon
            key={boundary.id}
            coordinates={boundary.coordinates}
            fillColor={`${boundary.color}20`} // 20% opacity
            strokeColor={boundary.color}
            strokeWidth={2}
            tappable={true}
            onPress={() => {
              Alert.alert(
                `${boundary.type === 'city' ? 'City' : 'County'} Boundary`,
                `${boundary.name}\n\nTap anywhere on the map to check jurisdiction for that location.`
              );
            }}
          />
        ))}
      </MapView>

      {/* Control buttons */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={getCurrentLocation}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <MapPin size={20} color="#ffffff" />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, showBoundaries && styles.controlButtonActive]}
          onPress={toggleBoundaries}
        >
          <Layers size={20} color="#ffffff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlButton}
          onPress={toggleMapType}
        >
          <RefreshCw size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Jurisdiction info overlay */}
      {locationData && (
        <View style={styles.infoOverlay}>
          <LinearGradient
            colors={['#ffffff', '#f8fafc']}
            style={styles.infoContainer}
          >
            <View style={styles.infoHeader}>
              <Info size={16} color="#1e40af" />
              <Text style={styles.infoTitle}>Current Jurisdiction</Text>
            </View>
            <Text style={styles.agencyName}>{locationData.primaryAgency.name}</Text>
            <Text style={styles.agencyType}>{locationData.primaryAgency.type}</Text>
            {locationData.city && (
              <Text style={styles.locationText}>
                {locationData.city.name}, {locationData.county.name}
              </Text>
            )}
            {!locationData.city && (
              <Text style={styles.locationText}>{locationData.county.name}</Text>
            )}
          </LinearGradient>
        </View>
      )}

      {/* Instructions overlay */}
      <View style={styles.instructionsOverlay}>
        <Text style={styles.instructionsText}>
          Tap anywhere on the map to check jurisdiction
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
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
  controlButtonActive: {
    backgroundColor: '#059669',
  },
  infoOverlay: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  infoContainer: {
    padding: 16,
    borderRadius: 12,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e40af',
    marginLeft: 6,
  },
  agencyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  agencyType: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  locationText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  instructionsOverlay: {
    position: 'absolute',
    top: 60,
    left: 20,
    backgroundColor: '#1f2937',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  instructionsText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  },
});