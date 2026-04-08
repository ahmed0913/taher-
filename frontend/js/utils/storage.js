/** ═══════════════════════════════════════════════════════════════
 * 💾 Storage Helpers - localStorage & sessionStorage Wrappers
 * ═══════════════════════════════════════════════════════════════ */

export const storage = {
  prefix: 'clinic-',

  /**
   * Set item in localStorage
   */
  set(key, value) {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(this.prefix + key, serialized);
      console.log(`💾 Stored: ${key}`);
    } catch (error) {
      console.error(`❌ Failed to store ${key}:`, error);
    }
  },

  /**
   * Get item from localStorage
   */
  get(key) {
    try {
      const value = localStorage.getItem(this.prefix + key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error(`❌ Failed to retrieve ${key}:`, error);
      return null;
    }
  },

  /**
   * Remove item from localStorage
   */
  remove(key) {
    try {
      localStorage.removeItem(this.prefix + key);
      console.log(`🗑️ Removed: ${key}`);
    } catch (error) {
      console.error(`❌ Failed to remove ${key}:`, error);
    }
  },

  /**
   * Clear all prefixed items
   */
  clear() {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
      console.log('🗑️ Storage cleared');
    } catch (error) {
      console.error('❌ Failed to clear storage:', error);
    }
  },

  /**
   * Check if key exists
   */
  has(key) {
    return localStorage.getItem(this.prefix + key) !== null;
  },

  /**
   * Get all items
   */
  getAll() {
    const result = {};
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          const cleanKey = key.substring(this.prefix.length);
          result[cleanKey] = this.get(cleanKey);
        }
      });
    } catch (error) {
      console.error('❌ Failed to get all items:', error);
    }
    return result;
  },

  /**
   * Save current patient data
   */
  savePatient(patient) {
    this.set('patient', patient);
  },

  /**
   * Get current patient data
   */
  getPatient() {
    return this.get('patient');
  },

  /**
   * Save appointment draft
   */
  saveAppointmentDraft(draft) {
    this.set('appointment-draft', draft);
  },

  /**
   * Get appointment draft
   */
  getAppointmentDraft() {
    return this.get('appointment-draft');
  },

  /**
   * Clear appointment draft
   */
  clearAppointmentDraft() {
    this.remove('appointment-draft');
  }
};

export default storage;
