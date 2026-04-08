/** ═══════════════════════════════════════════════════════════════
 * 🚀 Main App - Router & Initialization
 * ═══════════════════════════════════════════════════════════════ */

import { theme } from './ui/theme.js';
import { particles } from './ui/particles.js';
import { api } from './api/client.js';
import { toast } from './ui/toast.js';
import { demoModeBadge } from './ui/demoBadge.js';
import { config } from './config.js';

// Import pages
import HomePage from './pages/home.js';
import DoctorsPage from './pages/doctors.js';
import BookPage from './pages/book.js';
import HistoryPage from './pages/history.js';
import ProfilePage from './pages/profile.js';

class ClinicApp {
  constructor() {
    this.currentPage = null;
    this.pages = {
      home: new HomePage(),
      doctors: new DoctorsPage(),
      book: new BookPage(),
      history: new HistoryPage(),
      profile: new ProfilePage()
    };

    console.log('🏥 Clinic App Initialized');
    console.log('📱 Pages:', Object.keys(this.pages));
  }

  /**
   * Initialize app
   */
  async init() {
    console.log('🚀 Starting Clinic App...');

    try {
      // Initialize theme
      theme.init();
      console.log('✅ Theme: ' + theme.get());

      // Initialize particles
      particles.init();
      console.log('✅ Particles initialized');

      // Show demo mode badge if enabled
      if (config.demo.enabled && config.demo.showBadge) {
        demoModeBadge.init();
        console.log('🎭 Demo mode badge shown');
      }

      // Setup navbar
      this.setupNavbar();

      // Setup routing
      this.setupRouting();

      // Load initial page
      const page = this.getPageFromURL();
      await this.navigate(page);

      console.log('🎉 App ready!');

    } catch (error) {
      console.error('❌ App initialization failed:', error);
      toast.error('Failed to initialize app');
    }
  }

  /**
   * Setup navbar
   */
  setupNavbar() {
    const navbar = document.querySelector('nav');
    if (!navbar) return;

    // Theme toggle
    const themeBtn = navbar.querySelector('#theme-toggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const newTheme = theme.toggle();
        themeBtn.textContent = newTheme === 'dark' ? '☀️' : '🌙';
        console.log('🎨 Theme toggled to:', newTheme);
      });

      // Set initial icon
      themeBtn.textContent = theme.isDark() ? '☀️' : '🌙';
    }

    // Logo click to home
    const logo = navbar.querySelector('.logo');
    if (logo) {
      logo.style.cursor = 'pointer';
      logo.addEventListener('click', () => this.navigate('home'));
    }

    // Nav links
    navbar.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        const page = link.getAttribute('data-page');
        if (page) this.navigate(page);
      });
    });
  }

  /**
   * Setup routing
   */
  setupRouting() {
    // Handle browser back/forward
    window.addEventListener('popstate', () => {
      const page = this.getPageFromURL();
      this.renderPage(page);
    });

    // Handle theme changes
    window.addEventListener('theme-change', (e) => {
      console.log('🎨 Theme changed to:', e.detail.theme);
    });
  }

  /**
   * Get page from URL with query parameter support
   * Supports: #home, #book?doctor=1, #doctors?spec=Cardiology, etc.
   */
  getPageFromURL() {
    const hash = window.location.hash.slice(1) || 'home';
    const [page] = hash.split('?');
    return page || 'home';
  }

  /**
   * Get query parameters from URL
   * Returns object with query params: { doctor: '1', spec: 'Cardiology' }
   */
  getQueryParams() {
    const hash = window.location.hash.slice(1) || '';
    const [, queryString] = hash.split('?');
    
    if (!queryString) return {};
    
    const params = new URLSearchParams(queryString);
    const result = {};
    
    for (const [key, value] of params.entries()) {
      result[key] = value;
    }
    
    return result;
  }

  /**
   * Navigate to page with optional query parameters
   * Usage: navigate('book', { doctor: 1 })
   */
  async navigate(page, queryParams = {}) {
    console.log('📍 Navigating to:', page, queryParams);

    // Build URL with query parameters
    let url = page;
    if (Object.keys(queryParams).length > 0) {
      const params = new URLSearchParams(queryParams).toString();
      url = `${page}?${params}`;
    }

    // Update URL
    window.location.hash = url;

    // Render page
    await this.renderPage(page);

    // Scroll to top
    window.scrollTo(0, 0);
  }

  /**
   * Render page
   */
  async renderPage(page) {
    // Clean page name: remove query params and hash symbols
    const [cleanPage] = (page || '').replace('#', '').trim().split('?');
    const finalPage = cleanPage || 'home';
    const pageObj = this.pages[finalPage];

    if (!pageObj) {
      console.error('❌ Page not found:', page);
      return;
    }

    try {
      const container = document.getElementById('app');
      if (!container) {
        console.error('❌ App container not found');
        return;
      }

      // Update nav active states
      document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === finalPage) {
          link.classList.add('active');
        }
      });

      // Show particles on main container
      let mainContainer = container.querySelector('main');
      if (mainContainer) {
        mainContainer.style.position = 'relative';
        mainContainer.style.zIndex = '1';
      }

      // Render page
      this.currentPage = finalPage;
      await pageObj.render(container);

      console.log('✅ Page rendered:', finalPage);

    } catch (error) {
      console.error('❌ Failed to render page:', error);
      toast.error('Failed to load page');

      // Fallback to home
      if (finalPage !== 'home') {
        await this.navigate('home');
      }
    }
  }
}

// Create global app instance
window.app = new ClinicApp();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => window.app.init());
} else {
  window.app.init();
}

console.log('✨ App module loaded');
