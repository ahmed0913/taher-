/** ═══════════════════════════════════════════════════════════════
 * ⚙️ Configuration - API & App Constants
 * Vanilla JS Compatible (No Node.js process object)
 * ═══════════════════════════════════════════════════════════════ */

// 🎯 Environment detection for browser
const getEnvVar = (key, fallback) => {
  // Try window object first (can be set via inline script)
  if (window[key] !== undefined) return window[key];
  
  // Try data attributes on HTML element
  const html = document.documentElement;
  const attr = html.getAttribute(`data-${key.toLowerCase()}`);
  if (attr) return attr;
  
  // Fallback to default
  return fallback;
};

export const config = {
  // API Configuration
  api: {
    // ✅ Browser-compatible environment variable handling
    baseURL: getEnvVar('API_URL', 'http://localhost:8080/api'),
    timeout: 3000,          // ⬅️ قلل لـ 3 ثواني
    maxRetries: 1,          // ⬅️ محاولة واحدة بس (عشان السرعة)
    retryDelay: 500
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

  // Demo Mode - ENABLED BY DEFAULT FOR INSTANT OPERATION
  demo: {
    enabled: true,          // ✅ شغال من الأول
    instant: true,          // ✅ تخطي محاولات الـ API
    showBadge: true,
    message: '🎭 Demo Mode - Using Sample Data'
  },

  // Pagination
  pagination: {
    itemsPerPage: 10,
    maxPages: 100
  },
  
  // Environment flags (browser-safe)
  isDevelopment: window.location.hostname === 'localhost',
  isProduction: window.location.hostname !== 'localhost'
};

// Log in dev mode only
if (config.isDevelopment) {
  console.log('⚙️ Config loaded:', { 
    baseURL: config.api.baseURL, 
    demo: config.demo.enabled 
  });
}

export default config;