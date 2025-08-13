import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { MapContainer, TileLayer, Marker, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { JurisdictionService } from '@/services/jurisdictionService';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function MapScreenWeb() {
  const [location, setLocation] = useState<[number, number] | null>(null);
  const [boundaries, setBoundaries] = useState<any[]>([]);

  const loadLocation = async () => {
    try {
      const pos = await new Promise<GeolocationPosition>((res, rej) =>
        navigator.geolocation.getCurrentPosition(res, rej)
      );
      setLocation([pos.coords.latitude, pos.coords.longitude]);
    } catch {
      console.warn('Failed to get browser location');
    }

    // Load boundaries (static or via service)
    setBoundaries([
      // ...your boundary data
    ]);
  };

  useEffect(() => {
    loadLocation();
  }, []);

  return (
    <View style={styles.container}>
      <MapContainer center={location || [31.0, -100.0]} zoom={5} style={styles.map}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {location && <Marker position={location} />}
        {boundaries.map((b) => (
          <Polygon key={b.id} positions={b.coordinates} pathOptions={{ color: b.color }} />
        ))}
      </MapContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { height: '100%', width: '100%' },
});
