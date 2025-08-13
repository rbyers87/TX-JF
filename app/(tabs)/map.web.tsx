// app/tabs/map.web.tsx
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polygon, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { JurisdictionService } from '@/services/jurisdictionService';
import { getCurrentLocation } from '@/services/locationService';
import type { LocationObject } from '@/services/locationService';
import type { LocationData } from '@/types/location';
import L from 'leaflet';

// Fix default marker icon for Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

export default function MapWeb() {
  const [location, setLocation] = useState<[number, number] | null>(null);
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [boundaries, setBoundaries] = useState<any[]>([]);

  const initialCenter: [number, number] = [31.0, -100.0];

  // Load current location
  const loadLocation = async () => {
    try {
      const currentLocation: LocationObject = await getCurrentLocation();
      const coords: [number, number] = [
        currentLocation.coords.latitude,
        currentLocation.coords.longitude,
      ];
      setLocation(coords);

      const jurisdiction = await JurisdictionService.getJurisdictionByCoordinates(
        coords[0],
        coords[1]
      );
      setLocationData(jurisdiction);

      loadJurisdictionBoundaries();
    } catch (err) {
      console.error('Failed to load location', err);
    }
  };

  // Example static boundaries; replace with your service call if needed
  const loadJurisdictionBoundaries = () => {
    const data = [
      {
        id: 1,
        color: '#1e40af',
        coordinates: [
          { latitude: 31.0, longitude: -100.0 },
          { latitude: 31.2, longitude: -100.0 },
          { latitude: 31.2, longitude: -100.2 },
          { latitude: 31.0, longitude: -100.2 },
        ],
      },
      {
        id: 2,
        color: '#059669',
        coordinates: [
          { latitude: 31.1, longitude: -100.1 },
          { latitude: 31.3, longitude: -100.1 },
          { latitude: 31.3, longitude: -100.3 },
          { latitude: 31.1, longitude: -100.3 },
        ],
      },
    ];
    // Convert coordinates for Leaflet
    const converted = data.map(b => ({
      ...b,
      coordinates: b.coordinates.map(c => [c.latitude, c.longitude] as [number, number]),
    }));
    setBoundaries(converted);
  };

  // Marker click handler (updates location & jurisdiction)
  function LocationUpdater() {
    useMapEvents({
      click: async (e) => {
        const { lat, lng } = e.latlng;
        setLocation([lat, lng]);
        try {
          const jurisdiction = await JurisdictionService.getJurisdictionByCoordinates(lat, lng);
          setLocationData(jurisdiction);
        } catch {
          console.error('Failed to fetch jurisdiction for clicked location');
        }
      },
    });
    return null;
  }

  useEffect(() => {
    loadLocation();
  }, []);

  return (
    <MapContainer
      center={location || initialCenter}
      zoom={8}
      style={{ width: '100%', height: '100vh' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {location && (
        <Marker position={location}>
          <Popup>
            {locationData ? `${locationData.primaryAgency.name} Jurisdiction` : 'Loading...'}
          </Popup>
        </Marker>
      )}

      {boundaries.map(b => (
        <Polygon
          key={b.id}
          positions={b.coordinates}
          pathOptions={{ color: b.color, fillOpacity: 0.2 }}
        />
      ))}

      <LocationUpdater />
    </MapContainer>
  );
}
