/** ═══════════════════════════════════════════════════════════════
 * 📊 MOCK DATA - Demo Data for Offline/Demo Mode
 * ═══════════════════════════════════════════════════════════════ */

export const mockDoctors = [
  {
    id: 1,
    name: 'Dr. Ahmed Hassan',
    specialization: 'Cardiology',
    image: 'images/doctor-1.jpg',
    rating: 4.9,
    reviews: 187,
    nextAvailable: '2026-08-01',
    price: 500,
    bio: 'Expert cardiologist with 15+ years of experience',
    availability: ['09:00', '10:30', '14:00', '15:30']
  },
  {
    id: 2,
    name: 'Dr. Sara Mahmoud',
    specialization: 'Dermatology',
    image: 'images/doctor-2.jpg',
    rating: 4.8,
    reviews: 142,
    nextAvailable: '2026-08-02',
    price: 450,
    bio: 'Specialized in skin care and treatments',
    availability: ['10:00', '11:30', '13:00', '16:00']
  },
  {
    id: 3,
    name: 'Dr. Omar Khaled',
    specialization: 'Orthopedics',
    image: 'images/doctor-3.jpg',
    rating: 4.7,
    reviews: 156,
    nextAvailable: '2026-08-03',
    price: 480,
    bio: 'Specialist in bone and joint health',
    availability: ['08:30', '10:00', '15:00', '16:30']
  },
  {
    id: 4,
    name: 'Dr. Nadia Farouk',
    specialization: 'Pediatrics',
    image: 'images/doctor-4.jpg',
    rating: 4.85,
    reviews: 201,
    nextAvailable: '2026-08-04',
    price: 400,
    bio: 'Dedicated to children\'s health and development',
    availability: ['09:00', '10:30', '13:00', '14:30']
  },
  {
    id: 5,
    name: 'Dr. Youssef Nabil',
    specialization: 'Neurology',
    image: 'images/doctor-5.jpg',
    rating: 4.92,
    reviews: 218,
    nextAvailable: '2026-08-05',
    price: 550,
    bio: 'Expert in neurological disorders and treatment',
    availability: ['08:00', '09:30', '14:00', '16:00']
  }
];

export const mockPatients = [
  { 
    id: 1, 
    name: 'Mohamed Ali', 
    phone: '01001234567', 
    email: 'mohamed@email.com',
    age: 35,
    gender: 'Male',
    bloodType: 'O+',
    allergies: 'None'
  },
  { 
    id: 2, 
    name: 'Hana Mostafa', 
    phone: '01112345678', 
    email: 'hana@email.com',
    age: 28,
    gender: 'Female',
    bloodType: 'A+',
    allergies: 'Penicillin'
  },
  { 
    id: 3, 
    name: 'Karim Samy', 
    phone: '01223456789', 
    email: 'karim@email.com',
    age: 42,
    gender: 'Male',
    bloodType: 'B+',
    allergies: 'None'
  },
  { 
    id: 4, 
    name: 'Laila Adel', 
    phone: '01334567890', 
    email: 'laila@email.com',
    age: 31,
    gender: 'Female',
    bloodType: 'AB+',
    allergies: 'Iodine'
  },
  { 
    id: 5, 
    name: 'Tarek Ibrahim', 
    phone: '01445678901', 
    email: 'tarek@email.com',
    age: 38,
    gender: 'Male',
    bloodType: 'O-',
    allergies: 'None'
  }
];

export const mockAppointments = [
  { id: 1, patient_id: 1, doctor_id: 1, date: '2026-08-01' },
  { id: 2, patient_id: 2, doctor_id: 2, date: '2026-08-02' },
  { id: 3, patient_id: 3, doctor_id: 1, date: '2026-08-03' },
  { id: 4, patient_id: 4, doctor_id: 3, date: '2026-08-04' },
  { id: 5, patient_id: 5, doctor_id: 4, date: '2026-08-05' }
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
