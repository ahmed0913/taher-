/** ═══════════════════════════════════════════════════════════════
 * 👥 Patients API
 * ═══════════════════════════════════════════════════════════════ */

import { api } from './client.js';
import { getMockPatients } from '../data/mockData.js';

export const patientsApi = {
  /**
   * Get all patients with fallback to mock data
   */
  async getAll() {
    try {
      console.log('📡 Getting all patients...');
      const data = await api.getWithFallback('/patients');
      console.log('✅ Patients loaded:', data);
      return data;
    } catch (error) {
      console.error('❌ Failed to get patients:', error);
      return getMockPatients();
    }
  },

  /**
   * Get patient by ID
   */
  async getById(id) {
    try {
      console.log(`📡 Getting patient ${id}...`);
      const data = await api.getWithFallback(`/patients/${id}`);
      console.log(`✅ Patient ${id} loaded:`, data);
      return data;
    } catch (error) {
      console.error(`❌ Failed to get patient ${id}:`, error);
      return null;
    }
  },

  /**
   * Create new patient
   */
  async create(patient) {
    try {
      console.log('📡 Creating patient...', patient);
      const data = await api.post('/patients', patient);
      console.log('✅ Patient created:', data);
      return data;
    } catch (error) {
      console.error('❌ Failed to create patient:', error);
      throw error;
    }
  },

  /**
   * Update patient
   */
  async update(id, patient) {
    try {
      console.log(`📡 Updating patient ${id}...`, patient);
      const data = await api.put(`/patients/${id}`, patient);
      console.log(`✅ Patient ${id} updated:`, data);
      return data;
    } catch (error) {
      console.error(`❌ Failed to update patient ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete patient
   */
  async delete(id) {
    try {
      console.log(`📡 Deleting patient ${id}...`);
      await api.delete(`/patients/${id}`);
      console.log(`✅ Patient ${id} deleted`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to delete patient ${id}:`, error);
      throw error;
    }
  },

  /**
   * Search patients by email
   */
  async searchByEmail(email) {
    try {
      console.log(`📡 Searching patient by email: ${email}...`);
      const data = await api.getWithFallback(`/patients?email=${email}`);
      console.log(`✅ Patient found:`, data);
      return data;
    } catch (error) {
      console.error(`❌ Failed to search patient by email:`, error);
      return null;
    }
  },

  /**
   * Search patients by phone
   */
  async searchByPhone(phone) {
    try {
      console.log(`📡 Searching patient by phone: ${phone}...`);
      const data = await api.getWithFallback(`/patients?phone=${phone}`);
      console.log(`✅ Patient found:`, data);
      return data;
    } catch (error) {
      console.error(`❌ Failed to search patient by phone:`, error);
      return null;
    }
  }
};

export default patientsApi;
