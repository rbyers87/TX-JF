export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface CityData {
  name: string;
  county: string;
  policePhone?: string;
  policeWebsite?: string;
}

export interface CountyData {
  name: string;
  sheriffPhone?: string;
  sheriffWebsite?: string;
}

export interface LocationData {
  coordinates: Coordinates;
  address?: string;
  city?: CityData;
  county: CountyData;
  jurisdiction: 'city' | 'county';
  primaryAgency: {
    name: string;
    type: 'Police Department' | 'Sheriff\'s Office';
    phone?: string;
    website?: string;
  };
}

export interface GeocodingResult {
  latitude: number;
  longitude: number;
  address: string;
}