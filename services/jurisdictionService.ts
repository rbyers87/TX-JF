import { LocationData, CityData, CountyData } from '@/types/location';

// Texas Counties with Sheriff contact information
const TEXAS_COUNTIES: Record<string, CountyData> = {
  'jefferson': {
    name: 'Jefferson County',
    sheriffPhone: '(409) 835-8411',
    sheriffWebsite: 'https://www.co.jefferson.tx.us/sheriff',
  },
  'harris': {
    name: 'Harris County',
    sheriffPhone: '(713) 755-7628',
    sheriffWebsite: 'https://www.hcso.org',
  },
  'dallas': {
    name: 'Dallas County',
    sheriffPhone: '(214) 749-8641',
    sheriffWebsite: 'https://www.dallascounty.org/departments/sheriff',
  },
  'tarrant': {
    name: 'Tarrant County',
    sheriffPhone: '(817) 884-1213',
    sheriffWebsite: 'https://www.tarrantcounty.com/en/sheriff',
  },
  'bexar': {
    name: 'Bexar County',
    sheriffPhone: '(210) 335-6000',
    sheriffWebsite: 'https://www.bexar.org/1250/Sheriffs-Office',
  },
  'travis': {
    name: 'Travis County',
    sheriffPhone: '(512) 854-9770',
    sheriffWebsite: 'https://www.tcso.org',
  },
  'collin': {
    name: 'Collin County',
    sheriffPhone: '(972) 547-5100',
    sheriffWebsite: 'https://www.collincountytx.gov/sheriff',
  },
  'denton': {
    name: 'Denton County',
    sheriffPhone: '(940) 349-1600',
    sheriffWebsite: 'https://www.dentoncounty.gov/Departments/Sheriff',
  },
  'fort_bend': {
    name: 'Fort Bend County',
    sheriffPhone: '(281) 341-4665',
    sheriffWebsite: 'https://www.fbcso.org',
  },
  'williamson': {
    name: 'Williamson County',
    sheriffPhone: '(512) 943-1300',
    sheriffWebsite: 'https://www.wilco.org/Departments/Sheriff',
  },
  'hidalgo': {
    name: 'Hidalgo County',
    sheriffPhone: '(956) 383-8114',
    sheriffWebsite: 'https://www.hidalgocounty.us/269/Sheriffs-Office',
  },
};

// Major Texas Cities with Police Department contact information
const TEXAS_CITIES: Record<string, CityData> = {
  'port arthur': {
    name: 'Port Arthur',
    county: 'Jefferson County',
    policePhone: '(409) 983-8600',
    policeWebsite: 'https://www.portarthurtx.gov/departments/police',
  },
  'houston': {
    name: 'Houston',
    county: 'Harris County',
    policePhone: '(713) 884-3131',
    policeWebsite: 'https://www.houstontx.gov/police',
  },
  'san antonio': {
    name: 'San Antonio',
    county: 'Bexar County',
    policePhone: '(210) 207-7273',
    policeWebsite: 'https://www.sanantonio.gov/SAPD',
  },
  'dallas': {
    name: 'Dallas',
    county: 'Dallas County',
    policePhone: '(214) 671-4282',
    policeWebsite: 'https://www.dallaspolice.net',
  },
  'austin': {
    name: 'Austin',
    county: 'Travis County',
    policePhone: '(512) 974-5000',
    policeWebsite: 'https://www.austintexas.gov/department/police',
  },
  'fort worth': {
    name: 'Fort Worth',
    county: 'Tarrant County',
    policePhone: '(817) 392-4222',
    policeWebsite: 'https://www.fortworthtexas.gov/departments/police',
  },
  'el paso': {
    name: 'El Paso',
    county: 'El Paso County',
    policePhone: '(915) 212-4400',
    policeWebsite: 'https://www.elpasotexas.gov/police',
  },
  'arlington': {
    name: 'Arlington',
    county: 'Tarrant County',
    policePhone: '(817) 459-5700',
    policeWebsite: 'https://www.arlingtontx.gov/city_hall/departments/police',
  },
  'corpus christi': {
    name: 'Corpus Christi',
    county: 'Nueces County',
    policePhone: '(361) 886-2600',
    policeWebsite: 'https://www.cctexas.com/departments/police',
  },
  'plano': {
    name: 'Plano',
    county: 'Collin County',
    policePhone: '(972) 424-5678',
    policeWebsite: 'https://www.plano.gov/1183/Police',
  },
  'lubbock': {
    name: 'Lubbock',
    county: 'Lubbock County',
    policePhone: '(806) 775-2865',
    policeWebsite: 'https://www.mylubbock.us/departments/police',
  },
  'beaumont': {
    name: 'Beaumont',
    county: 'Jefferson County',
    policePhone: '(409) 832-1234',
    policeWebsite: 'https://www.beaumonttexas.gov/departments/police',
  },
};

interface GISFeature {
  attributes: {
    [key: string]: any;
  };
  geometry: {
    rings?: number[][][];
    paths?: number[][][];
  };
}

interface GISResponse {
  features: GISFeature[];
}

export class JurisdictionService {
  private static readonly TXDOT_CITIES_URL = 'https://services.arcgis.com/KTcxiTD9dsQw4r7Z/arcgis/rest/services/Texas_Cities/FeatureServer/0/query';
  private static readonly TXDOT_COUNTIES_URL = 'https://services.arcgis.com/KTcxiTD9dsQw4r7Z/arcgis/rest/services/Texas_County_Boundaries/FeatureServer/0/query';

  static async getJurisdictionByCoordinates(
    latitude: number,
    longitude: number
  ): Promise<LocationData> {
    try {
      // First check if location is within any city boundaries
      const cityResult = await this.findCityByGIS(latitude, longitude);
      
      // Always get county information
      const countyResult = await this.findCountyByGIS(latitude, longitude);

      const county = countyResult || {
        name: 'Texas',
        sheriffPhone: '(512) 463-2000',
        sheriffWebsite: 'https://www.dps.texas.gov',
      };

      if (cityResult) {
        // City has jurisdiction - police department takes precedence
        return {
          coordinates: { latitude, longitude },
          city: cityResult,
          county,
          jurisdiction: 'city',
          primaryAgency: {
            name: `${cityResult.name} Police Department`,
            type: 'Police Department',
            phone: cityResult.policePhone,
            website: cityResult.policeWebsite,
          },
        };
      } else {
        // County has jurisdiction - sheriff's office
        return {
          coordinates: { latitude, longitude },
          county,
          jurisdiction: 'county',
          primaryAgency: {
            name: `${county.name} Sheriff's Office`,
            type: 'Sheriff\'s Office',
            phone: county.sheriffPhone,
            website: county.sheriffWebsite,
          },
        };
      }
    } catch (error) {
      console.error('Error getting jurisdiction:', error);
      throw new Error('Failed to determine jurisdiction');
    }
  }

  private static async findCityByGIS(
    latitude: number,
    longitude: number
  ): Promise<CityData | null> {
    try {
      console.log(`Querying city boundaries for coordinates: ${latitude}, ${longitude}`);
      
      const params = new URLSearchParams({
        f: 'json',
        geometry: `${longitude},${latitude}`,
        geometryType: 'esriGeometryPoint',
        inSR: '4326',
        spatialRel: 'esriSpatialRelWithin',
        outFields: '*',
        returnGeometry: 'false',
        where: '1=1',
      });

      const response = await fetch(`${this.TXDOT_CITIES_URL}?${params}`);
      
      if (!response.ok) {
        console.error('City GIS API response not OK:', response.status, response.statusText);
        throw new Error('Failed to query city boundaries');
      }

      const data: GISResponse = await response.json();
      console.log('City GIS Response:', JSON.stringify(data, null, 2));

      if (data.features && data.features.length > 0) {
        const feature = data.features[0];
        console.log('City feature attributes:', feature.attributes);
        
        // Try different possible field names for city
        const cityName = feature.attributes.CITY_NM || 
                        feature.attributes.NAME || 
                        feature.attributes.CITY_NAME ||
                        feature.attributes.City ||
                        feature.attributes.CITYNAME;
        
        const countyName = feature.attributes.CNTY_NM || 
                          feature.attributes.COUNTY || 
                          feature.attributes.COUNTY_NAME ||
                          feature.attributes.County;

        console.log(`Found city: ${cityName}, county: ${countyName}`);

        if (cityName) {
          // Look up city data from our database
          const cityKey = cityName.toLowerCase();
          const cityData = TEXAS_CITIES[cityKey];

          if (cityData) {
            return cityData;
          } else {
            // Return basic city info if not in our database
            return {
              name: cityName,
              county: countyName || 'Unknown County',
              policePhone: undefined,
              policeWebsite: undefined,
            };
          }
        }
      }

      return null;
    } catch (error) {
      console.error('Error querying city boundaries:', error);
      return null;
    }
  }

  private static async findCountyByGIS(
    latitude: number,
    longitude: number
  ): Promise<CountyData | null> {
    try {
      console.log(`Querying county boundaries for coordinates: ${latitude}, ${longitude}`);
      
      const params = new URLSearchParams({
        f: 'json',
        geometry: `${longitude},${latitude}`,
        geometryType: 'esriGeometryPoint',
        inSR: '4326',
        spatialRel: 'esriSpatialRelWithin',
        outFields: '*',
        returnGeometry: 'false',
        where: '1=1',
      });

      const response = await fetch(`${this.TXDOT_COUNTIES_URL}?${params}`);
      
      if (!response.ok) {
        console.error('County GIS API response not OK:', response.status, response.statusText);
        throw new Error('Failed to query county boundaries');
      }

      const data: GISResponse = await response.json();
      console.log('County GIS Response:', JSON.stringify(data, null, 2));

      if (data.features && data.features.length > 0) {
        const feature = data.features[0];
        console.log('County feature attributes:', feature.attributes);
        
        // Try different possible field names for county
        const countyName = feature.attributes.CNTY_NM || 
                          feature.attributes.NAME || 
                          feature.attributes.COUNTY_NAME ||
                          feature.attributes.County ||
                          feature.attributes.COUNTYNAME;

        console.log(`Found county: ${countyName}`);

        if (countyName) {
          // Look up county data from our database
          const countyKey = countyName.toLowerCase().replace(' county', '').replace(' ', '_');
          const countyData = TEXAS_COUNTIES[countyKey];

          if (countyData) {
            return countyData;
          } else {
            // Return basic county info if not in our database
            return {
              name: countyName,
              sheriffPhone: undefined,
              sheriffWebsite: undefined,
            };
          }
        }
      }

      return null;
    } catch (error) {
      console.error('Error querying county boundaries:', error);
      // Fallback to Texas DPS
      return {
        name: 'Texas',
        sheriffPhone: '(512) 463-2000',
        sheriffWebsite: 'https://www.dps.texas.gov',
      };
    }
  }
}