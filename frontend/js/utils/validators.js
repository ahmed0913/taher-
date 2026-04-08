/** ═══════════════════════════════════════════════════════════════
 * ✅ Form Validators
 * ═══════════════════════════════════════════════════════════════ */

export const validators = {
  /**
   * Validate email
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Validate phone (Egyptian format)
   */
  isValidPhone(phone) {
    // Accept 10-15 digits, with optional + and -
    const phoneRegex = /^[\d\s+\-()]+$/;
    const cleaned = phone.replace(/\D/g, '');
    return phoneRegex.test(phone) && cleaned.length >= 10;
  },

  /**
   * Validate name
   */
  isValidName(name) {
    return name && name.trim().length >= 3 && name.trim().length <= 100;
  },

  /**
   * Validate date (YYYY-MM-DD or future date)
   */
  isValidDate(dateString) {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
  },

  /**
   * Validate future date
   */
  isFutureDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  },

  /**
   * Validate specialization
   */
  isValidSpecialization(spec) {
    const validSpecs = ['Cardiology', 'Dermatology', 'Orthopedics', 'Pediatrics', 'Neurology'];
    return validSpecs.includes(spec);
  },

  /**
   * Validate appointment form
   */
  validateAppointment(appointment) {
    const errors = [];

    if (!appointment.patient_id || isNaN(appointment.patient_id)) {
      errors.push('Please select a patient');
    }

    if (!appointment.doctor_id || isNaN(appointment.doctor_id)) {
      errors.push('Please select a doctor');
    }

    if (!this.isValidDate(appointment.date)) {
      errors.push('Please select a valid date');
    }

    if (!this.isFutureDate(appointment.date)) {
      errors.push('Appointment date must be in the future');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  /**
   * Validate patient form
   */
  validatePatient(patient) {
    const errors = [];

    if (!this.isValidName(patient.name)) {
      errors.push('Name must be 3-100 characters');
    }

    if (!this.isValidEmail(patient.email)) {
      errors.push('Please enter a valid email');
    }

    if (!this.isValidPhone(patient.phone)) {
      errors.push('Please enter a valid phone number');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
};

export default validators;
