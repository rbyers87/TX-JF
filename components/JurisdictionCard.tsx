import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { Shield, Phone, ExternalLink, Building, MapPin } from 'lucide-react-native';
import { LocationData } from '@/types/location';

interface JurisdictionCardProps {
  jurisdiction: LocationData;
}

export function JurisdictionCard({ jurisdiction }: JurisdictionCardProps) {
  const handlePhoneCall = (phoneNumber: string) => {
    Alert.alert(
      'Call Law Enforcement',
      `Call ${jurisdiction.primaryAgency.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call',
          onPress: () => Linking.openURL(`tel:${phoneNumber}`),
        },
      ]
    );
  };

  const handleWebsiteOpen = (website: string) => {
    Linking.openURL(website);
  };

  const getJurisdictionBadgeColor = () => {
    return jurisdiction.jurisdiction === 'city' ? '#059669' : '#7c3aed';
  };

  const getJurisdictionIcon = () => {
    return jurisdiction.jurisdiction === 'city' ? Building : Shield;
  };

  const JurisdictionIcon = getJurisdictionIcon();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.badge, { backgroundColor: getJurisdictionBadgeColor() }]}>
          <JurisdictionIcon size={20} color="#ffffff" />
          <Text style={styles.badgeText}>
            {jurisdiction.jurisdiction === 'city' ? 'City' : 'County'} Jurisdiction
          </Text>
        </View>
      </View>

      <View style={styles.agencyContainer}>
        <View style={styles.agencyHeader}>
          <Shield size={24} color="#1e40af" />
          <Text style={styles.agencyName}>{jurisdiction.primaryAgency.name}</Text>
        </View>
        <Text style={styles.agencyType}>{jurisdiction.primaryAgency.type}</Text>

        {jurisdiction.city && (
          <View style={styles.locationContainer}>
            <MapPin size={16} color="#6b7280" />
            <Text style={styles.locationText}>
              {jurisdiction.city.name}, {jurisdiction.county.name}
            </Text>
          </View>
        )}

        {!jurisdiction.city && (
          <View style={styles.locationContainer}>
            <MapPin size={16} color="#6b7280" />
            <Text style={styles.locationText}>
              {jurisdiction.county.name}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.contactContainer}>
        <Text style={styles.contactHeader}>Contact Information</Text>
        
        {jurisdiction.primaryAgency.phone && (
          <TouchableOpacity
            style={styles.contactButton}
            onPress={() => handlePhoneCall(jurisdiction.primaryAgency.phone!)}
          >
            <Phone size={20} color="#ffffff" />
            <Text style={styles.contactButtonText}>
              {jurisdiction.primaryAgency.phone}
            </Text>
          </TouchableOpacity>
        )}

        {jurisdiction.primaryAgency.website && (
          <TouchableOpacity
            style={styles.websiteButton}
            onPress={() => handleWebsiteOpen(jurisdiction.primaryAgency.website!)}
          >
            <ExternalLink size={18} color="#1e40af" />
            <Text style={styles.websiteButtonText}>Visit Website</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.disclaimerContainer}>
        <Text style={styles.disclaimerText}>
          Non-emergency reporting line. For emergencies, dial 911.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  agencyContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  agencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  agencyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginLeft: 8,
    flex: 1,
  },
  agencyType: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 32,
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    color: '#4b5563',
    marginLeft: 6,
  },
  contactContainer: {
    padding: 16,
  },
  contactHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  contactButton: {
    backgroundColor: '#1e40af',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  contactButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  websiteButton: {
    backgroundColor: '#f3f4f6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  websiteButtonText: {
    color: '#1e40af',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  disclaimerContainer: {
    padding: 16,
    backgroundColor: '#fef3f2',
  },
  disclaimerText: {
    fontSize: 12,
    color: '#991b1b',
    textAlign: 'center',
    fontWeight: '500',
  },
});