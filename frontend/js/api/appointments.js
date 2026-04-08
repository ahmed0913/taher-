/** ═══════════════════════════════════════════════════════════════
 * 📅 Appointments API
 * ═══════════════════════════════════════════════════════════════ */

import { api } from './client.js';
import { getMockAppointments } from '../data/mockData.js';

export const appointmentsApi = {
  /**
   * Get all appointments with fallback to mock data
   */
  async getAll() {
    try {
      console.log('📡 Getting all appointments...');
      const data = await api.getWithFallback('/appointments');
      console.log('✅ Appointments loaded:', data);
      return data;
    } catch (error) {
      console.error('❌ Failed to get appointments:', error);
      return getMockAppointments();
    }
  },

  /**
   * Get appointment by ID
   */
  async getById(id) {
    try {
      console.log(`📡 Getting appointment ${id}...`);
      const data = await api.getWithFallback(`/appointments/${id}`);
      console.log(`✅ Appointment ${id} loaded:`, data);
      return data;
    } catch (error) {
      console.error(`❌ Failed to get appointment ${id}:`, error);
      return null;
    }
  },

  /**
   * Create new appointment (FIXED LOADING BUG)
   */
  async create(appointment) {
    try {
      console.log('📡 Creating appointment...', appointment);
      const data = await api.post('/appointments', appointment);
      console.log('✅ Appointment created:', data);
      return data;
    } catch (error) {
      console.error('❌ Failed to create appointment:', error);
      throw error;
    }
  },

  /**
   * Update appointment
   */
  async update(id, appointment) {
    try {
      console.log(`📡 Updating appointment ${id}...`, appointment);
      const data = await api.put(`/appointments/${id}`, appointment);
      console.log(`✅ Appointment ${id} updated:`, data);
      return data;
    } catch (error) {
      console.error(`❌ Failed to update appointment ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete appointment
   */
  async delete(id) {
    try {
      console.log(`📡 Deleting appointment ${id}...`);
      await api.delete(`/appointments/${id}`);
      console.log(`✅ Appointment ${id} deleted`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to delete appointment ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get appointments by patient
   */
  async getByPatient(patientId) {
    try {
      console.log(`📡 Getting appointments for patient ${patientId}...`);
      const data = await api.getWithFallback(`/appointments?patient_id=${patientId}`);
      console.log(`✅ Patient ${patientId} appointments loaded:`, data);
      return data;
    } catch (error) {
      console.error(`❌ Failed to get patient appointments:`, error);
      return [];
    }
  },

  /**
   * Get appointments by doctor
   */
  async getByDoctor(doctorId) {
    try {
      console.log(`📡 Getting appointments for doctor ${doctorId}...`);
      const data = await api.getWithFallback(`/appointments?doctor_id=${doctorId}`);
      console.log(`✅ Doctor ${doctorId} appointments loaded:`, data);
      return data;
    } catch (error) {
      console.error(`❌ Failed to get doctor appointments:`, error);
      return [];
    }
  },

  /**
   * Get appointments by date
   */
  async getByDate(date) {
    try {
      console.log(`📡 Getting appointments for date ${date}...`);
      const data = await api.getWithFallback(`/appointments?date=${date}`);
      console.log(`✅ Appointments for ${date} loaded:`, data);
      return data;
    } catch (error) {
      console.error(`❌ Failed to get appointments by date:`, error);
      return [];
    }
  }
};

export default appointmentsApi;
