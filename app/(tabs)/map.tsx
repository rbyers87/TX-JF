import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { MapPin, Layers, RefreshCw, Satellite } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { LocationData } from '@/types/location';
import { JurisdictionService } from '@/services/jurisdictionService';
import { getCurrentLocation } from '@/services/locationService';
import type { LocationObject } from '@/services/locationService';

// Platform-specific map imports
let MapView: any = null;
let Marker: any = null;
let Polygon: any = null;
let PROVIDER_GOOGLE: any = null;

if (Platform.OS !== 'web') {
  const Maps = require('react-native-maps');
  MapView = Maps.default;
  Marker = Maps.Marker;
  Polygon = Maps.Polygon;
  PROVIDER_GOOGLE = Maps.PROVIDER_GOOGLE;
}

// Sample jurisdiction boundaries (in production, load from TxDOT GIS)
const SAMPLE_BOUNDARIES = [
  {
    id: 'port-arthur',
    name: 'Port Arthur',
    type: 'city',
    color: '#059669',
    coordinates: [
      { latitude: 29.8849, longitude: -93.9396 },
      { latitude: 29.8849, longitude: -93.9100 },
      { latitude: 29.9100, longitude: -93.9100 },
      { latitude: 29.9100, longitude: -93.9396 },
    ],
  },
  {
    id: 'beaumont',
    name: 'Beaumont',
    type: 'city',
    color: '#059669',
    coordinates: [
      { latitude: 30.0600, longitude: -94.1400 },
      { latitude: 30.0600, longitude: -94.0800 },
      { latitude: 30.1200, longitude: -94.0800 },
      { latitude: 30.1200, longitude: -94.1400 },
    ],
  },
  {
    id: 'jefferson-county',
    name: 'Jefferson County',
    type: 'county',
    color: '#7c3aed',
    coordinates: [
      { latitude: 29.8000, longitude: -94.2000 },
      { latitude: 29.8000, longitude: -93.8000 },
      { latitude: 30.2000, longitude: -93.8000 },
      { latitude: 30.2000, longitude: -94.2000 },
    ],
  },
];

export default function MapScreen() {
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [boundaries, setBoundaries] = useState(SAMPLE_BOUNDARIES);
  const [loading, setLoading] = useState(false);
  const [showBoundaries, setShowBoundaries] = useState(true);
  const [mapType, setMapType] = useState<'standard' | 'satellite'>('standard');
  const [showInfo, setShowInfo] = useState(false);
  const mapRef = useRef<any>(null);

  const initialRegion = {
    latitude: 30.0,
    longitude: -94.0,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  };

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

      if (mapRef.current && Platform.OS !== 'web') {
        mapRef.current.animateToRegion({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }, 1000);
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to get current location.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onMapPress = async (event: any) => {
    const coordinate = Platform.OS === 'web' 
      ? event.latlng 
      : event.nativeEvent.coordinate;
    
    const { latitude, longitude } = coordinate;
    
    try {
      const jurisdictionData = await JurisdictionService.getJurisdictionByCoordinates(
        latitude, 
        longitude
      );
      setLocationData(jurisdictionData);
      setLocation({
        coords: { 
          latitude, 
          longitude, 
          accuracy: 0, 
          altitude: null, 
          altitudeAccuracy: null, 
          heading: null, 
          speed: null 
        },
        timestamp: Date.now(),
      });
      setShowInfo(true);
    } catch {
      Alert.alert('Error', 'Failed to get jurisdiction information.');
    }
  };

  useEffect(() => {
    loadLocation();
  }, []);

  // Web version using react-leaflet
  if (Platform.OS === 'web') {
    const { MapContainer, TileLayer, Marker, Polygon, Popup, useMapEvents } = require('react-leaflet');
    
    function LocationUpdater() {
      useMapEvents({
        click: onMapPress,
      });
      return null;
    }

    return (
      <View style={styles.container}>
        <MapContainer
          center={location ? [location.coords.latitude, location.coords.longitude] : [30.0, -94.0]}
          zoom={10}
          style={{ width: '100%', height: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {location && (
            <Marker position={[location.coords.latitude, location.coords.longitude]}>
              <Popup>
                {locationData ? `${locationData.primaryAgency.name}` : 'Loading...'}
              </Popup>
            </Marker>
          )}

          {showBoundaries && boundaries.map(b => (
            <Polygon
              key={b.id}
              positions={b.coordinates.map(c => [c.latitude, c.longitude])}
              pathOptions={{ 
                color: b.color, 
                fillOpacity: 0.2,
                weight: 2 
              }}
            />
          ))}

          <LocationUpdater />
        </MapContainer>

        <View style={styles.controlsContainer}>
          <TouchableOpacity 
            style={styles.controlButton} 
            onPress={loadLocation} 
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <MapPin size={20} color="#fff" />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.controlButton, showBoundaries && styles.controlButtonActive]} 
            onPress={() => setShowBoundaries(!showBoundaries)}
          >
            <Layers size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {showInfo && locationData && (
          <View style={styles.infoOverlay}>
            <View style={styles.infoCard}>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowInfo(false)}
              >
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
              <Text style={styles.infoTitle}>{locationData.primaryAgency.name}</Text>
              <Text style={styles.infoSubtitle}>{locationData.primaryAgency.type}</Text>
              {locationData.primaryAgency.phone && (
                <Text style={styles.infoPhone}>{locationData.primaryAgency.phone}</Text>
              )}
            </View>
          </View>
        )}
      </View>
    );
  }

  // Native version using react-native-maps
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
        showsMyLocationButton={false}
      >
        {location && (
          <Marker
            coordinate={{ 
              latitude: location.coords.latitude, 
              longitude: location.coords.longitude 
            }}
            title="Selected Location"
            description={locationData ? `${locationData.primaryAgency.name}` : 'Loading...'}
            pinColor="#1e40af"
          />
        )}
        
        {showBoundaries && boundaries.map((boundary) => (
          <Polygon
            key={boundary.id}
            coordinates={boundary.coordinates}
            fillColor={`${boundary.color}20`}
            strokeColor={boundary.color}
            strokeWidth={2}
          />
        ))}
      </MapView>

      <View style={styles.controlsContainer}>
        <TouchableOpacity 
          style={styles.controlButton} 
          onPress={loadLocation} 
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <MapPin size={20} color="#fff" />
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.controlButton, showBoundaries && styles.controlButtonActive]} 
          onPress={() => setShowBoundaries(!showBoundaries)}
        >
          <Layers size={20} color="#fff" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.controlButton} 
          onPress={() => setMapType(mapType === 'standard' ? 'satellite' : 'standard')}
        >
          <Satellite size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {showInfo && locationData && (
        <View style={styles.infoOverlay}>
          <View style={styles.infoCard}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowInfo(false)}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
            <Text style={styles.infoTitle}>{locationData.primaryAgency.name}</Text>
            <Text style={styles.infoSubtitle}>{locationData.primaryAgency.type}</Text>
            {locationData.city && (
              <Text style={styles.infoLocation}>
                {locationData.city.name}, {locationData.county.name}
              </Text>
            )}
            {!locationData.city && (
              <Text style={styles.infoLocation}>{locationData.county.name}</Text>
            )}
            {locationData.primaryAgency.phone && (
              <Text style={styles.infoPhone}>{locationData.primaryAgency.phone}</Text>
            )}
          </View>
        </View>
      )}

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
    alignItems: 'center',
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    maxWidth: 300,
    width: '100%',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#6b7280',
    fontWeight: 'bold',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
    paddingRight: 20,
  },
  infoSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  infoLocation: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 8,
  },
  infoPhone: {
    fontSize: 14,
    color: '#1e40af',
    fontWeight: '600',
  },
  instructionsOverlay: {
    position: 'absolute',
    top: 60,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  instructionsText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  },
});