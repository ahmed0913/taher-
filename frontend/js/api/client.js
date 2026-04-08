/** ═══════════════════════════════════════════════════════════════
 * 🌐 API Client - Fetch Wrapper with Error Handling & Retry Logic
 * ENHANCED: Instant demo mode, fast fallback, zero delays
 * ═══════════════════════════════════════════════════════════════ */

import { getMockData } from '../data/mockData.js';
import { config } from '../config.js';

class ApiClient {
  constructor(baseURL = config.api.baseURL) {
    this.baseURL = baseURL;
    this.maxRetries = config.demo.instant ? 0 : 1;  // Skip retries if instant demo mode
    this.retryDelay = 300;  // Reduced from 1000ms
    this.timeout = config.demo.instant ? 0 : 2000;  // 2 second timeout, 0 if demo mode
    this.useMockData = config.demo.instant;  // INSTANT demo mode
    this.mockDataCache = config.demo.instant ? getMockData() : null;
    this.demoMode = config.demo.instant;

    const mode = this.demoMode ? '🎭 DEMO MODE (Instant)' : '🌐 API MODE';
    console.log(`✅ API Client initialized [${mode}]`, { 
      baseURL: this.baseURL,
      instant: config.demo.instant,
      timeout: this.timeout,
      retries: this.maxRetries
    });
  }

  /**
   * Make API request with timeout, retry logic, and fallback to mock data
   */
  async request(endpoint, options = {}, retryCount = 0) {
    // If in instant demo mode, skip API entirely
    if (this.demoMode && retryCount === 0) {
      console.log(`🎭 DEMO: Skipping API for ${endpoint}, using mock data`);
      return this.getMockDataForEndpoint(endpoint);
    }

    const controller = new AbortController();
    let timeoutId;

    if (this.timeout > 0) {
      timeoutId = setTimeout(() => {
        console.warn(`⏱️ Request timeout (${this.timeout}ms) for ${endpoint}`);
        controller.abort();
      }, this.timeout);
    }

    try {
      const url = `${this.baseURL}${endpoint}`;
      console.log(`📡 API Request (attempt ${retryCount + 1}/${this.maxRetries + 1}): ${url}`);

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers
        }
      });

      if (timeoutId) clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ HTTP ${response.status}:`, errorText);
        throw new Error(`HTTP ${response.status}: ${errorText.substring(0, 100)}`);
      }

      const data = await response.json();
      console.log(`✅ API Success: ${endpoint}`, data);
      this.demoMode = false;  // API is working, disable demo mode
      return data;

    } catch (error) {
      if (timeoutId) clearTimeout(timeoutId);
      console.error(`❌ API Error (attempt ${retryCount + 1}):`, error.message);

      // Retry with exponential backoff
      if (retryCount < this.maxRetries) {
        const delay = this.retryDelay * Math.pow(2, retryCount);
        console.log(`⏳ Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.request(endpoint, options, retryCount + 1);
      }

      // All retries failed - switch to demo mode
      console.warn(`🎭 Switching to DEMO MODE - Using mock data for ${endpoint}`);
      this.demoMode = true;
      this.mockDataCache = this.mockDataCache || getMockData();
      return this.getMockDataForEndpoint(endpoint);
    }
  }

  /**
   * Get appropriate mock data for endpoint
   */
  getMockDataForEndpoint(endpoint) {
    const cache = this.mockDataCache || getMockData();
    if (endpoint.includes('doctors')) return cache.doctors || [];
    if (endpoint.includes('patients')) return cache.patients || [];
    if (endpoint.includes('appointments')) return cache.appointments || [];
    return [];
  }

  /**
   * GET request
   */
  async get(endpoint, options = {}) {
    return this.request(endpoint, { method: 'GET', ...options });
  }

  /**
   * POST request
   */
  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options
    });
  }

  /**
   * PUT request
   */
  async put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options
    });
  }

  /**
   * DELETE request
   */
  async delete(endpoint, options = {}) {
    return this.request(endpoint, { method: 'DELETE', ...options });
  }

  /**
   * Enable demo mode - use mock data
   */
  enableDemoMode() {
    this.useMockData = true;
    this.mockDataCache = getMockData();
    console.log('🎭 Demo mode enabled - using mock data');
  }

  /**
   * GET with mock data fallback
   */
  async getWithFallback(endpoint) {
    try {
      return await this.get(endpoint);
    } catch (error) {
      console.warn(`⚠️ API failed, using mock data for ${endpoint}`);
      this.enableDemoMode();

      // Return appropriate mock data based on endpoint
      if (endpoint.includes('doctors')) return this.mockDataCache.doctors;
      if (endpoint.includes('patients')) return this.mockDataCache.patients;
      if (endpoint.includes('appointments')) return this.mockDataCache.appointments;

      return [];
    }
  }

  /**
   * Health check
   */
  async healthCheck() {
    try {
      console.log('🏥 Checking API health...');
      await this.get('/health');
      console.log('✅ API is healthy');
      return true;
    } catch (error) {
      console.error('❌ API is not responding:', error.message);
      return false;
    }
  }
}

// Create and export singleton instance
export const api = new ApiClient();

export default api;
