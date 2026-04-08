/** ═══════════════════════════════════════════════════════════════
 * ⚙️ Configuration - API & App Constants
 * ═══════════════════════════════════════════════════════════════ */

export const config = {
  // API Configuration
  api: {
    // Try to get from environment, fallback to localhost
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
    timeout: 5000, // 5 seconds
    maxRetries: 3,
    retryDelay: 1000
  },

  // App Configuration
  app: {
    name: 'Clinic Appointment System',
    version: '1.0.0',
    author: 'Healthcare Dev Team'
  },

  // Features
  features: {
    darkMode: true,
    notifications: true,
    offlineMode: true,
    mockData: true
  },

  // Demo Mode
  demo: {
    enabled: true,
    message: 'Running in demo mode with mock data'
  },

  // Pagination
  pagination: {
    itemsPerPage: 10,
    maxPages: 100
  }
};

export default config;
