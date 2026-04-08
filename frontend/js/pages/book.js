/** ═══════════════════════════════════════════════════════════════
 * 📅 Book Appointment Page - WITH LOADING BUG FIX
 * ═══════════════════════════════════════════════════════════════ */

import { appointmentsApi } from '../api/appointments.js';
import { doctorsApi } from '../api/doctors.js';
import { patientsApi } from '../api/patients.js';
import { toast } from '../ui/toast.js';
import { validators } from '../utils/validators.js';
import { storage } from '../utils/storage.js';
import { createSkeletonList } from '../ui/loader.js';

export class BookPage {
  constructor() {
    this.name = 'book';
    this.doctors = [];
    this.patients = [];
    this.currentStep = 1;
    this.formData = storage.getAppointmentDraft() || {};
  }

  /**
   * Render booking page with loading fix
   */
  async render(container) {
    console.log('📖 Rendering Book Appointment Page');

    container.innerHTML = `
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
              <button class="btn btn-primary" onclick="app.navigate('history')" style="cursor: pointer;">
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
              <button class="btn btn-outline" onclick="location.reload()" style="cursor: pointer;">
                Try Again
              </button>
            </div>
          </div>
        </section>
      </main>
    `;

    // Load data with timeout and fallback
    await this.loadBookingData(container);

    // Render form
    this.renderForm(container);
  }

  /**
   * Load doctors and patients with timeout
   */
  async loadBookingData(container) {
    const loadingDiv = container.querySelector('#booking-loading');
    loadingDiv.appendChild(createSkeletonList(3));

    try {
      console.log('⏳ Loading doctors and patients...');

      // Use Promise.race to enforce timeout
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Loading timeout')), 5000)
      );

      const loadPromise = Promise.all([
        doctorsApi.getAll(),
        patientsApi.getAll()
      ]);

      [this.doctors, this.patients] = await Promise.race([loadPromise, timeoutPromise]);

      console.log('✅ Data loaded:', { doctors: this.doctors.length, patients: this.patients.length });
      loadingDiv.style.display = 'none';

    } catch (error) {
      console.error('❌ Loading failed (timeout or error):', error);
      toast.error('API not responding. Using demo data.', 5000);

      // Fallback to mock data
      this.doctors = await doctorsApi.getAll();
      this.patients = await patientsApi.getAll();

      loadingDiv.style.display = 'none';
    }
  }

  /**
   * Render form based on current step
   */
  renderForm(container) {
    const formDiv = container.querySelector('#booking-form');

    if (this.currentStep === 1) {
      formDiv.innerHTML = this.renderPatientStep();
    } else if (this.currentStep === 2) {
      formDiv.innerHTML = this.renderDoctorStep();
    } else if (this.currentStep === 3) {
      formDiv.innerHTML = this.renderDateStep();
    }

    formDiv.style.display = 'block';
    this.updateProgressBar();

    // Attach event listeners
    this.attachFormListeners(container);
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
          ">
            <option value="">-- Select or create patient --</option>
            ${this.patients.map(p => `<option value="${p.id}">${p.name} (${p.email})</option>`).join('')}
          </select>
        </div>

        <div style="text-align: center; margin: 1.5rem 0; color: var(--text-secondary);">OR</div>

        <div class="form-group">
          <label>New Patient - Email</label>
          <input type="email" id="patient-email" placeholder="your@email.com" />
        </div>

        <div class="form-group">
          <label>Name</label>
          <input type="text" id="patient-name" placeholder="Full Name" />
        </div>

        <div class="form-group">
          <label>Phone</label>
          <input type="tel" id="patient-phone" placeholder="Phone number" />
        </div>

        <div style="display: flex; gap: 1rem; margin-top: 2rem;">
          <button class="btn btn-primary" onclick="document.querySelector('.book-page').dispatchEvent(new CustomEvent('next-step'))" style="flex: 1; cursor: pointer;">
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
            <div class="chip" onclick="document.getElementById('doctor-select').value = '${doctor.id}'; document.querySelector('.book-page').dispatchEvent(new CustomEvent('doctor-selected'))" style="
              padding: 1rem;
              cursor: pointer;
              border: 2px solid var(--border);
              transition: all 250ms;
              background: transparent;
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
          <button class="btn btn-outline" onclick="document.querySelector('.book-page').dispatchEvent(new CustomEvent('prev-step'))" style="flex: 1; cursor: pointer;">
            ← Back
          </button>
          <button class="btn btn-primary" onclick="document.querySelector('.book-page').dispatchEvent(new CustomEvent('next-step'))" style="flex: 1; cursor: pointer;">
            Next Step →
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Step 3: Select Date
   */
  renderDateStep() {
    return `
      <div class="card">
        <h2 style="margin-bottom: 1.5rem;">Step 3: Choose Date</h2>

        <div class="form-group">
          <label>Appointment Date</label>
          <input type="date" id="appointment-date" style="
            background: var(--surface-secondary);
            border: 1px solid var(--border);
            border-radius: 0.5rem;
            padding: 0.75rem;
            cursor: pointer;
          " />
        </div>

        <div id="date-error" style="
          color: var(--error);
          font-size: 0.875rem;
          display: none;
          margin-bottom: 1rem;
        "></div>

        <div style="display: flex; gap: 1rem; margin-top: 2rem;">
          <button class="btn btn-outline" onclick="document.querySelector('.book-page').dispatchEvent(new CustomEvent('prev-step'))" style="flex: 1; cursor: pointer;">
            ← Back
          </button>
          <button class="btn btn-primary" onclick="document.querySelector('.book-page').dispatchEvent(new CustomEvent('confirm-booking'))" style="flex: 1; cursor: pointer;">
            ✅ Confirm Booking
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Attach form event listeners
   */
  attachFormListeners(container) {
    const page = container.querySelector('.book-page');

    page.addEventListener('next-step', () => this.handleNextStep(container));
    page.addEventListener('prev-step', () => this.handlePrevStep(container));
    page.addEventListener('confirm-booking', () => this.handleConfirmBooking(container));
    page.addEventListener('doctor-selected', () => this.handleDoctorSelected());
  }

  /**
   * Handle next step
   */
  handleNextStep(container) {
    if (this.currentStep === 1) {
      const selectedId = document.getElementById('patient-select').value;
      const email = document.getElementById('patient-email').value;
      const name = document.getElementById('patient-name').value;
      const phone = document.getElementById('patient-phone').value;

      if (selectedId) {
        this.formData.patient_id = parseInt(selectedId);
      } else if (email && name && phone) {
        const validation = validators.validatePatient({ name, email, phone });
        if (!validation.isValid) {
          toast.error(validation.errors[0]);
          return;
        }
        this.formData.patient_email = email;
        this.formData.patient_name = name;
        this.formData.patient_phone = phone;
      } else {
        toast.error('Please select or enter patient details');
        return;
      }

      this.currentStep = 2;
    } else if (this.currentStep === 2) {
      const doctorId = document.getElementById('doctor-select').value;
      if (!doctorId) {
        toast.error('Please select a doctor');
        return;
      }
      this.formData.doctor_id = parseInt(doctorId);
      this.currentStep = 3;
    }

    storage.saveAppointmentDraft(this.formData);
    this.renderForm(container);
  }

  /**
   * Handle previous step
   */
  handlePrevStep(container) {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
    this.renderForm(container);
  }

  /**
   * Handle confirm booking
   */
  async handleConfirmBooking(container) {
    const appointmentDate = document.getElementById('appointment-date').value;
    const dateError = document.getElementById('date-error');

    if (!appointmentDate) {
      dateError.textContent = 'Please select a date';
      dateError.style.display = 'block';
      return;
    }

    const validation = validators.validateAppointment({
      patient_id: this.formData.patient_id,
      doctor_id: this.formData.doctor_id,
      date: appointmentDate
    });

    if (!validation.isValid) {
      toast.error(validation.errors[0]);
      return;
    }

    try {
      console.log('📡 Creating appointment...');
      container.querySelector('#booking-form').style.display = 'none';

      const result = await appointmentsApi.create({
        patient_id: this.formData.patient_id,
        doctor_id: this.formData.doctor_id,
        date: appointmentDate
      });

      console.log('✅ Appointment created:', result);

      storage.clearAppointmentDraft();
      container.querySelector('#booking-success').style.display = 'block';
      toast.success('Appointment booked successfully!');

    } catch (error) {
      console.error('❌ Booking failed:', error);
      container.querySelector('#booking-error').style.display = 'block';
      document.getElementById('error-message').textContent = error.message || 'Failed to create appointment';
      toast.error('Failed to book appointment');
    }
  }

  /**
   * Handle doctor selected
   */
  handleDoctorSelected() {
    // Highlight selected doctor
    document.querySelectorAll('#doctors-list .chip').forEach(chip => {
      chip.style.borderColor = 'var(--border)';
      chip.style.background = 'transparent';
    });
  }

  /**
   * Update progress bar
   */
  updateProgressBar() {
    const progress = (this.currentStep / 3) * 100;
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
      progressBar.style.width = progress + '%';
    }
  }
}

export default BookPage;
