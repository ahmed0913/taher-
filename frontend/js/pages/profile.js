/** ═══════════════════════════════════════════════════════════════
 * 👤 Patient Profile Page
 * ═══════════════════════════════════════════════════════════════ */

import { patientsApi } from '../api/patients.js';
import { toast } from '../ui/toast.js';
import { storage } from '../utils/storage.js';
import { validators } from '../utils/validators.js';
import { formatters } from '../utils/formatters.js';

export class ProfilePage {
  constructor() {
    this.name = 'profile';
    this.patient = storage.getPatient() || null;
    this.isEditing = false;
  }

  /**
   * Render profile page
   */
  async render(container) {
    console.log('📖 Rendering Profile Page');

    // Re-read patient data each time the page renders
    this.patient = storage.getPatient() || null;

    if (!this.patient) {
      container.innerHTML = `
        <main style="padding: 2rem 1rem;">
          <div class="container" style="text-align: center;">
            <h1 style="margin-bottom: 1rem;">👤 My Profile</h1>
            <p style="color: var(--text-secondary); margin-bottom: 2rem;">
              No patient profile found. Please book an appointment first.
            </p>
            <button class="btn btn-primary" onclick="app.navigate('book')" style="cursor: pointer;">
              📅 Book Appointment
            </button>
          </div>
        </main>
      `;
      return;
    }

    container.innerHTML = `
      <main class="profile-page">
        <section style="padding: 2rem 1rem;">
          <div class="container" style="max-width: 600px;">
            <h1 style="margin-bottom: 2rem;">👤 My Profile</h1>

            <!-- Profile Card -->
            <div class="card" style="margin-bottom: 2rem;">
              <div style="display: flex; align-items: center; gap: 1.5rem; margin-bottom: 2rem; padding-bottom: 1.5rem; border-bottom: var(--glass-border);">
                <div class="avatar avatar-lg" style="background: var(--gradient-primary);">
                  ${formatters.getInitials(this.patient.name)}
                </div>
                <div>
                  <h2 style="margin: 0 0 0.5rem 0;">${this.patient.name}</h2>
                  <p style="margin: 0; color: var(--text-secondary);">${this.patient.email}</p>
                </div>
              </div>

              <!-- Profile Info -->
              <div id="profile-info">
                <div style="margin-bottom: 1.5rem;">
                  <label style="color: var(--text-secondary); font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em;">Email</label>
                  <p style="margin: 0.5rem 0 0 0;">${this.patient.email}</p>
                </div>
                <div style="margin-bottom: 1.5rem;">
                  <label style="color: var(--text-secondary); font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em;">Phone</label>
                  <p style="margin: 0.5rem 0 0 0;">${formatters.formatPhone(this.patient.phone)}</p>
                </div>
              </div>

              <!-- Edit Form (Hidden) -->
              <div id="profile-form" style="display: none;">
                <div class="form-group">
                  <label>Full Name</label>
                  <input type="text" id="edit-name" value="${this.patient.name}" />
                </div>
                <div class="form-group">
                  <label>Email</label>
                  <input type="email" id="edit-email" value="${this.patient.email}" />
                </div>
                <div class="form-group">
                  <label>Phone</label>
                  <input type="tel" id="edit-phone" value="${this.patient.phone}" />
                </div>
              </div>

              <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                <button class="btn btn-outline" id="edit-btn" onclick="document.querySelector('.profile-page').dispatchEvent(new CustomEvent('toggle-edit'))" style="flex: 1; cursor: pointer;">
                  ✏️ Edit Profile
                </button>
                <button class="btn btn-primary" id="save-btn" style="flex: 1; cursor: pointer; display: none;" onclick="document.querySelector('.profile-page').dispatchEvent(new CustomEvent('save-profile'))">
                  💾 Save Changes
                </button>
              </div>
            </div>

            <!-- Statistics -->
            <div class="grid grid-cols-2" style="gap: 1rem;">
              <div class="card" style="text-align: center;">
                <div style="font-size: 2rem; font-weight: bold; color: var(--neon-blue); margin-bottom: 0.5rem;">0</div>
                <div style="color: var(--text-secondary); font-size: 0.875rem;">Upcoming Appointments</div>
              </div>
              <div class="card" style="text-align: center;">
                <div style="font-size: 2rem; font-weight: bold; color: var(--success); margin-bottom: 0.5rem;">0</div>
                <div style="color: var(--text-secondary); font-size: 0.875rem;">Completed Appointments</div>
              </div>
            </div>
          </div>
        </section>
      </main>
    `;

    // Attach listeners
    const page = container.querySelector('.profile-page');
    page.addEventListener('toggle-edit', () => this.toggleEdit(container));
    page.addEventListener('save-profile', () => this.saveProfile(container));
  }

  /**
   * Toggle edit mode
   */
  toggleEdit(container) {
    this.isEditing = !this.isEditing;

    const info = container.querySelector('#profile-info');
    const form = container.querySelector('#profile-form');
    const editBtn = container.querySelector('#edit-btn');
    const saveBtn = container.querySelector('#save-btn');

    if (this.isEditing) {
      info.style.display = 'none';
      form.style.display = 'block';
      editBtn.style.display = 'none';
      saveBtn.style.display = 'block';
      editBtn.textContent = '❌ Cancel';
    } else {
      info.style.display = 'block';
      form.style.display = 'none';
      editBtn.style.display = 'block';
      saveBtn.style.display = 'none';
      editBtn.textContent = '✏️ Edit Profile';
    }
  }

  /**
   * Save profile changes
   */
  async saveProfile(container) {
    const name = document.querySelector('#edit-name').value;
    const email = document.querySelector('#edit-email').value;
    const phone = document.querySelector('#edit-phone').value;

    // Validate
    const validation = validators.validatePatient({ name, email, phone });
    if (!validation.isValid) {
      toast.error(validation.errors[0]);
      return;
    }

    try {
      console.log('📡 Updating patient profile...');

      // Here you would call the API to update
      // For now, just update local storage
      this.patient = { ...this.patient, name, email, phone };
      storage.savePatient(this.patient);

      toast.success('Profile updated successfully!');
      this.isEditing = false;

      // Re-render
      const mainContainer = container.parentElement;
      await this.render(container);

    } catch (error) {
      console.error('❌ Failed to save profile:', error);
      toast.error('Failed to save profile');
    }
  }
}

export default ProfilePage;
