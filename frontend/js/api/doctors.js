/** ═══════════════════════════════════════════════════════════════
 * 👨‍⚕️ Doctors API
 * ═══════════════════════════════════════════════════════════════ */

import { api } from './client.js';
import { getMockDoctors } from '../data/mockData.js';

export const doctorsApi = {
  /**
   * Get all doctors with fallback to mock data
   */
  async getAll() {
    try {
      console.log('📡 Getting all doctors...');
      const data = await api.getWithFallback('/doctors');
      console.log('✅ Doctors loaded:', data);
      return data;
    } catch (error) {
      console.error('❌ Failed to get doctors:', error);
      return getMockDoctors();
    }
  },

  /**
   * Get doctor by ID
   */
  async getById(id) {
    try {
      console.log(`📡 Getting doctor ${id}...`);
      const data = await api.getWithFallback(`/doctors/${id}`);
      console.log(`✅ Doctor ${id} loaded:`, data);
      return data;
    } catch (error) {
      console.error(`❌ Failed to get doctor ${id}:`, error);
      return null;
    }
  },

  /**
   * Create new doctor
   */
  async create(doctor) {
    try {
      console.log('📡 Creating doctor...', doctor);
      const data = await api.post('/doctors', doctor);
      console.log('✅ Doctor created:', data);
      return data;
    } catch (error) {
      console.error('❌ Failed to create doctor:', error);
      throw error;
    }
  },

  /**
   * Update doctor
   */
  async update(id, doctor) {
    try {
      console.log(`📡 Updating doctor ${id}...`, doctor);
      const data = await api.put(`/doctors/${id}`, doctor);
      console.log(`✅ Doctor ${id} updated:`, data);
      return data;
    } catch (error) {
      console.error(`❌ Failed to update doctor ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete doctor
   */
  async delete(id) {
    try {
      console.log(`📡 Deleting doctor ${id}...`);
      await api.delete(`/doctors/${id}`);
      console.log(`✅ Doctor ${id} deleted`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to delete doctor ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get doctors by specialization
   */
  async getBySpecialization(specialization) {
    try {
      console.log(`📡 Getting doctors with specialization: ${specialization}...`);
      const data = await api.getWithFallback(`/doctors?specialization=${specialization}`);
      console.log(`✅ Doctors for ${specialization} loaded:`, data);
      return data;
    } catch (error) {
      console.error(`❌ Failed to get doctors for ${specialization}:`, error);
      return [];
    }
  }
};

export default doctorsApi;
