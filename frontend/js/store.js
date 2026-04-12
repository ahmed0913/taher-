/**
 * 🏪 Simple Pub/Sub Store for App State Management
 * Provides centralized state with event-driven updates
 */

class Store {
  constructor(initialState = {}) {
    this.state = {
      user: null,
      doctor: null,
      patient: null,
      appointment: null,
      theme: this._loadTheme(),
      sidebar: false,
      notification: null,
      loading: false,
      error: null,
      ...initialState,
    };

    this.listeners = new Map();
    this.middleware = [];

    this._initPersistence();
  }

  /**
   * Subscribe to state changes
   * @param {string} key - State property to watch
   * @param {function} handler - Callback when value changes
   * @returns {function} Unsubscribe function
   */
  subscribe(key, handler) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, []);
    }

    this.listeners.get(key).push(handler);

    // Return unsubscribe function
    return () => {
      const handlers = this.listeners.get(key);
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    };
  }

  /**
   * Update state and notify listeners
   * @param {string} key - State property to update
   * @param {*} value - New value
   */
  setState(key, value) {
    const oldValue = this.state[key];

    // Apply middleware
    for (const mw of this.middleware) {
      value = mw(key, value, oldValue) ?? value;
    }

    // Only update if value actually changed
    if (oldValue === value) return;

    this.state[key] = value;

    // Notify listeners
    if (this.listeners.has(key)) {
      this.listeners.get(key).forEach((handler) => {
        handler(value, oldValue);
      });
    }

    // Notify global subscribers
    if (this.listeners.has('*')) {
      this.listeners.get('*').forEach((handler) => {
        handler(this.state);
      });
    }

    // Persist if configured
    this._persistIfNeeded(key);
  }

  /**
   * Batch updates (notify listeners only once after all updates)
   * @param {function} updateFn - Function that updates multiple state properties
   */
  batch(updateFn) {
    const oldListeners = this.listeners;
    this.listeners = new Map();

    updateFn();

    this.listeners = oldListeners;

    // Notify all listeners of batch update
    if (this.listeners.has('*')) {
      this.listeners.get('*').forEach((handler) => {
        handler(this.state);
      });
    }
  }

  /**
   * Get a state value
   * @param {string} key - State property
   * @returns {*} State value
   */
  getState(key) {
    return key ? this.state[key] : this.state;
  }

  /**
   * Add middleware to transform state updates
   * @param {function} fn - Middleware function
   */
  use(fn) {
    this.middleware.push(fn);
  }

  /**
   * Reset state to initial value
   * @param {string} key - Optional: specific state key to reset
   */
  reset(key) {
    if (key) {
      this.setState(key, undefined);
    } else {
      this.state = {};
      if (this.listeners.has('*')) {
        this.listeners.get('*').forEach((handler) => {
          handler(this.state);
        });
      }
    }
  }

  /**
   * Watch multiple keys and execute handler when any changes
   * @param {string[]} keys - Keys to watch
   * @param {function} handler - Handler function
   * @returns {function} Unsubscribe function
   */
  watchMultiple(keys, handler) {
    const unsubscribers = keys.map((key) =>
      this.subscribe(key, () => {
        handler(this.state);
      })
    );

    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  }

  /* ─── Persistence ─── */

  /**
   * Configure persistence for specific keys
   * @param {string[]} keys - Keys to persist to localStorage
   */
  persistKeys(keys) {
    this.persistentKeys = keys;
  }

  _persistIfNeeded(key) {
    if (this.persistentKeys && this.persistentKeys.includes(key)) {
      const data = JSON.stringify(this.state[key]);
      localStorage.setItem(`clinic_${key}`, data);
    }
  }

  _loadTheme() {
    const saved = localStorage.getItem('clinic_theme');
    return saved || 'dark';
  }

  _initPersistence() {
    this.persistentKeys = ['theme', 'user', 'sidebar'];

    // Load persisted values with safe parsing
    for (const key of this.persistentKeys) {
      const saved = localStorage.getItem(`clinic_${key}`);
      if (saved) {
        try {
          // Safe parsing: check if it's JSON object format first
          const parsed = saved.trim().startsWith('{') || saved.trim().startsWith('[') 
            ? JSON.parse(saved) 
            : saved;
          this.state[key] = parsed;
        } catch (e) {
          console.warn(`Failed to parse persisted state: ${key}`, e);
          // Fallback to original value if parsing fails
          this.state[key] = saved;
        }
      }
    }
  }

  /* ─── Helpers ─── */

  /**
   * Set loading state
   * @param {boolean} isLoading
   */
  setLoading(isLoading) {
    this.setState('loading', isLoading);
  }

  /**
   * Set error state
   * @param {string|null} error
   */
  setError(error) {
    this.setState('error', error);
  }

  /**
   * Show notification
   * @param {string} message
   * @param {string} type - 'success', 'error', 'warning', 'info'
   * @param {number} duration - Auto-hide duration in ms
   */
  notify(message, type = 'info', duration = 3000) {
    const notificationId = Date.now();
    this.setState('notification', {
      message,
      type,
      id: notificationId,
    });

    if (duration) {
      setTimeout(() => {
        if (this.state.notification?.id === notificationId) {
          this.setState('notification', null);
        }
      }, duration);
    }
  }

  /**
   * Set current user
   * @param {object} user
   */
  setUser(user) {
    this.setState('user', user);
  }

  /**
   * Set selected doctor
   * @param {object} doctor
   */
  setDoctor(doctor) {
    this.setState('doctor', doctor);
  }

  /**
   * Set selected patient
   * @param {object} patient
   */
  setPatient(patient) {
    this.setState('patient', patient);
  }

  /**
   * Set current appointment
   * @param {object} appointment
   */
  setAppointment(appointment) {
    this.setState('appointment', appointment);
  }

  /**
   * Toggle sidebar
   */
  toggleSidebar() {
    this.setState('sidebar', !this.state.sidebar);
  }

  /**
   * Close sidebar
   */
  closeSidebar() {
    this.setState('sidebar', false);
  }

  /**
   * Change theme
   * @param {string} theme - 'dark' or 'light'
   */
  setTheme(theme) {
    this.setState('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('clinic_theme', theme);
  }

  /**
   * Get formatted state snapshot for debugging
   */
  getSnapshot() {
    return {
      timestamp: new Date().toISOString(),
      state: this.state,
      subscriberCount: Array.from(this.listeners.values()).reduce(
        (sum, arr) => sum + arr.length,
        0
      ),
    };
  }

  /**
   * Log state changes (for debugging)
   */
  enableLogging() {
    this.use((key, value, oldValue) => {
      console.log(
        `%c[Store] ${key}`,
        'color: #764ABC; font-weight: bold',
        `${oldValue} → ${value}`
      );
      return value;
    });
  }
}

/**
 * Global Store Instance
 * Usage:
 *   store.setState('user', { id: 1, name: 'John' })
 *   store.subscribe('user', (user) => console.log(user))
 *   store.getState('user')
 */
const store = new Store();

// Auto-load theme on init
store.setTheme(store.getState('theme'));

// Optional: Enable for debugging
// store.enableLogging();

export default store;
export { Store };
