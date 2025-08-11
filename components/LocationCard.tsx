import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import { MapPin, Clock } from 'lucide-react-native';
import { GeocodingService } from '@/services/geocodingService';

interface LocationCardProps {
  location: Location.LocationObject;
}

export function LocationCard({ location }: LocationCardProps) {
  const [address, setAddress] = useState<string>('Getting address...');

  useEffect(() => {
    const getAddress = async () => {
      try {
        const addressResult = await GeocodingService.reverseGeocode(
          location.coords.latitude,
          location.coords.longitude
        );
        setAddress(addressResult || 'Address unavailable');
      } catch (error) {
        setAddress('Address unavailable');
      }
    };

    getAddress();
  }, [location]);

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <View style={styles.container}>
      <View style={styles.coordinatesContainer}>
        <Text style={styles.label}>Coordinates:</Text>
        <Text style={styles.coordinates}>
          {location.coords.latitude.toFixed(6)}, {location.coords.longitude.toFixed(6)}
        </Text>
        <Text style={styles.accuracy}>
          Accuracy: ±{Math.round(location.coords.accuracy || 0)}m
        </Text>
      </View>

      <View style={styles.addressContainer}>
        <View style={styles.addressHeader}>
          <MapPin size={16} color="#6b7280" />
          <Text style={styles.addressLabel}>Address</Text>
        </View>
        <Text style={styles.address}>{address}</Text>
      </View>

      <View style={styles.timestampContainer}>
        <Clock size={14} color="#9ca3af" />
        <Text style={styles.timestamp}>
          Updated: {formatTimestamp(location.timestamp)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  coordinatesContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  coordinates: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '600',
    marginTop: 4,
    fontFamily: 'monospace',
  },
  accuracy: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  addressContainer: {
    marginBottom: 12,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  addressLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginLeft: 4,
  },
  address: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  timestampContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timestamp: {
    fontSize: 12,
    color: '#9ca3af',
    marginLeft: 4,
  },
});