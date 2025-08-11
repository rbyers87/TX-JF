import { GeocodingResult } from '@/types/location';

export class GeocodingService {
  private static readonly NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';

  static async geocodeAddress(address: string): Promise<GeocodingResult | null> {
    try {
      // Add Texas to the search query if not already specified
      const searchQuery = address.toLowerCase().includes('texas') || address.toLowerCase().includes('tx') 
        ? address 
        : `${address}, Texas`;

      const response = await fetch(
        `${this.NOMINATIM_BASE_URL}/search?format=json&q=${encodeURIComponent(searchQuery)}&countrycodes=us&limit=1&addressdetails=1`
      );

      if (!response.ok) {
        throw new Error('Geocoding service unavailable');
      }

      const data = await response.json();

      if (data.length === 0) {
        return null;
      }

      const result = data[0];
      
      // Ensure the result is in Texas
      const isInTexas = result.display_name.toLowerCase().includes('texas') || 
                       result.display_name.toLowerCase().includes(', tx');

      if (!isInTexas) {
        return null;
      }

      return {
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
        address: result.display_name,
      };
    } catch (error) {
      console.error('Geocoding error:', error);
      throw new Error('Failed to geocode address');
    }
  }

  static async reverseGeocode(latitude: number, longitude: number): Promise<string | null> {
    try {
      const response = await fetch(
        `${this.NOMINATIM_BASE_URL}/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
      );

      if (!response.ok) {
        throw new Error('Reverse geocoding service unavailable');
      }

      const data = await response.json();
      return data.display_name || null;
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return null;
    }
  }
}