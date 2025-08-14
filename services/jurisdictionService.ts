import { LocationData, CityData, CountyData } from '@/types/location';

// Texas Counties with Sheriff contact information
const TEXAS_COUNTIES: Record<string, CountyData> = {
  'jefferson': {
    name: 'Jefferson County',
    sheriffPhone: '(409) 835-8411',
    sheriffWebsite: 'https://www.co.jefferson.tx.us/sheriff',
    address: '1001 Pearl St, Beaumont, TX 77701',
  },
  'harris': {
    name: 'Harris County',
    sheriffPhone: '(713) 755-7628',
    sheriffWebsite: 'https://www.hcso.org',
    address: '1200 Baker St, Houston, TX 77002',
  },
  'dallas': {
    name: 'Dallas County',
    sheriffPhone: '(214) 749-8641',
    sheriffWebsite: 'https://www.dallascounty.org/departments/sheriff',
    address: '133 N Industrial Blvd, Dallas, TX 75207',
  },
  'tarrant': {
    name: 'Tarrant County',
    sheriffPhone: '(817) 884-1213',
    sheriffWebsite: 'https://www.tarrantcounty.com/en/sheriff',
    address: '200 Taylor St, Fort Worth, TX 76196',
  },
  'bexar': {
    name: 'Bexar County',
    sheriffPhone: '(210) 335-6000',
    sheriffWebsite: 'https://www.bexar.org/1250/Sheriffs-Office',
    address: '200 N Comal St, San Antonio, TX 78207',
  },
  'travis': {
    name: 'Travis County',
    sheriffPhone: '(512) 854-9770',
    sheriffWebsite: 'https://www.tcso.org',
    address: '5555 Airport Blvd, Austin, TX 78751',
  },
  'collin': {
    name: 'Collin County',
    sheriffPhone: '(972) 547-5100',
    sheriffWebsite: 'https://www.collincountytx.gov/sheriff',
    address: '4300 Community Ave, McKinney, TX 75071',
  },
  'denton': {
    name: 'Denton County',
    sheriffPhone: '(940) 349-1600',
    sheriffWebsite: 'https://www.dentoncounty.gov/Departments/Sheriff',
    address: '127 N Woodrow Ln, Denton, TX 76205',
  },
  'fort_bend': {
    name: 'Fort Bend County',
    sheriffPhone: '(281) 341-4665',
    sheriffWebsite: 'https://www.fbcso.org',
    address: '1410 Ransom Rd, Richmond, TX 77469',
  },
  'williamson': {
    name: 'Williamson County',
    sheriffPhone: '(512) 943-1300',
    sheriffWebsite: 'https://www.wilco.org/Departments/Sheriff',
    address: '508 S Rock St, Georgetown, TX 78626',
  },
  'hidalgo': {
    name: 'Hidalgo County',
    sheriffPhone: '(956) 383-8114',
    sheriffWebsite: 'https://www.hidalgocounty.us/269/Sheriffs-Office',
    address: '100 N Closner Blvd, Edinburg, TX 78539',
  },
  'el_paso': {
    name: 'El Paso County',
    sheriffPhone: '(915) 538-2008',
    sheriffWebsite: 'https://www.epcounty.com/sheriff',
    address: '3850 E Paisano Dr, El Paso, TX 79905',
  },
  'nueces': {
    name: 'Nueces County',
    sheriffPhone: '(361) 887-2222',
    sheriffWebsite: 'https://www.nuecesco.com/sheriff',
    address: '901 Leopard St, Corpus Christi, TX 78401',
  },
  'lubbock': {
    name: 'Lubbock County',
    sheriffPhone: '(806) 775-1400',
    sheriffWebsite: 'https://www.lubbockcounty.gov/departments/sheriff',
    address: '916 Main St, Lubbock, TX 79401',
  },
  'galveston': {
    name: 'Galveston County',
    sheriffPhone: '(409) 766-2322',
    sheriffWebsite: 'https://www.galvestoncountysheriff.org',
    address: '5600 39th St, Dickinson, TX 77539',
  },
  'montgomery': {
    name: 'Montgomery County',
    sheriffPhone: '(936) 760-5800',
    sheriffWebsite: 'https://www.mctxsheriff.org',
    address: '100 Community Center Dr, Conroe, TX 77301',
  },
  'brazoria': {
    name: 'Brazoria County',
    sheriffPhone: '(979) 864-2392',
    sheriffWebsite: 'https://www.brazoriacountysheriff.org',
    address: '111 E Locust St, Angleton, TX 77515',
  },
  'bell': {
    name: 'Bell County',
    sheriffPhone: '(254) 933-5412',
    sheriffWebsite: 'https://www.bellcountytx.com/departments/sheriff',
    address: '1201 Huey Bratcher Rd, Belton, TX 76513',
  },
  'mclennan': {
    name: 'McLennan County',
    sheriffPhone: '(254) 757-5049',
    sheriffWebsite: 'https://www.mclennancountytx.gov/departments/sheriff',
    address: '3121 E Loop 340, Waco, TX 76705',
  },
  'cameron': {
    name: 'Cameron County',
    sheriffPhone: '(956) 554-6700',
    sheriffWebsite: 'https://www.cameroncountysheriff.org',
    address: '7300 Old Alice Rd, Olmito, TX 78575',
  },
  'webb': {
    name: 'Webb County',
    sheriffPhone: '(956) 415-2878',
    sheriffWebsite: 'https://www.webbcountytx.gov/sheriff',
    address: '1110 Victoria St, Laredo, TX 78040',
  },
  'orange': {
    name: 'Orange County',
    sheriffPhone: '(409) 883-2612',
    sheriffWebsite: 'https://www.orangecountytx.gov/departments/sheriff',
    address: '123 6th St, Orange, TX 77630',
  },
  'smith': {
    name: 'Smith County',
    sheriffPhone: '(903) 566-6600',
    sheriffWebsite: 'https://www.smith-county.com/sheriff',
    address: '227 N Spring Ave, Tyler, TX 75702',
  },
  'brazos': {
    name: 'Brazos County',
    sheriffPhone: '(979) 361-4900',
    sheriffWebsite: 'https://www.brazoscountytx.gov/sheriff',
    address: '1755 Briarcrest Dr, Bryan, TX 77802',
  },
};

// Major Texas Cities with Police Department contact information
const TEXAS_CITIES: Record<string, CityData> = {
  'port arthur': {
    name: 'Port Arthur',
    county: 'Jefferson County',
    policePhone: '(409) 983-8600',
    policeWebsite: 'https://www.portarthurtx.gov/departments/police',
    address: '645 4th St, Port Arthur, TX 77640',
  },
  'houston': {
    name: 'Houston',
    county: 'Harris County',
    policePhone: '(713) 884-3131',
    policeWebsite: 'https://www.houstontx.gov/police',
    address: '1200 Travis St, Houston, TX 77002',
  },
  'san antonio': {
    name: 'San Antonio',
    county: 'Bexar County',
    policePhone: '(210) 207-7273',
    policeWebsite: 'https://www.sanantonio.gov/SAPD',
    address: '315 S Santa Rosa Ave, San Antonio, TX 78207',
  },
  'dallas': {
    name: 'Dallas',
    county: 'Dallas County',
    policePhone: '(214) 671-4282',
    policeWebsite: 'https://www.dallaspolice.net',
    address: '1400 S Lamar St, Dallas, TX 75215',
  },
  'austin': {
    name: 'Austin',
    county: 'Travis County',
    policePhone: '(512) 974-5000',
    policeWebsite: 'https://www.austintexas.gov/department/police',
    address: '715 E 8th St, Austin, TX 78701',
  },
  'fort worth': {
    name: 'Fort Worth',
    county: 'Tarrant County',
    policePhone: '(817) 392-4222',
    policeWebsite: 'https://www.fortworthtexas.gov/departments/police',
    address: '350 W Belknap St, Fort Worth, TX 76102',
  },
  'el paso': {
    name: 'El Paso',
    county: 'El Paso County',
    policePhone: '(915) 212-4400',
    policeWebsite: 'https://www.elpasotexas.gov/police',
    address: '911 N Raynor St, El Paso, TX 79901',
  },
  'arlington': {
    name: 'Arlington',
    county: 'Tarrant County',
    policePhone: '(817) 459-5700',
    policeWebsite: 'https://www.arlingtontx.gov/city_hall/departments/police',
    address: '620 W Division St, Arlington, TX 76011',
  },
  'corpus christi': {
    name: 'Corpus Christi',
    county: 'Nueces County',
    policePhone: '(361) 886-2600',
    policeWebsite: 'https://www.cctexas.com/departments/police',
    address: '321 John Sartain St, Corpus Christi, TX 78401',
  },
  'plano': {
    name: 'Plano',
    county: 'Collin County',
    policePhone: '(972) 424-5678',
    policeWebsite: 'https://www.plano.gov/1183/Police',
    address: '909 14th St, Plano, TX 75074',
  },
  'lubbock': {
    name: 'Lubbock',
    county: 'Lubbock County',
    policePhone: '(806) 775-2865',
    policeWebsite: 'https://www.mylubbock.us/departments/police',
    address: '916 Texas Ave, Lubbock, TX 79401',
  },
  'beaumont': {
    name: 'Beaumont',
    county: 'Jefferson County',
    policePhone: '(409) 832-1234',
    policeWebsite: 'https://www.beaumonttexas.gov/departments/police',
    address: '255 College St, Beaumont, TX 77701',
  },
  // Adding more cities with police departments and addresses
  'orange': {
    name: 'Orange',
    county: 'Orange County',
    policePhone: '(409) 883-1026',
    policeWebsite: 'https://www.orangetexas.net/police',
    address: '1212 W Park Ave, Orange, TX 77630',
  },
  'nederland': {
    name: 'Nederland',
    county: 'Jefferson County',
    policePhone: '(409) 722-4965',
    policeWebsite: 'https://www.ci.nederland.tx.us/departments/police',
    address: '1400 Boston Ave, Nederland, TX 77627',
  },
  'groves': {
    name: 'Groves',
    county: 'Jefferson County',
    policePhone: '(409) 962-0244',
    policeWebsite: 'https://www.grovescity.com/police',
    address: '6161 Madison Ave, Groves, TX 77619',
  },
  'galveston': {
    name: 'Galveston',
    county: 'Galveston County',
    policePhone: '(409) 765-3702',
    policeWebsite: 'https://www.galvestontx.gov/police',
    address: '823 Rosenberg Ave, Galveston, TX 77550',
  },
  'tyler': {
    name: 'Tyler',
    county: 'Smith County',
    policePhone: '(903) 531-1000',
    policeWebsite: 'https://www.cityoftyler.org/departments/police',
    address: '405 Martin Walker Dr, Tyler, TX 75702',
  },
  'waco': {
    name: 'Waco',
    county: 'McLennan County',
    policePhone: '(254) 750-7500',
    policeWebsite: 'https://www.waco-texas.com/departments/police',
    address: '3115 Pine Ave, Waco, TX 76708',
  },
  'brownsville': {
    name: 'Brownsville',
    county: 'Cameron County',
    policePhone: '(956) 548-7000',
    policeWebsite: 'https://www.cob.us/departments/police',
    address: '600 E Jackson St, Brownsville, TX 78520',
  },
  'laredo': {
    name: 'Laredo',
    county: 'Webb County',
    policePhone: '(956) 795-2800',
    policeWebsite: 'https://www.cityoflaredo.com/police',
    address: '4712 Maher Ave, Laredo, TX 78041',
  },
  'college station': {
    name: 'College Station',
    county: 'Brazos County',
    policePhone: '(979) 764-3600',
    policeWebsite: 'https://www.cstx.gov/departments/police',
    address: '1100 Krenek Tap Rd, College Station, TX 77840',
  },
  'bryan': {
    name: 'Bryan',
    county: 'Brazos County',
    policePhone: '(979) 209-5300',
    policeWebsite: 'https://www.bryantx.gov/departments/police',
    address: '303 E 29th St, Bryan, TX 77803',
  },
  'vidor': {
    name: 'Vidor',
    county: 'Orange County',
    policePhone: '(409) 769-4411',
    policeWebsite: 'https://www.vidortx.com/police',
    address: '1395 N Main St, Vidor, TX 77662',
  },
  'bridge city': {
    name: 'Bridge City',
    county: 'Orange County',
    policePhone: '(409) 735-4503',
    policeWebsite: 'https://www.bridgecitytx.com/police',
    address: '260 Raceway Dr, Bridge City, TX 77611',
  },
  'west orange': {
    name: 'West Orange',
    county: 'Orange County',
    policePhone: '(409) 883-4661',
    policeWebsite: 'https://www.westorangetx.com/police',
    address: '2700 Western Ave, West Orange, TX 77630',
  },
  'pinehurst': {
    name: 'Pinehurst',
    county: 'Orange County',
    policePhone: '(409) 886-4111',
    policeWebsite: 'https://www.pinehurstcity.com/police',
    address: '3730 Magnolia St, Pinehurst, TX 77362',
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

  // Cache for searched cities to avoid repeated API calls
  private static cityContactCache = new Map<string, CityData>();

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
            address: cityResult.address,
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
              console.log(`City not in database, generating contact information`);
              
              // Check cache first
              const cacheKey = cityName.toLowerCase();
              if (this.cityContactCache.has(cacheKey)) {
                console.log(`Found city in cache: ${cityName}`);
                return this.cityContactCache.get(cacheKey)!;
              }

              // Generate contact information for unknown cities
              const generatedCityData = this.generateCityContactInfo(cityName, countyName || 'Unknown County');
              
              // Cache the result
              this.cityContactCache.set(cacheKey, generatedCityData);
              
              console.log(`Generated contact info for ${cityName}:`, generatedCityData);
              
              return generatedCityData;
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

  /**
   * Generate contact information for cities not in the database
   */
  private static generateCityContactInfo(cityName: string, countyName: string): CityData {
    // For unknown cities, provide guidance instead of fake phone numbers
    const searchGuidance = this.getSearchSuggestions(cityName, countyName);
    
    // Generate likely website URL
    const website = this.generateLikelyWebsite(cityName);
    
    // Provide helpful search instruction instead of fake number
    const phoneGuidance = `Call 411 or search: ${searchGuidance.phoneSearch[0]}`;
    const addressGuidance = `Search "${cityName} Texas police department address" or visit city hall`;
    
    return {
      name: cityName,
      county: countyName,
      policePhone: phoneGuidance,
      policeWebsite: website,
      address: addressGuidance,
    };
  }

  /**
   * Get the most common area code for a county
   */
  private static getAreaCodeForCounty(countyName: string): string {
    const areaCodeMap: Record<string, string> = {
      'jefferson county': '409',
      'harris county': '713',
      'dallas county': '214',
      'tarrant county': '817',
      'bexar county': '210',
      'travis county': '512',
      'collin county': '972',
      'denton county': '940',
      'fort bend county': '281',
      'williamson county': '512',
      'el paso county': '915',
      'nueces county': '361',
      'lubbock county': '806',
      'galveston county': '409',
      'montgomery county': '936',
      'brazoria county': '979',
      'bell county': '254',
      'mclennan county': '254',
      'cameron county': '956',
      'webb county': '956',
      'hidalgo county': '956',
      'orange county': '409',
      'smith county': '903',
      'brazos county': '979',
      // Add more counties as needed
    };

    const normalizedCounty = countyName.toLowerCase();
    return areaCodeMap[normalizedCounty] || '512'; // Default to Austin area code
  }

  /**
   * Generate a likely city hall phone number (which can transfer to police)
   */
  private static generateCityHallPhone(areaCode: string): string {
    // Generate a realistic-looking city hall number
    // Most city halls have numbers ending in common patterns
    const commonEndings = ['1234', '2000', '3000', '4000', '5000', '1000', '2500', '3500'];
    const randomEnding = commonEndings[Math.floor(Math.random() * commonEndings.length)];
    
    return `(${areaCode}) 555-${randomEnding.slice(0, 4)}`;
  }

  /**
   * Generate a likely website URL for the city
   */
  private static generateLikelyWebsite(cityName: string): string {
    const citySlug = cityName.toLowerCase()
      .replace(/\s+/g, '') // Remove spaces
      .replace(/[^a-z0-9]/g, ''); // Remove special characters
    
    // Most common pattern for Texas cities
    return `https://www.cityof${citySlug}.com`;
  }

  /**
   * Get search suggestions for manual lookup
   */
  static getSearchSuggestions(cityName: string, countyName: string) {
    const areaCode = this.getAreaCodeForCounty(countyName);
    
    return {
      phoneSearch: [
        `"${cityName} Texas police department phone"`,
        `"${cityName} police ${areaCode}"`,
        `"${cityName} city hall phone ${areaCode}"`,
        `"${cityName} ${countyName} police"`
      ],
      websiteSearch: [
        `"${cityName} Texas police department"`,
        `"city of ${cityName} police"`,
        `"${cityName} TX police department"`,
        `site:gov "${cityName}" police`
      ],
      generalSearch: [
        `"${cityName} Texas police non emergency"`,
        `"${cityName} ${countyName} law enforcement"`,
        `"${cityName} police chief" contact`,
        `"${cityName} TX police report"`
      ]
    };
  }

  /**
   * Clear the search cache
   */
  static clearSearchCache(): void {
    this.cityContactCache.clear();
  }
}
