/** ═══════════════════════════════════════════════════════════════
 * 📊 MOCK DATA - Demo Data for Offline/Demo Mode
 * ═══════════════════════════════════════════════════════════════ */

export const mockDoctors = [
  { id: 1, name: 'Dr. Ahmed Hassan', specialization: 'Cardiology' },
  { id: 2, name: 'Dr. Sara Mahmoud', specialization: 'Dermatology' },
  { id: 3, name: 'Dr. Omar Khaled', specialization: 'Orthopedics' },
  { id: 4, name: 'Dr. Nadia Farouk', specialization: 'Pediatrics' },
  { id: 5, name: 'Dr. Youssef Nabil', specialization: 'Neurology' }
];

export const mockPatients = [
  { id: 1, name: 'Mohamed Ali', phone: '01001234567', email: 'mohamed@email.com' },
  { id: 2, name: 'Hana Mostafa', phone: '01112345678', email: 'hana@email.com' },
  { id: 3, name: 'Karim Samy', phone: '01223456789', email: 'karim@email.com' },
  { id: 4, name: 'Laila Adel', phone: '01334567890', email: 'laila@email.com' },
  { id: 5, name: 'Tarek Ibrahim', phone: '01445678901', email: 'tarek@email.com' }
];

export const mockAppointments = [
  { id: 1, patient_id: 1, doctor_id: 1, date: '2025-08-01' },
  { id: 2, patient_id: 2, doctor_id: 2, date: '2025-08-02' },
  { id: 3, patient_id: 3, doctor_id: 1, date: '2025-08-03' },
  { id: 4, patient_id: 4, doctor_id: 3, date: '2025-08-04' },
  { id: 5, patient_id: 5, doctor_id: 4, date: '2025-08-05' }
];

export const mockData = {
  doctors: mockDoctors,
  patients: mockPatients,
  appointments: mockAppointments
};

/**
 * Get copy of mock data
 */
export function getMockData() {
  return JSON.parse(JSON.stringify(mockData));
}

/**
 * Get doctors
 */
export function getMockDoctors() {
  return JSON.parse(JSON.stringify(mockDoctors));
}

/**
 * Get patients
 */
export function getMockPatients() {
  return JSON.parse(JSON.stringify(mockPatients));
}

/**
 * Get appointments
 */
export function getMockAppointments() {
  return JSON.parse(JSON.stringify(mockAppointments));
}

/**
 * Get doctor by ID
 */
export function getMockDoctorById(id) {
  return mockDoctors.find(d => d.id === parseInt(id));
}

/**
 * Get patient by ID
 */
export function getMockPatientById(id) {
  return mockPatients.find(p => p.id === parseInt(id));
}

/**
 * Get appointments for patient
 */
export function getMockPatientAppointments(patientId) {
  return mockAppointments.filter(a => a.patient_id === parseInt(patientId));
}

/**
 * Get appointments for doctor
 */
export function getMockDoctorAppointments(doctorId) {
  return mockAppointments.filter(a => a.doctor_id === parseInt(doctorId));
}
