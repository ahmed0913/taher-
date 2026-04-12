/** ═══════════════════════════════════════════════════════════════
 * 👨‍⚕️ Doctors Page
 * ═══════════════════════════════════════════════════════════════ */

import { doctorsApi } from '../api/doctors.js';
import { loader, createSkeletonGrid } from '../ui/loader.js';
import { toast } from '../ui/toast.js';
import { formatters } from '../utils/formatters.js';

export class DoctorsPage {
  constructor() {
    this.name = 'doctors';
    this.doctors = [];
    this.filteredDoctors = [];
    this.selectedSpecialization = 'All';
  }

  /**
   * Render doctors page with loading state fix
   */
  async render(container) {
    console.log('📖 Rendering Doctors Page');

    // Show skeleton loaders
    container.innerHTML = `
      <main class="doctors-page">
        <section style="padding: 2rem 1rem;">
          <div class="container">
            <div style="margin-bottom: 2rem;">
              <h1>Our Specialists</h1>
              <p style="color: var(--text-secondary);">Choose your specialist doctor</p>
            </div>

            <!-- Filter Section -->
            <div id="filter-controls" style="margin-bottom: 2rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
              <button class="chip active" data-spec="All" onclick="this.parentElement.parentElement.querySelector('.doctors-grid').dispatchEvent(new CustomEvent('filter-change', {detail: {spec: 'All'}}))">
                All Specializations
              </button>
            </div>

            <!-- Loading Skeleton -->
            <div id="doctors-loading"></div>

            <!-- Doctors Grid -->
            <div id="doctors-grid" class="grid grid-cols-3 stagger-children" style="display: none;"></div>

            <!-- Error Message -->
            <div id="doctors-error" style="display: none; text-align: center; padding: 2rem;">
              <p style="color: var(--error);">Failed to load doctors. Using demo data.</p>
            </div>
          </div>
        </section>
      </main>
    `;

    // Show loading skeleton
    const loadingDiv = container.querySelector('#doctors-loading');
    loadingDiv.appendChild(createSkeletonGrid(3, 2));

    try {
      // Fetch doctors with timeout and fallback
      console.log('⏳ Loading doctors...');
      this.doctors = await doctorsApi.getAll();

      if (!this.doctors || this.doctors.length === 0) {
        throw new Error('No doctors found');
      }

      console.log('✅ Doctors loaded:', this.doctors);

      // Hide skeleton, show grid
      loadingDiv.style.display = 'none';
      this.renderDoctorsGrid(container);

    } catch (error) {
      console.error('❌ Failed to load doctors:', error);

      // Hide skeleton and error
      loadingDiv.style.display = 'none';
      container.querySelector('#doctors-error').style.display = 'block';

      // Show mock data fallback
      toast.warning('Using demo data - API unavailable', 5000);
      this.doctors = await doctorsApi.getAll(); // This will use mock data
      this.renderDoctorsGrid(container);
    }
  }

  /**
   * Render doctors grid
   */
  renderDoctorsGrid(container) {
    const grid = container.querySelector('#doctors-grid');
    const filterControls = container.querySelector('#filter-controls');

    // Get unique specializations
    const specs = ['All', ...new Set(this.doctors.map(d => d.specialization))];

    // Update filter buttons
    filterControls.innerHTML = specs.map(spec => `
      <button class="chip ${spec === this.selectedSpecialization ? 'active' : ''}" data-spec="${spec}">
        ${spec}
      </button>
    `).join('');

    // Attach filter click handlers
    filterControls.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const spec = chip.getAttribute('data-spec');
        this.selectedSpecialization = spec;
        // Update active state
        filterControls.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.filterDoctors(spec);
      });
    });

    // DEBUG: Log image URLs
    console.log('🩺 Img URLs:', this.doctors.map(d => d.image));

    // Render doctors
    this.filteredDoctors = this.doctors;
    grid.innerHTML = this.filteredDoctors.map(doctor => `
      <div class="card animate-slideUp" style="cursor: pointer;" onclick="window.app.navigate('book', { doctor: '${doctor.id}' })">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 1rem; margin-bottom: 1rem;">
          <img src="${doctor.image}" alt="${doctor.name}" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; object-position: center;" loading="lazy" decoding="async" onerror="this.style.display='none'" />
          <div style="text-align: center;">
            <h3 style="margin: 0;">${doctor.name}</h3>
            <div class="badge badge-primary">${doctor.specialization}</div>
          </div>
        </div>
        <p style="margin-bottom: 1rem; color: var(--text-secondary); text-align: center;">
          Specialist in ${doctor.specialization}
        </p>
        <div class="card-footer" style="border-top: var(--glass-border); padding-top: 1rem;">
          <button class="btn btn-primary btn-sm" style="width: 100%;">
            📅 Book Now
          </button>
        </div>
      </div>
    `).join('');

    grid.style.display = 'grid';

    // Add filter event listener
    const page = document.querySelector('.doctors-page');
    if (page) {
      page.addEventListener('filter', (e) => {
        this.filterDoctors(e.detail.spec);
      });
    }

    console.log('✅ Doctors grid rendered');
  }

  /**
   * Filter doctors by specialization
   */
  filterDoctors(specialization) {
    console.log('🔍 Filtering by:', specialization);

    if (specialization === 'All') {
      this.filteredDoctors = this.doctors;
    } else {
      this.filteredDoctors = this.doctors.filter(d => d.specialization === specialization);
    }

    const grid = document.querySelector('#doctors-grid');
    grid.innerHTML = this.filteredDoctors.map(doctor => `
      <div class="card animate-slideUp" style="cursor: pointer;" onclick="window.app.navigate('book', { doctor: '${doctor.id}' })">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 1rem; margin-bottom: 1rem;">
          <img src="${doctor.image}" alt="${doctor.name}" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; object-position: center;" loading="lazy" decoding="async" onerror="this.style.display='none'" />
          <div style="text-align: center;">
            <h3 style="margin: 0;">${doctor.name}</h3>
            <div class="badge badge-primary">${doctor.specialization}</div>
          </div>
        </div>
        <p style="margin-bottom: 1rem; color: var(--text-secondary); text-align: center;">
          Specialist in ${doctor.specialization}
        </p>
        <div class="card-footer" style="border-top: var(--glass-border); padding-top: 1rem;">
          <button class="btn btn-primary btn-sm" style="width: 100%;">
            📅 Book Now
          </button>
        </div>
      </div>
    `).join('');
  }
}

export default DoctorsPage;
