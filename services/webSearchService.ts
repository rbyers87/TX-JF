/**
 * Web Search Service for finding police department contact information
 * This service provides methods to search for police department info when cities
 * are not in the predefined database.
 */

interface SearchResult {
  phone?: string;
  website?: string;
  email?: string;
}

interface CitySearchResult extends SearchResult {
  cityName: string;
  county: string;
  searchMethod: string;
  confidence: 'high' | 'medium' | 'low';
}

export class WebSearchService {
  private static cache = new Map<string, CitySearchResult>();
  
  /**
   * Main method to search for police department contact information
   */
  static async searchPoliceInfo(cityName: string, countyName: string): Promise<CitySearchResult> {
    const cacheKey = `${cityName.toLowerCase()}-${countyName.toLowerCase()}`;
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      console.log(`Returning cached result for ${cityName}`);
      return this.cache.get(cacheKey)!;
    }

    console.log(`Searching for police info: ${cityName}, ${countyName}`);

    // Try multiple search strategies in order of reliability
    const searchMethods = [
      () => this.searchByOfficialWebsite(cityName, countyName),
      () => this.searchByCommonPatterns(cityName, countyName),
      () => this.searchByDirectory(cityName, countyName),
      () => this.createFallbackResult(cityName, countyName)
    ];

    for (const method of searchMethods) {
      try {
        const result = await method();
        if (result && (result.phone || result.website)) {
          this.cache.set(cacheKey, result);
          return result;
        }
      } catch (error) {
        console.log(`Search method failed:`, error);
        continue;
      }
    }

    // Return fallback result
    const fallback = this.createFallbackResult(cityName, countyName);
    this.cache.set(cacheKey, fallback);
    return fallback;
  }

  /**
   * Search by trying to find the city's official website
   */
  private static async searchByOfficialWebsite(cityName: string, countyName: string): Promise<CitySearchResult | null> {
    console.log(`Searching official website for ${cityName}`);
    
    const website = await this.findOfficialCityWebsite(cityName);
    if (website) {
      const policeInfo = await this.extractPoliceInfoFromSite(website, cityName);
      
      return {
        cityName,
        county: countyName,
        website: policeInfo.website || website,
        phone: policeInfo.phone,
        email: policeInfo.email,
        searchMethod: 'official_website',
        confidence: 'high'
      };
    }
    
    return null;
  }

  /**
   * Search using common website patterns
   */
  private static async searchByCommonPatterns(cityName: string, countyName: string): Promise<CitySearchResult | null> {
    console.log(`Searching common patterns for ${cityName}`);
    
    const citySlug = cityName.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
    
    // Common patterns for Texas cities
    const patterns = [
      `https://www.cityof${citySlug}.com`,
      `https://www.${citySlug}tx.gov`,
      `https://${citySlug}.tx.us`,
      `https://www.city${citySlug}.org`,
      `https://${citySlug}.org`,
      `https://www.${citySlug}texas.gov`
    ];

    for (const pattern of patterns) {
      const exists = await this.checkWebsiteExists(pattern);
      if (exists) {
        const policeInfo = await this.extractPoliceInfoFromSite(pattern, cityName);
        
        return {
          cityName,
          county: countyName,
          website: policeInfo.website || pattern,
          phone: policeInfo.phone,
          email: policeInfo.email,
          searchMethod: 'common_patterns',
          confidence: 'medium'
        };
      }
    }
    
    return null;
  }

  /**
   * Search using online directories (simplified approach due to CORS limitations)
   */
  private static async searchByDirectory(cityName: string, countyName: string): Promise<CitySearchResult | null> {
    console.log(`Directory search for ${cityName}`);
    
    // In a real implementation, you might use APIs like:
    // - Google Places API
    // - Yellow Pages API
    // - Local government directories
    
    // For now, we'll create educated guesses based on known patterns
    const phone = this.generateLikelyPhoneNumber(cityName, countyName);
    const website = this.generateLikelyWebsite(cityName);
    
    if (phone || website) {
      return {
        cityName,
        county: countyName,
        phone,
        website,
        searchMethod: 'directory_patterns',
        confidence: 'low'
      };
    }
    
    return null;
  }

  /**
   * Create a fallback result with helpful guidance
   */
  private static createFallbackResult(cityName: string, countyName: string): CitySearchResult {
    return {
      cityName,
      county: countyName,
      phone: `Call 411 or search "${cityName} Texas police department"`,
      website: this.generateLikelyWebsite(cityName),
      searchMethod: 'fallback',
      confidence: 'low'
    };
  }

  /**
   * Try to find the city's official website
   */
  private static async findOfficialCityWebsite(cityName: string): Promise<string | null> {
    const citySlug = cityName.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
    
    // Most common patterns for Texas city websites
    const primaryPatterns = [
      `https://www.cityof${citySlug}.com`,
      `https://${citySlug}.tx.us`,
      `https://www.${citySlug}tx.gov`
    ];

    for (const url of primaryPatterns) {
      const exists = await this.checkWebsiteExists(url);
      if (exists) {
        console.log(`Found official website: ${url}`);
        return url;
      }
    }

    return null;
  }

  /**
   * Check if a website exists (limited by CORS in browser)
   */
  private static async checkWebsiteExists(url: string): Promise<boolean> {
    try {
      // In a browser environment, we're limited by CORS
      // This is a simplified check that may not always work
      const response = await fetch(url, {
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-cache'
      });
      
      // If we get here without an error, the site likely exists
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Extract police information from a website (limited by CORS)
   */
  private static async extractPoliceInfoFromSite(website: string, cityName: string): Promise<SearchResult> {
    // Due to CORS restrictions in browsers, we can't easily scrape websites
    // In a real implementation, you'd need a backend service or CORS proxy
    
    // Try to construct likely police department URLs
    const baseUrl = new URL(website).origin;
    const policeUrls = [
      `${baseUrl}/police`,
      `${baseUrl}/departments/police`,
      `${baseUrl}/police-department`,
      `${baseUrl}/public-safety/police`
    ];

    // Check if any of these police URLs exist
    for (const policeUrl of policeUrls) {
      const exists = await this.checkWebsiteExists(policeUrl);
      if (exists) {
        return {
          website: policeUrl,
          phone: undefined // Would need backend service to extract
        };
      }
    }

    return { website };
  }

  /**
   * Generate a likely phone number based on area codes
   */
  private static generateLikelyPhoneNumber(cityName: string, countyName: string): string | undefined {
    // Texas area code mappings (simplified)
    const areaCodeMap: Record<string, string[]> = {
      'harris': ['713', '281', '832'],
      'dallas': ['214', '469', '972', '945'],
      'tarrant': ['817', '682'],
      'bexar': ['210', '726'],
      'travis': ['512', '737'],
      'jefferson': ['409'],
      'collin': ['214', '469', '972', '945'],
      'denton': ['940', '469'],
      'fort_bend': ['281', '832', '713'],
      'williamson': ['512', '737'],
      'el_paso': ['915'],
      'nueces': ['361'],
      'lubbock': ['806'],
      'galveston': ['409', '832'],
      'montgomery': ['281', '832', '936'],
      'hidalgo': ['956'],
      'cameron': ['956'],
      'bell': ['254'],
      'webb': ['956'],
      'mclennan': ['254'],
      'brazoria': ['281', '832', '409'],
      'ellis': ['214', '469', '972'],
      'johnson': ['817', '682'],
      'guadalupe': ['830'],
      'hays': ['512', '737'],
      'kaufman': ['214', '469', '972'],
      'rockwall': ['214', '469', '972'],
      'smith': ['903'],
      'brazos': ['979'],
      'liberty': ['281', '832', '936'],
      'orange': ['409'],
      'chambers': ['281', '832', '409']
    };

    const countyKey = countyName.toLowerCase().replace(' county', '').replace(' ', '_');
    const areaCodes = areaCodeMap[countyKey];
    
    if (areaCodes && areaCodes.length > 0) {
      // Use the first (most common) area code for the county
      const areaCode = areaCodes[0];
      return `Search "${cityName} Texas police ${areaCode}" for phone number`;
    }

    // Default Texas area codes if county not found
    return `Search "${cityName} Texas police department phone number"`;
  }

  /**
   * Generate a likely website URL
   */
  private static generateLikelyWebsite(cityName: string): string {
    const citySlug = cityName.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
    
    // Most common pattern for Texas cities
    return `https://www.cityof${citySlug}.com`;
  }

  /**
   * Get search suggestions for finding contact information
   */
  static getSearchSuggestions(cityName: string, countyName: string): {
    phoneSearch: string[];
    websiteSearch: string[];
    generalSearch: string[];
  } {
    return {
      phoneSearch: [
        `"${cityName} Texas police department phone number"`,
        `"${cityName} police ${countyName} phone"`,
        `"${cityName} TX police contact"`,
        `site:${cityName.toLowerCase().replace(/\s+/g, '')}.* police phone`
      ],
      websiteSearch: [
        `"${cityName} Texas police department website"`,
        `"city of ${cityName} police"`,
        `"${cityName} TX police department official site"`,
        `site:gov "${cityName}" police department`
      ],
      generalSearch: [
        `"${cityName} Texas police department"`,
        `"${cityName} ${countyName} police contact information"`,
        `"${cityName} TX law enforcement"`,
        `"${cityName} police chief" contact`
      ]
    };
  }

  /**
   * Validate and format phone number
   */
  static validatePhoneNumber(phone: string): string | null {
    if (!phone) return null;
    
    // Remove all non-digits
    const digits = phone.replace(/\D/g, '');
    
    // Check for valid US phone number
    if (digits.length === 10) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    } else if (digits.length === 11 && digits[0] === '1') {
      return `(${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
    }
    
    return null;
  }

  /**
   * Validate and format website URL
   */
  static validateWebsiteUrl(url: string): string | null {
    if (!url) return null;
    
    try {
      // Add protocol if missing
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      
      // Validate URL format
      new URL(url);
      return url;
    } catch {
      return null;
    }
  }

  /**
   * Clear the search cache
   */
  static clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  static getCacheStats(): { size: number; entries: string[] } {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys())
    };
  }
}