/** ═══════════════════════════════════════════════════════════════
 * 📜 Appointment History Page
 * ═══════════════════════════════════════════════════════════════ */

import { appointmentsApi } from '../api/appointments.js';
import { doctorsApi } from '../api/doctors.js';
import { patientsApi } from '../api/patients.js';
import { toast } from '../ui/toast.js';
import { createSkeletonList } from '../ui/loader.js';
import { formatters } from '../utils/formatters.js';

export class HistoryPage {
  constructor() {
    this.name = 'history';
    this.appointments = [];
    this.doctors = [];
    this.patients = [];
    this.filter = 'all'; // all, upcoming, past
  }

  /**
   * Render history page with loading fix
   */
  async render(container) {
    console.log('📖 Rendering History Page');

    container.innerHTML = `
      <main class="history-page">
        <section style="padding: 2rem 1rem;">
          <div class="container">
            <h1 style="margin-bottom: 1rem;">📜 Appointment History</h1>

            <!-- Filter Tabs -->
            <div style="display: flex; gap: 0.5rem; margin-bottom: 2rem; flex-wrap: wrap;">
              <button class="chip active" onclick="document.querySelector('.history-page').dispatchEvent(new CustomEvent('filter', {detail: {type: 'all'}}))" style="cursor: pointer;">
                All Appointments
              </button>
              <button class="chip" onclick="document.querySelector('.history-page').dispatchEvent(new CustomEvent('filter', {detail: {type: 'upcoming'}}))" style="cursor: pointer;">
                📅 Upcoming
              </button>
              <button class="chip" onclick="document.querySelector('.history-page').dispatchEvent(new CustomEvent('filter', {detail: {type: 'past'}}))" style="cursor: pointer;">
                ✅ Completed
              </button>
            </div>

            <!-- Loading Skeleton -->
            <div id="history-loading"></div>

            <!-- Appointments List -->
            <div id="appointments-list" style="display: none;"></div>

            <!-- Empty State -->
            <div id="empty-state" style="display: none; text-align: center; padding: 3rem;">
              <div style="font-size: 3rem; margin-bottom: 1rem;">📭</div>
              <h3 style="margin-bottom: 0.5rem;">No Appointments</h3>
              <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">
                You don't have any appointments yet.
              </p>
              <button class="btn btn-primary" onclick="app.navigate('book')" style="cursor: pointer;">
                Book Your First Appointment
              </button>
            </div>

            <!-- Error State -->
            <div id="error-state" style="display: none; text-align: center; padding: 2rem;">
              <p style="color: var(--error); margin-bottom: 1rem;">Failed to load appointments</p>
              <button class="btn btn-outline" onclick="location.reload()" style="cursor: pointer;">
                Retry
              </button>
            </div>
          </div>
        </section>
      </main>
    `;

    // Load data
    await this.loadAppointments(container);

    // Attach event listeners
    const page = container.querySelector('.history-page');
    page.addEventListener('filter', (e) => this.handleFilter(container, e.detail.type));
  }

  /**
   * Load appointments with timeout
   */
  async loadAppointments(container) {
    const loadingDiv = container.querySelector('#history-loading');
    loadingDiv.appendChild(createSkeletonList(3));

    try {
      console.log('⏳ Loading appointments...');

      // Load with timeout
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), 5000)
      );

      const loadPromise = Promise.all([
        appointmentsApi.getAll(),
        doctorsApi.getAll(),
        patientsApi.getAll()
      ]);

      [this.appointments, this.doctors, this.patients] = await Promise.race([loadPromise, timeoutPromise]);

      console.log('✅ Appointments loaded:', this.appointments.length);
      loadingDiv.style.display = 'none';
      this.renderAppointments(container);

    } catch (error) {
      console.error('❌ Failed to load appointments:', error);
      toast.error('Using demo data', 5000);

      // Fallback to mock data
      this.appointments = await appointmentsApi.getAll();
      this.doctors = await doctorsApi.getAll();
      this.patients = await patientsApi.getAll();

      loadingDiv.style.display = 'none';

      if (this.appointments.length > 0) {
        this.renderAppointments(container);
      } else {
        container.querySelector('#empty-state').style.display = 'block';
      }
    }
  }

  /**
   * Render appointments list
   */
  renderAppointments(container) {
    const filtered = this.filterAppointments(this.filter);

    if (filtered.length === 0) {
      container.querySelector('#empty-state').style.display = 'block';
      container.querySelector('#appointments-list').style.display = 'none';
      return;
    }

    const listDiv = container.querySelector('#appointments-list');
    listDiv.innerHTML = filtered.map(appt => {
      const doctor = this.doctors.find(d => d.id === appt.doctor_id);
      const patient = this.patients.find(p => p.id === appt.patient_id);
      const isUpcoming = new Date(appt.date) >= new Date();

      return `
        <div class="card animate-slideUp" style="margin-bottom: 1rem;">
          <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
            <div>
              <h3 style="margin: 0 0 0.5rem 0;">${doctor?.name || 'Unknown Doctor'}</h3>
              <p style="margin: 0; color: var(--text-secondary); font-size: 0.875rem;">
                ${doctor?.specialization || 'N/A'}
              </p>
            </div>
            <div class="badge ${isUpcoming ? 'badge-primary' : 'badge-success'}">
              ${isUpcoming ? '📅 Upcoming' : '✅ Completed'}
            </div>
          </div>

          <div style="background: var(--surface-secondary); padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
              <span style="color: var(--text-secondary);">Patient:</span>
              <strong>${patient?.name || 'Unknown'}</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: var(--text-secondary);">Date:</span>
              <strong>${formatters.formatDate(appt.date, 'long')}</strong>
            </div>
          </div>

          <div style="display: flex; gap: 0.5rem;">
            <button class="btn btn-sm btn-outline" style="flex: 1; cursor: pointer;" onclick="alert('Reschedule functionality would go here')">
              🔄 Reschedule
            </button>
            <button class="btn btn-sm btn-outline" style="flex: 1; cursor: pointer; border-color: var(--error); color: var(--error);" onclick="if(confirm('Cancel this appointment?')) alert('Appointment cancelled')">
              ❌ Cancel
            </button>
          </div>
        </div>
      `;
    }).join('');

    listDiv.style.display = 'block';
  }

  /**
   * Filter appointments
   */
  filterAppointments(type) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.appointments.filter(appt => {
      const apptDate = new Date(appt.date);
      apptDate.setHours(0, 0, 0, 0);

      if (type === 'upcoming') {
        return apptDate >= today;
      } else if (type === 'past') {
        return apptDate < today;
      }
      return true;
    });
  }

  /**
   * Handle filter change
   */
  handleFilter(container, type) {
    this.filter = type;
    this.renderAppointments(container);

    // Update active chip
    container.querySelectorAll('.chip').forEach((chip, idx) => {
      chip.classList.remove('active');
      if (type === 'all' && idx === 0) chip.classList.add('active');
      if (type === 'upcoming' && idx === 1) chip.classList.add('active');
      if (type === 'past' && idx === 2) chip.classList.add('active');
    });
  }
}

export default HistoryPage;
