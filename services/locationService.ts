import { Platform } from 'react-native';

export type LocationObject = {
  coords: {
    latitude: number;
    longitude: number;
    accuracy?: number | null;
    altitude?: number | null;
    altitudeAccuracy?: number | null;
    heading?: number | null;
    speed?: number | null;
  };
  timestamp: number;
};

export async function getCurrentLocation(highAccuracy: boolean = true): Promise<LocationObject> {
  if (Platform.OS === 'web') {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        return reject(new Error('Geolocation not supported.'));
      }
      navigator.geolocation.getCurrentPosition(
        pos => {
          resolve({
            coords: {
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
              accuracy: pos.coords.accuracy,
              altitude: pos.coords.altitude,
              altitudeAccuracy: pos.coords.altitudeAccuracy,
              heading: pos.coords.heading,
              speed: pos.coords.speed,
            },
            timestamp: pos.timestamp,
          });
        },
        err => reject(err),
        { enableHighAccuracy: highAccuracy }
      );
    });
  } else {
    const Location = await import('expo-location');
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Permission to access location was denied');
    }
    return await Location.getCurrentPositionAsync({
      accuracy: highAccuracy ? Location.Accuracy.High : Location.Accuracy.Balanced,
    });
  }
}
