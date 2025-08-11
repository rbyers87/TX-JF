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
  error?: {
    code: number;
    message: string;
  };
}

export class JurisdictionService {
  // Updated API endpoints - using the correct TxDOT ArcGIS REST services
  private static readonly TXDOT_CITIES_URL = 'https://services.arcgis.com/KTcxiTD9dsQw4r7Z/arcgis/rest/services/TxDOT_City_Boundaries/FeatureServer/0/query';
  private static readonly TXDOT_COUNTIES_URL = 'https://services.arcgis.com/KTcxiTD9dsQw4r7Z/arcgis/rest/services/Texas_County_Boundaries_Detailed/FeatureServer/0/query';
  
  // Alternative endpoints if the above don't work
  private static readonly FALLBACK_CITIES_URL = 'https://maps.dot.state.tx.us/arcgis/rest/services/General/Cities/MapServer/0/query';
  private static readonly FALLBACK_COUNTIES_URL = 'https://maps.dot.state.tx.us/arcgis/rest/services/Boundaries/MapServer/1/query';

  static async getJurisdictionByCoordinates(
    latitude: number,
    longitude: number
  ): Promise<LocationData> {
    try {
      console.log(`\n=== JURISDICTION LOOKUP ===`);
      console.log(`Coordinates: ${latitude}, ${longitude}`);
      
      // First check if location is within any city boundaries
      const cityResult = await this.findCityByGIS(latitude, longitude);
      
      // Always get county information
      const countyResult = await this.findCountyByGIS(latitude, longitude);

      const county = countyResult || {
        name: 'Texas',
        sheriffPhone: '(512) 463-2000',
        sheriffWebsite: 'https://www.dps.texas.gov',
      };

      console.log(`City found: ${cityResult?.name || 'None'}`);
      console.log(`County found: ${county.name}`);

      if (cityResult) {
        // City has jurisdiction - police department takes precedence
        console.log(`JURISDICTION: City (${cityResult.name})`);
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
        console.log(`JURISDICTION: County (${county.name})`);
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
    console.log(`\n--- CITY LOOKUP ---`);
    
    // Try multiple API endpoints and approaches
    const endpoints = [
      this.TXDOT_CITIES_URL,
      this.FALLBACK_CITIES_URL,
      // Also try the Census Bureau API as a backup
      'https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/Places_CouSub_ConCity_SubMCD/MapServer/0/query'
    ];

    for (const [index, endpoint] of endpoints.entries()) {
      try {
        console.log(`Trying city endpoint ${index + 1}: ${endpoint}`);
        
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

        const response = await fetch(`${endpoint}?${params}`, {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Texas Law Enforcement Jurisdiction App'
          }
        });

        if (!response.ok) {
          console.log(`Endpoint ${index + 1} failed: ${response.status} ${response.statusText}`);
          continue;
        }

        const data: GISResponse = await response.json();
        
        if (data.error) {
          console.log(`API Error from endpoint ${index + 1}:`, data.error);
          continue;
        }

        console.log(`Endpoint ${index + 1} response:`, {
          featureCount: data.features?.length || 0,
          firstFeature: data.features?.[0]?.attributes || null
        });

        if (data.features && data.features.length > 0) {
          const feature = data.features[0];
          const attrs = feature.attributes;
          
          // Try various field name combinations based on different data sources
          const possibleCityFields = [
            'CITY_NM', 'NAME', 'CITY_NAME', 'City', 'CITYNAME', 'NAMELSAD',
            'NAME10', 'GEONAME', 'CITY_FIPS', 'PLACE_NAME', 'FULLNAME'
          ];
          
          const possibleCountyFields = [
            'CNTY_NM', 'COUNTY', 'COUNTY_NAME', 'County', 'COUNTYNAME',
            'COUNTYFP', 'CNTY_FIPS', 'STATEFP'
          ];

          let cityName = null;
          let countyName = null;

          // Find city name
          for (const field of possibleCityFields) {
            if (attrs[field] && typeof attrs[field] === 'string' && attrs[field].trim()) {
              cityName = attrs[field].trim();
              console.log(`Found city name in field '${field}': ${cityName}`);
              break;
            }
          }

          // Find county name
          for (const field of possibleCountyFields) {
            if (attrs[field] && typeof attrs[field] === 'string' && attrs[field].trim()) {
              countyName = attrs[field].trim();
              console.log(`Found county name in field '${field}': ${countyName}`);
              break;
            }
          }

          if (cityName) {
            // Clean up city name - remove state suffixes and common prefixes
            cityName = cityName.replace(/, TX$/, '').replace(/, Texas$/, '').replace(/^City of /, '');
            
            // Special handling for Port Arthur
            if (cityName.toLowerCase().includes('port arthur')) {
              cityName = 'Port Arthur';
            }

            console.log(`Final city name: ${cityName}`);

            // Look up city data from our database
            const cityKey = cityName.toLowerCase();
            const cityData = TEXAS_CITIES[cityKey];

            if (cityData) {
              console.log(`Found city in database: ${cityData.name}`);
              return cityData;
            } else {
              console.log(`City not in database, returning basic info`);
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
      } catch (error) {
        console.error(`Error with city endpoint ${index + 1}:`, error);
        continue;
      }
    }

    console.log('No city found at coordinates');
    return null;
  }

  private static async findCountyByGIS(
    latitude: number,
    longitude: number
  ): Promise<CountyData | null> {
    console.log(`\n--- COUNTY LOOKUP ---`);
    
    const endpoints = [
      this.TXDOT_COUNTIES_URL,
      this.FALLBACK_COUNTIES_URL,
      // Census Bureau backup
      'https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/State_County/MapServer/1/query'
    ];

    for (const [index, endpoint] of endpoints.entries()) {
      try {
        console.log(`Trying county endpoint ${index + 1}: ${endpoint}`);
        
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

        const response = await fetch(`${endpoint}?${params}`, {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Texas Law Enforcement Jurisdiction App'
          }
        });

        if (!response.ok) {
          console.log(`County endpoint ${index + 1} failed: ${response.status} ${response.statusText}`);
          continue;
        }

        const data: GISResponse = await response.json();
        
        if (data.error) {
          console.log(`County API Error from endpoint ${index + 1}:`, data.error);
          continue;
        }

        console.log(`County endpoint ${index + 1} response:`, {
          featureCount: data.features?.length || 0,
          firstFeature: data.features?.[0]?.attributes || null
        });

        if (data.features && data.features.length > 0) {
          const feature = data.features[0];
          const attrs = feature.attributes;
          
          // Try various county field name combinations
          const possibleCountyFields = [
            'CNTY_NM', 'NAME', 'COUNTY_NAME', 'County', 'COUNTYNAME',
            'NAMELSAD', 'NAME10', 'GEONAME', 'FULLNAME', 'COUNTY_FIPS'
          ];

          let countyName = null;

          // Find county name
          for (const field of possibleCountyFields) {
            if (attrs[field] && typeof attrs[field] === 'string' && attrs[field].trim()) {
              countyName = attrs[field].trim();
              console.log(`Found county name in field '${field}': ${countyName}`);
              break;
            }
          }

          if (countyName) {
            // Clean up county name
            countyName = countyName.replace(/, TX$/, '').replace(/, Texas$/, '').replace(/ County$/, '');
            
            // Add "County" back if it was stripped
            if (!countyName.toLowerCase().includes('county')) {
              countyName += ' County';
            }

            console.log(`Final county name: ${countyName}`);

            // Look up county data from our database
            const countyKey = countyName.toLowerCase().replace(' county', '').replace(' ', '_');
            const countyData = TEXAS_COUNTIES[countyKey];

            if (countyData) {
              console.log(`Found county in database: ${countyData.name}`);
              return countyData;
            } else {
              console.log(`County not in database, returning basic info`);
              // Return basic county info if not in our database
              return {
                name: countyName,
                sheriffPhone: undefined,
                sheriffWebsite: undefined,
              };
            }
          }
        }
      } catch (error) {
        console.error(`Error with county endpoint ${index + 1}:`, error);
        continue;
      }
    }

    console.log('No county found, using Texas DPS fallback');
    // Fallback to Texas DPS
    return {
      name: 'Texas',
      sheriffPhone: '(512) 463-2000',
      sheriffWebsite: 'https://www.dps.texas.gov',
    };
  }
}