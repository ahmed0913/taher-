/** ═══════════════════════════════════════════════════════════════
 * 🌐 API Client - Fetch Wrapper with Error Handling & Retry Logic
 * ═══════════════════════════════════════════════════════════════ */

import { getMockData } from '../data/mockData.js';

class ApiClient {
  constructor(baseURL = 'http://localhost:8080/api') {
    this.baseURL = baseURL;
    this.maxRetries = 3;
    this.retryDelay = 1000; // Start with 1s, increase exponentially
    this.timeout = 5000; // 5 second timeout
    this.useMockData = false;
    this.mockDataCache = null;

    console.log('✅ API Client initialized:', { baseURL, maxRetries: this.maxRetries, timeout: this.timeout });
  }

  /**
   * Make API request with timeout, retry logic, and fallback to mock data
   */
  async request(endpoint, options = {}, retryCount = 0) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.warn(`⏱️ Request timeout (${this.timeout}ms) for ${endpoint}`);
      controller.abort();
    }, this.timeout);

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

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ HTTP ${response.status}:`, errorText);
        throw new Error(`HTTP ${response.status}: ${errorText.substring(0, 100)}`);
      }

      const data = await response.json();
      console.log(`✅ API Success: ${endpoint}`, data);
      return data;

    } catch (error) {
      clearTimeout(timeoutId);
      console.error(`❌ API Error (attempt ${retryCount + 1}):`, error.message);

      // Retry with exponential backoff
      if (retryCount < this.maxRetries) {
        const delay = this.retryDelay * Math.pow(2, retryCount);
        console.log(`⏳ Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.request(endpoint, options, retryCount + 1);
      }

      // All retries failed - fallback to mock data
      console.warn(`🔄 All retries failed (${this.maxRetries + 1} attempts). Falling back to mock data.`);
      throw error;
    }
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
