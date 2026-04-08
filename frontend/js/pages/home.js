/** ═══════════════════════════════════════════════════════════════
 * 🏠 Home Page
 * ═══════════════════════════════════════════════════════════════ */

import { toast } from '../ui/toast.js';
import { api } from '../api/client.js';

export class HomePage {
  constructor() {
    this.name = 'home';
  }

  /**
   * Render home page
   */
  async render(container) {
    console.log('📖 Rendering Home Page');

    container.innerHTML = `
      <main class="home-page">
        <!-- Hero Section -->
        <section class="hero" style="
          background: linear-gradient(135deg, var(--bg-dark) 0%, rgba(118, 75, 162, 0.1) 100%);
          padding: 4rem 1rem;
          position: relative;
          overflow: hidden;
        ">
          <div class="container">
            <div class="stagger-children">
              <h1 style="
                font-size: clamp(2rem, 8vw, 4rem);
                background: var(--gradient-primary);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                margin-bottom: 1rem;
              ">
                Welcome to Clinic Care
              </h1>
              <p style="
                font-size: clamp(1rem, 4vw, 1.5rem);
                color: var(--text-secondary);
                margin-bottom: 2rem;
                max-width: 600px;
              ">
                Book appointments with our specialists and manage your healthcare with ease
              </p>
              <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                <button class="btn btn-primary btn-lg" onclick="app.navigate('doctors')" style="cursor: pointer;">
                  👨‍⚕️ View Doctors
                </button>
                <button class="btn btn-outline btn-lg" onclick="app.navigate('book')" style="cursor: pointer;">
                  📅 Book Appointment
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- Features Section -->
        <section style="padding: 4rem 1rem; background: var(--surface);">
          <div class="container">
            <h2 style="text-align: center; margin-bottom: 3rem;">Why Choose Us?</h2>
            <div class="grid grid-cols-3" style="gap: 2rem;">
              ${this.createFeatureCard('⚡', 'Fast Appointments', 'Book appointments instantly with our specialist doctors')}
              ${this.createFeatureCard('🔒', 'Secure & Private', 'Your medical data is encrypted and protected')}
              ${this.createFeatureCard('📱', 'Easy to Use', 'Simple interface works on all devices')}
            </div>
          </div>
        </section>

        <!-- Stats Section -->
        <section style="padding: 4rem 1rem;">
          <div class="container">
            <div class="grid grid-cols-3" style="gap: 2rem; text-align: center;">
              <div class="card">
                <div style="font-size: 2.5rem; font-weight: bold; background: var(--gradient-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                  <span class="stat-counter" data-target="5">0</span>+
                </div>
                <div style="color: var(--text-secondary); margin-top: 0.5rem;">Specialist Doctors</div>
              </div>
              <div class="card">
                <div style="font-size: 2.5rem; font-weight: bold; background: var(--gradient-secondary); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                  <span class="stat-counter" data-target="500">0</span>+
                </div>
                <div style="color: var(--text-secondary); margin-top: 0.5rem;">Patients Served</div>
              </div>
              <div class="card">
                <div style="font-size: 2.5rem; font-weight: bold; background: var(--gradient-accent); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                  <span class="stat-counter" data-target="98">0</span>%
                </div>
                <div style="color: var(--text-secondary); margin-top: 0.5rem;">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </section>

        <!-- CTA Section -->
        <section style="
          padding: 4rem 1rem;
          background: linear-gradient(135deg, rgba(0, 242, 254, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
        ">
          <div class="container" style="text-align: center;">
            <h2 style="margin-bottom: 2rem;">Ready to Book Your Appointment?</h2>
            <button class="btn btn-primary btn-lg" onclick="app.navigate('book')" style="cursor: pointer;">
              Get Started Now →
            </button>
          </div>
        </section>
      </main>
    `;

    // Animate stats counters
    this.animateCounters();

    // Check API health
    const isHealthy = await api.healthCheck();
    if (!isHealthy) {
      api.enableDemoMode();
      toast.warning('API endpoint not available. Using demo mode.', 5000);
    }
  }

  /**
   * Create feature card HTML
   */
  createFeatureCard(icon, title, description) {
    return `
      <div class="card animate-slideUp">
        <div style="font-size: 2.5rem; margin-bottom: 1rem;">${icon}</div>
        <h3 style="margin-bottom: 0.5rem;">${title}</h3>
        <p style="color: var(--text-secondary);">${description}</p>
      </div>
    `;
  }

  /**
   * Animate number counters
   */
  animateCounters() {
    const counters = document.querySelectorAll('.stat-counter');
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'));
      let current = 0;
      const increment = target / 30;

      const animate = () => {
        current += increment;
        if (current < target) {
          counter.textContent = Math.floor(current);
          setTimeout(animate, 50);
        } else {
          counter.textContent = target;
        }
      };

      animate();
    });
  }
}

export default HomePage;
