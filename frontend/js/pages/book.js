/** ═══════════════════════════════════════════════════════════════
 * 📅 Book Appointment Page - WITH LOADING BUG FIX & NULL SAFETY
 * ═══════════════════════════════════════════════════════════════ */

import { appointmentsApi } from '../api/appointments.js';
import { doctorsApi } from '../api/doctors.js';
import { patientsApi } from '../api/patients.js';
import { toast } from '../ui/toast.js';
import { validators } from '../utils/validators.js';
import { storage } from '../utils/storage.js';
import { createSkeletonList } from '../ui/loader.js';
import { dom } from '../utils/dom.js';

export class BookPage {
  constructor() {
    this.name = 'book';
    this.doctors = [];
    this.patients = [];
    this.currentStep = 1;
    this.formData = storage.getAppointmentDraft() || {
      patient: null,
      doctor: null,
      date: null,
      time: null,
      isNewPatient: false
    };
    this.container = null;
    this.selectedTimeSlot = null;
  }

  /**
   * Render booking page with loading fix and null safety
   */
  async render(container) {
    console.log('📖 Rendering Book Appointment Page');

    if (!container) {
      console.error('❌ No container provided to BookPage');
      return;
    }

    this.container = container;

    // Build initial HTML
    const html = `
      <main class="book-page">
        <section style="padding: 2rem 1rem;">
          <div class="container" style="max-width: 600px;">
            <h1 style="margin-bottom: 1rem;">📅 Book an Appointment</h1>

            <!-- Progress Bar -->
            <div class="progress" style="margin-bottom: 2rem;">
              <div class="progress-bar" id="progress-bar" style="width: 33%; transition: width 250ms;"></div>
            </div>

            <!-- Loading Skeleton -->
            <div id="booking-loading"></div>

            <!-- Form Container -->
            <div id="booking-form" style="display: none;"></div>

            <!-- Success Message -->
            <div id="booking-success" style="display: none; text-align: center;">
              <div style="font-size: 4rem; margin-bottom: 1rem;">🎉</div>
              <h2 style="margin-bottom: 1rem;">Appointment Booked!</h2>
              <p style="color: var(--text-secondary); margin-bottom: 2rem;">
                Your appointment has been successfully scheduled.
              </p>
              <button class="btn btn-primary" id="view-appointments-btn" style="cursor: pointer;">
                View My Appointments
              </button>
            </div>

            <!-- Error Message -->
            <div id="booking-error" style="display: none;">
              <div style="
                background: rgba(255, 107, 107, 0.1);
                border: 1px solid var(--error);
                border-radius: 0.5rem;
                padding: 1rem;
                color: var(--error);
                margin-bottom: 1rem;
              ">
                <strong>Error:</strong> <span id="error-message"></span>
              </div>
              <button class="btn btn-outline" id="try-again-btn" style="cursor: pointer;">
                Try Again
              </button>
            </div>
          </div>
        </section>
      </main>
    `;

    // Set HTML safely
    dom.safeSetHTML(container, html);

    // Load data with timeout and fallback
    await this.loadBookingData();

    // Render form
    this.renderForm();

    // Setup event listeners
    this.setupEventListeners();
  }

  /**
   * Load doctors and patients with timeout
   */
  async loadBookingData() {
    const loadingDiv = dom.safeQuery('#booking-loading', this.container);
    if (!loadingDiv) {
      console.error('❌ Loading div not found');
      return;
    }

    const skeleton = createSkeletonList(3);
    if (skeleton) {
      loadingDiv.appendChild(skeleton);
    }

    try {
      console.log('⏳ Loading doctors and patients...');

      // Use Promise.race to enforce timeout
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Loading timeout')), 3000)
      );

      const loadPromise = Promise.all([
        doctorsApi.getAll(),
        patientsApi.getAll()
      ]);

      [this.doctors, this.patients] = await Promise.race([loadPromise, timeoutPromise]);

      console.log('✅ Data loaded:', { doctors: this.doctors.length, patients: this.patients.length });
      dom.safeSetStyle(loadingDiv, 'display', 'none');

    } catch (error) {
      console.error('❌ Loading failed (timeout or error):', error);

      // Fallback to mock data
      this.doctors = await doctorsApi.getAll();
      this.patients = await patientsApi.getAll();

      dom.safeSetStyle(loadingDiv, 'display', 'none');
    }
  }

  /**
   * Render form based on current step
   */
  renderForm() {
    const formDiv = dom.safeQuery('#booking-form', this.container);

    if (!formDiv) {
      console.error('❌ Form div not found');
      return;
    }

    let html = '';

    if (this.currentStep === 1) {
      html = this.renderPatientStep();
    } else if (this.currentStep === 2) {
      html = this.renderDoctorStep();
    } else if (this.currentStep === 3) {
      html = this.renderDateStep();
    }

    dom.safeSetHTML(formDiv, html);
    dom.safeSetStyle(formDiv, 'display', 'block');
    this.updateProgressBar();
  }

  /**
   * Step 1: Select Patient
   */
  renderPatientStep() {
    return `
      <div class="card">
        <h2 style="margin-bottom: 1.5rem;">Step 1: Select Patient</h2>

        <div class="form-group">
          <label>Existing Patient</label>
          <select id="patient-select" style="
            background: var(--surface-secondary);
            border: 1px solid var(--border);
            border-radius: 0.5rem;
            padding: 0.75rem;
            cursor: pointer;
            width: 100%;
          ">
            <option value="">-- Select or create patient --</option>
            ${this.patients.map(p => `<option value="${p.id}">${p.name} (${p.email})</option>`).join('')}
          </select>
        </div>

        <div style="text-align: center; margin: 1.5rem 0; color: var(--text-secondary);">OR</div>

        <div class="form-group">
          <label>New Patient - Email</label>
          <input type="email" id="patient-email" placeholder="your@email.com" style="width: 100%; padding: 0.75rem; background: var(--surface-secondary); border: 1px solid var(--border); border-radius: 0.5rem; box-sizing: border-box;" />
        </div>

        <div class="form-group">
          <label>Name</label>
          <input type="text" id="patient-name" placeholder="Full Name" style="width: 100%; padding: 0.75rem; background: var(--surface-secondary); border: 1px solid var(--border); border-radius: 0.5rem; box-sizing: border-box;" />
        </div>

        <div class="form-group">
          <label>Phone</label>
          <input type="tel" id="patient-phone" placeholder="Phone number" style="width: 100%; padding: 0.75rem; background: var(--surface-secondary); border: 1px solid var(--border); border-radius: 0.5rem; box-sizing: border-box;" />
        </div>

        <div style="display: flex; gap: 1rem; margin-top: 2rem;">
          <button class="btn btn-primary" id="next-step-1" style="flex: 1; cursor: pointer;">
            Next Step →
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Step 2: Select Doctor
   */
  renderDoctorStep() {
    return `
      <div class="card">
        <h2 style="margin-bottom: 1.5rem;">Step 2: Select Doctor</h2>

        <div id="doctors-list" style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2rem;">
          ${this.doctors.map(doctor => `
            <div class="doctor-chip" data-doctor-id="${doctor.id}" style="
              padding: 1rem;
              cursor: pointer;
              border: 2px solid var(--border);
              transition: all 250ms;
              background: transparent;
              border-radius: 0.5rem;
            ">
              <strong>${doctor.name}</strong>
              <div style="font-size: 0.875rem; color: var(--text-secondary);">
                ${doctor.specialization}
              </div>
            </div>
          `).join('')}
        </div>

        <input type="hidden" id="doctor-select" />

        <div style="display: flex; gap: 1rem;">
          <button class="btn btn-outline" id="prev-step-2" style="flex: 1; cursor: pointer;">
            ← Back
          </button>
          <button class="btn btn-primary" id="next-step-2" style="flex: 1; cursor: pointer;">
            Next Step →
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Step 3: Select Date & Time
   */
  renderDateStep() {
    const selectedDate = this.formData.date;
    const timeSlots = selectedDate ? this.generateTimeSlots(selectedDate) : [];

    return `
      <div class="card">
        <h2 style="margin-bottom: 1.5rem;">Step 3: Choose Date & Time</h2>

        <div class="form-group">
          <label>Appointment Date</label>
          <input type="date" id="appointment-date" value="${selectedDate || ''}" min="${new Date().toISOString().split('T')[0]}" style="
            background: var(--surface-secondary);
            border: 1px solid var(--border);
            border-radius: 0.5rem;
            padding: 0.75rem;
            cursor: pointer;
            width: 100%;
            box-sizing: border-box;
            color: var(--text);
          " />
        </div>

        <div id="date-error" style="
          color: var(--error);
          font-size: 0.875rem;
          display: none;
          margin-bottom: 1rem;
        "></div>

        ${selectedDate ? `
          <div style="margin-top: 1.5rem;">
            <label style="display: block; margin-bottom: 0.75rem;">Available Time Slots</label>
            <div class="time-slots-grid">
              ${timeSlots.map(slot => `
                <button 
                  type="button"
                  class="time-slot ${slot.available ? '' : 'unavailable'} ${this.formData.time === slot.time ? 'selected' : ''}"
                  data-time="${slot.time}"
                  style="cursor: ${slot.available ? 'pointer' : 'not-allowed'};"
                  ${!slot.available ? 'disabled' : ''}
                >
                  ${slot.time}
                </button>
              `).join('')}
            </div>
            <div id="time-error" style="
              color: var(--error);
              font-size: 0.875rem;
              display: none;
              margin-top: 1rem;
            "></div>
          </div>
        ` : ''}

        <div style="display: flex; gap: 1rem; margin-top: 2rem;">
          <button class="btn btn-outline" id="prev-step-3" style="flex: 1; cursor: pointer;">
            ← Back
          </button>
          <button class="btn btn-primary" id="confirm-booking-btn" style="flex: 1; cursor: pointer;">
            ✅ Confirm Booking
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Generate time slots for a given date
   */
  generateTimeSlots(date) {
    const slots = [];
    const startHour = 9;  // 9 AM
    const endHour = 17;   // 5 PM
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let min of ['00', '30']) {
        const isPM = hour >= 12;
        const displayHour = hour % 12 || 12;
        const displayMin = min;
        const period = isPM ? 'PM' : 'AM';
        const time = `${displayHour}:${displayMin} ${period}`;
        
        // Mock: 70% of slots are available
        const available = Math.random() > 0.3;
        
        slots.push({
          time: time,
          available: available
        });
      }
    }
    
    return slots;
  }

  /**
   * Validate booking data
   */
  validateStep(step) {
    switch(step) {
      case 1:
        return this.formData.patient !== null;
      case 2:
        return this.formData.doctor !== null;
      case 3:
        return this.formData.date !== null && this.formData.time !== null;
      default:
        return false;
    }
    }

  /**
   * Setup all event listeners
   */
  setupEventListeners() {
    // Step 1 - Next button
    const nextBtn1 = dom.safeQuery('#next-step-1', this.container);
    if (nextBtn1) {
      dom.safeAddListener(nextBtn1, 'click', () => this.handleNextStep());
    }

    // Step 2 - Doctor selection
    const doctorChips = dom.safeQueryAll('.doctor-chip', this.container);
    doctorChips.forEach(chip => {
      dom.safeAddListener(chip, 'click', () => this.handleDoctorClick(chip));
    });

    const prevBtn2 = dom.safeQuery('#prev-step-2', this.container);
    if (prevBtn2) {
      dom.safeAddListener(prevBtn2, 'click', () => this.handlePrevStep());
    }

    const nextBtn2 = dom.safeQuery('#next-step-2', this.container);
    if (nextBtn2) {
      dom.safeAddListener(nextBtn2, 'click', () => this.handleNextStep());
    }

    // Step 3 - Date, time and confirm
    const dateInput = dom.safeQuery('#appointment-date', this.container);
    if (dateInput) {
      dom.safeAddListener(dateInput, 'change', (e) => {
        this.formData.date = e.target.value;
        this.formData.time = null; // Reset time when date changes
        storage.saveAppointmentDraft(this.formData);
        this.renderForm();
        this.setupEventListeners();
      });
    }

    // Time slot selection
    const timeSlots = dom.safeQueryAll('.time-slot:not(.unavailable)', this.container);
    timeSlots.forEach(slot => {
      dom.safeAddListener(slot, 'click', (e) => {
        e.preventDefault();
        const time = dom.safeGetAttr(slot, 'data-time');
        
        // Deselect all
        const allSlots = dom.safeQueryAll('.time-slot', this.container);
        allSlots.forEach(s => dom.safeRemoveClass(s, 'selected'));
        
        // Select this one
        dom.safeAddClass(slot, 'selected');
        this.formData.time = time;
        storage.saveAppointmentDraft(this.formData);
      });
    });

    const prevBtn3 = dom.safeQuery('#prev-step-3', this.container);
    if (prevBtn3) {
      dom.safeAddListener(prevBtn3, 'click', () => this.handlePrevStep());
    }

    const confirmBtn = dom.safeQuery('#confirm-booking-btn', this.container);
    if (confirmBtn) {
      dom.safeAddListener(confirmBtn, 'click', () => this.handleConfirmBooking());
    }

    // Success page button
    const viewApptsBtn = dom.safeQuery('#view-appointments-btn', this.container);
    if (viewApptsBtn) {
      dom.safeAddListener(viewApptsBtn, 'click', () => {
        if (window.app) window.app.navigate('history');
      });
    }

    // Error page button
    const tryAgainBtn = dom.safeQuery('#try-again-btn', this.container);
    if (tryAgainBtn) {
      dom.safeAddListener(tryAgainBtn, 'click', () => location.reload());
    }
  }

  /**
   * Handle doctor selection
   */
  handleDoctorClick(chip) {
    const doctorId = dom.safeGetAttr(chip, 'data-doctor-id');
    if (!doctorId) return;

    // Highlight selected doctor
    const chips = dom.safeQueryAll('.doctor-chip', this.container);
    chips.forEach(c => {
      dom.safeSetStyle(c, 'borderColor', 'var(--border)');
      dom.safeSetStyle(c, 'background', 'transparent');
    });

    // Highlight this one
    dom.safeSetStyle(chip, 'borderColor', 'var(--primary)');
    dom.safeSetStyle(chip, 'background', 'rgba(79, 172, 254, 0.1)');

    // Store selection
    const selectInput = dom.safeQuery('#doctor-select', this.container);
    if (selectInput) {
      dom.safeSetAttr(selectInput, 'value', doctorId);
    }
  }

  /**
   * Handle next step validation
   */
  handleNextStep() {
    if (this.currentStep === 1) {
      const selectedId = dom.safeQuery('#patient-select', this.container)?.value;
      const email = dom.safeQuery('#patient-email', this.container)?.value;
      const name = dom.safeQuery('#patient-name', this.container)?.value;
      const phone = dom.safeQuery('#patient-phone', this.container)?.value;

      if (selectedId) {
        // Using existing patient
        this.formData.patient = parseInt(selectedId);
        this.formData.isNewPatient = false;
      } else if (email || name || phone) {
        // Creating new patient
        if (!email || !name || !phone) {
          toast.error('Please enter all patient details');
          return;
        }
        const validation = validators.validatePatient({ name, email, phone });
        if (!validation.isValid) {
          toast.error(validation.errors[0]);
          return;
        }
        this.formData.patient = { name, email, phone };
        this.formData.isNewPatient = true;
      } else {
        toast.error('Please select an existing patient or enter new patient details');
        return;
      }

      this.currentStep = 2;
    } else if (this.currentStep === 2) {
      const doctorId = dom.safeQuery('#doctor-select', this.container)?.value;
      if (!doctorId) {
        toast.error('Please select a doctor');
        return;
      }
      this.formData.doctor = parseInt(doctorId);
      this.currentStep = 3;
    }

    storage.saveAppointmentDraft(this.formData);
    this.renderForm();
    this.setupEventListeners();
  }

  /**
   * Handle previous step
   */
  handlePrevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
    this.renderForm();
    this.setupEventListeners();
  }

  /**
   * Handle confirm booking
   */
  async handleConfirmBooking() {
    const appointmentDate = this.formData.date;
    const appointmentTime = this.formData.time;
    const dateError = dom.safeQuery('#date-error', this.container);
    const timeError = dom.safeQuery('#time-error', this.container);

    if (!appointmentDate) {
      if (dateError) {
        dom.safeSetText(dateError, 'Please select a date');
        dom.safeSetStyle(dateError, 'display', 'block');
      }
      return;
    }

    if (!appointmentTime) {
      if (timeError) {
        dom.safeSetText(timeError, 'Please select a time');
        dom.safeSetStyle(timeError, 'display', 'block');
      }
      return;
    }

    try {
      console.log('📡 Creating appointment...');
      const formDiv = dom.safeQuery('#booking-form', this.container);
      if (formDiv) dom.safeSetStyle(formDiv, 'display', 'none');

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Generate appointment ID
      const appointmentId = `APT-${Date.now()}`;
      const selectedDoctor = this.doctors.find(d => d.id === this.formData.doctor);

      // Create appointment object
      const appointment = {
        id: appointmentId,
        patient: this.formData.patient,
        isNewPatient: this.formData.isNewPatient,
        doctor: selectedDoctor,
        date: appointmentDate,
        time: appointmentTime,
        status: 'confirmed',
        createdAt: new Date().toISOString()
      };

      // Save to localStorage
      const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
      appointments.push(appointment);
      localStorage.setItem('appointments', JSON.stringify(appointments));

      console.log('✅ Appointment confirmed:', appointment);

      storage.clearAppointmentDraft();

      // Save patient data for Profile page
      if (this.formData.isNewPatient && typeof this.formData.patient === 'object') {
        storage.savePatient(this.formData.patient);
      } else if (!this.formData.isNewPatient) {
        const patientObj = this.patients.find(p => p.id === this.formData.patient);
        if (patientObj) {
          storage.savePatient(patientObj);
        }
      }

      const successDiv = dom.safeQuery('#booking-success', this.container);
      if (successDiv) {
        dom.safeSetHTML(successDiv, `
          <div style="font-size: 4rem; margin-bottom: 1rem;">🎉</div>
          <h2 style="margin-bottom: 1rem;">Appointment Booked!</h2>
          <div style="
            background: rgba(0, 195, 255, 0.1);
            border: 1px solid var(--neon-blue);
            border-radius: 0.75rem;
            padding: 1.5rem;
            margin-bottom: 2rem;
            text-align: left;
          ">
            <div style="margin-bottom: 1rem;">
              <strong style="color: var(--neon-blue);">Confirmation ID:</strong><br/>
              <code style="color: var(--text-secondary);">${appointmentId}</code>
            </div>
            <div style="margin-bottom: 1rem;">
              <strong style="color: var(--neon-blue);">Doctor:</strong><br/>
              <span style="color: var(--text-secondary);">${selectedDoctor.name} - ${selectedDoctor.specialization}</span>
            </div>
            <div style="margin-bottom: 1rem;">
              <strong style="color: var(--neon-blue);">Date & Time:</strong><br/>
              <span style="color: var(--text-secondary);">${appointmentDate} at ${appointmentTime}</span>
            </div>
          </div>
          <p style="color: var(--text-secondary); margin-bottom: 2rem;">
            A confirmation email has been sent to your registered email address.
          </p>
          <button class="btn btn-primary" id="view-appointments-btn" style="cursor: pointer;">
            📅 View My Appointments
          </button>
        `);
        dom.safeSetStyle(successDiv, 'display', 'block');
        
        // Re-attach listener
        const viewBtn = dom.safeQuery('#view-appointments-btn', this.container);
        if (viewBtn) {
          dom.safeAddListener(viewBtn, 'click', () => {
            if (window.app) window.app.navigate('history');
          });
        }
      }
      toast.success('Appointment booked successfully!');

    } catch (error) {
      console.error('❌ Booking failed:', error);
      const errorDiv = dom.safeQuery('#booking-error', this.container);
      if (errorDiv) dom.safeSetStyle(errorDiv, 'display', 'block');

      const errorMsg = dom.safeQuery('#error-message', this.container);
      if (errorMsg) {
        dom.safeSetText(errorMsg, error.message || 'Failed to create appointment');
      }
      toast.error('Failed to book appointment');
    }
  }

  /**
   * Update progress bar
   */
  updateProgressBar() {
    const progress = (this.currentStep / 3) * 100;
    const progressBar = dom.safeQuery('#progress-bar', this.container);
    if (progressBar) {
      dom.safeSetStyle(progressBar, 'width', progress + '%');
    }
  }
}

export default BookPage;
