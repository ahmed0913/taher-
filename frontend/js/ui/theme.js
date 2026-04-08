/** ═══════════════════════════════════════════════════════════════
 * 🎨 Theme Manager - Dark/Light Mode Toggle
 * ═══════════════════════════════════════════════════════════════ */

export const theme = {
  currentTheme: 'dark',
  storageKey: 'clinic-theme',

  /**
   * Initialize theme from storage or system preference
   */
  init() {
    // Check localStorage
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      this.currentTheme = saved;
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.currentTheme = prefersDark ? 'dark' : 'light';
    }

    this.apply();
    this.watchSystemPreference();
    console.log('🎨 Theme initialized:', this.currentTheme);
  },

  /**
   * Apply current theme
   */
  apply() {
    const html = document.documentElement;
    html.setAttribute('data-theme', this.currentTheme);
    localStorage.setItem(this.storageKey, this.currentTheme);

    if (this.currentTheme === 'dark') {
      html.style.colorScheme = 'dark';
    } else {
      html.style.colorScheme = 'light';
    }

    // Update meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', this.currentTheme === 'dark' ? '#0a0e27' : '#f0f4f8');
    }

    console.log('✅ Theme applied:', this.currentTheme);
  },

  /**
   * Toggle theme
   */
  toggle() {
    this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.apply();
    this.dispatch();
    return this.currentTheme;
  },

  /**
   * Set specific theme
   */
  set(newTheme) {
    if (['dark', 'light'].includes(newTheme)) {
      this.currentTheme = newTheme;
      this.apply();
      this.dispatch();
    }
  },

  /**
   * Watch system preference changes
   */
  watchSystemPreference() {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
      const saved = localStorage.getItem(this.storageKey);
      if (!saved) { // Only auto-switch if user hasn't manually set theme
        this.currentTheme = e.matches ? 'dark' : 'light';
        this.apply();
        this.dispatch();
        console.log('🎨 Theme auto-switched based on system preference');
      }
    });
  },

  /**
   * Dispatch theme change event
   */
  dispatch() {
    window.dispatchEvent(new CustomEvent('theme-change', { detail: { theme: this.currentTheme } }));
  },

  /**
   * Get current theme
   */
  get() {
    return this.currentTheme;
  },

  /**
   * Check if dark mode
   */
  isDark() {
    return this.currentTheme === 'dark';
  },

  /**
   * Check if light mode
   */
  isLight() {
    return this.currentTheme === 'light';
  }
};

export default theme;
