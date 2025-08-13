import React, { useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Layers, RefreshCw } from 'lucide-react-native';
import { getCurrentLocation } from '@/services/locationService';

export default function MapScreen() {
  const mapRef = useRef<L.Map | null>(null);
  const [loading, setLoading] = useState(false);
  const [mapType, setMapType] = useState<'standard' | 'satellite'>('standard');
  const [showBoundaries, setShowBoundaries] = useState(true);

  const loadLocation = async () => {
    setLoading(true);
    try {
      const location = await getCurrentLocation();
      if (mapRef.current) {
        mapRef.current.setView([location.coords.latitude, location.coords.longitude], 13);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const map = L.map('web-map').setView([31.0, -100.0], 6);
    mapRef.current = map;
    L.tileLayer(
      mapType === 'satellite'
        ? 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      { maxZoom: 19 }
    ).addTo(map);
    loadLocation();
  }, [mapType]);

  return (
    <View style={styles.container}>
      <div id="web-map" style={{ height: '100%', width: '100%' }} />
      <View style={styles.controls}>
        <TouchableOpacity style={styles.btn} onPress={loadLocation}>
          {loading ? <ActivityIndicator color="#fff" /> : <MapPin color="#fff" />}
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={() => setShowBoundaries(!showBoundaries)}>
          <Layers color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={() => setMapType(mapType === 'standard' ? 'satellite' : 'standard')}>
          <RefreshCw color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  controls: { position: 'absolute', top: 60, right: 20, gap: 12 },
  btn: { backgroundColor: '#1e40af', padding: 10, borderRadius: 24 },
});
