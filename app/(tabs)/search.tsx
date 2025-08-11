import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { Search, MapPin, TriangleAlert as AlertTriangle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { LocationData } from '@/types/location';
import { JurisdictionService } from '@/services/jurisdictionService';
import { GeocodingService } from '@/services/geocodingService';
import { JurisdictionCard } from '@/components/JurisdictionCard';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [searchedAddress, setSearchedAddress] = useState<string>('');

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter an address to search.');
      return;
    }

    setLoading(true);
    setError(null);
    Keyboard.dismiss();

    try {
      // Geocode the address to get coordinates
      const coordinates = await GeocodingService.geocodeAddress(searchQuery.trim());
      
      if (!coordinates) {
        setError('Address not found. Please check the address and try again.');
        setLoading(false);
        return;
      }

      // Get jurisdiction data for the coordinates
      const jurisdictionData = await JurisdictionService.getJurisdictionByCoordinates(
        coordinates.latitude,
        coordinates.longitude
      );

      setLocationData(jurisdictionData);
      setSearchedAddress(searchQuery.trim());
    } catch (err) {
      setError('Failed to find jurisdiction for this address. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setLocationData(null);
    setSearchedAddress('');
    setError(null);
  };

  return (
    <LinearGradient
      colors={['#1e40af', '#3b82f6']}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Search Address</Text>
          <Text style={styles.subtitle}>Find jurisdiction for any Texas location</Text>
        </View>

        <View style={styles.searchCard}>
          <View style={styles.searchHeader}>
            <Search size={20} color="#6b7280" />
            <Text style={styles.searchTitle}>Enter Texas Address</Text>
          </View>

          <TextInput
            style={styles.searchInput}
            placeholder="e.g., 123 Main St, Austin, TX"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            autoCapitalize="words"
            autoCorrect={false}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.searchButton, loading && styles.searchButtonDisabled]}
              onPress={handleSearch}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Search size={18} color="#ffffff" />
              )}
              <Text style={styles.searchButtonText}>
                {loading ? 'Searching...' : 'Find Jurisdiction'}
              </Text>
            </TouchableOpacity>

            {(locationData || error) && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={clearSearch}
              >
                <Text style={styles.clearButtonText}>Clear</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <AlertTriangle size={20} color="#dc2626" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {locationData && searchedAddress && (
          <View style={styles.resultsCard}>
            <View style={styles.addressHeader}>
              <MapPin size={20} color="#1e40af" />
              <Text style={styles.addressTitle}>Search Results</Text>
            </View>
            
            <View style={styles.addressContainer}>
              <Text style={styles.addressLabel}>Address:</Text>
              <Text style={styles.addressText}>{searchedAddress}</Text>
            </View>

            <JurisdictionCard jurisdiction={locationData} />
          </View>
        )}

        <View style={styles.emergencyNotice}>
          <AlertTriangle size={20} color="#dc2626" />
          <Text style={styles.emergencyText}>
            For immediate emergencies, always dial 911
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#e0f2fe',
    textAlign: 'center',
    marginTop: 8,
  },
  searchCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginLeft: 8,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#f9fafb',
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  searchButton: {
    backgroundColor: '#1e40af',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  searchButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  searchButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  clearButton: {
    backgroundColor: '#6b7280',
    borderRadius: 12,
    padding: 16,
    paddingHorizontal: 24,
  },
  clearButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  errorText: {
    color: '#dc2626',
    marginLeft: 8,
    flex: 1,
    fontSize: 14,
  },
  resultsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  addressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginLeft: 8,
  },
  addressContainer: {
    marginBottom: 20,
    padding: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
  },
  addressLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  addressText: {
    fontSize: 16,
    color: '#1f2937',
    marginTop: 4,
  },
  emergencyNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#dc2626',
  },
  emergencyText: {
    color: '#dc2626',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
});