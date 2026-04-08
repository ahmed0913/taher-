/** ═══════════════════════════════════════════════════════════════
 * 🏠 Home Page - Enhanced with Animations & Store Integration
 * ═══════════════════════════════════════════════════════════════ */

import { api } from '../api/client.js';
import notifications from '../ui/notifications.js';
import store from '../store.js';

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
        <section class="hero-section">
          <div class="hero-background"></div>
          <div class="container">
            <div class="hero-content">
              <h1 class="hero-title">
                Welcome to <span class="gradient-text">Clinic Care</span>
              </h1>
              <p class="hero-subtitle">
                Your trusted healthcare partner for quality medical services
              </p>
              <p class="hero-description">
                Book appointments with our specialists, manage your health records, and receive personalized care
              </p>
              <div class="hero-actions">
                <button class="btn btn-primary btn-lg" data-action="doctors">
                  👨‍⚕️ View Doctors
                </button>
                <button class="btn btn-outline btn-lg" data-action="book">
                  📅 Book Appointment
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- Features Section -->
        <section class="features-section">
          <div class="container">
            <h2 class="section-title">Why Choose Our Clinic?</h2>
            <div class="features-grid">
              ${this.createFeatureCard('⚡', 'Instant Booking', 'Schedule appointments instantly with real-time availability')}
              ${this.createFeatureCard('🔒', 'Secure & Private', 'Your medical data is encrypted and HIPAA compliant')}
              ${this.createFeatureCard('👨‍⚕️', 'Expert Doctors', 'Board-certified specialists with years of experience')}
              ${this.createFeatureCard('📱', 'Mobile Friendly', 'Access your health on any device, anytime, anywhere')}
              ${this.createFeatureCard('💬', '24/7 Support', 'Our support team is always ready to help')}
              ${this.createFeatureCard('🏆', 'Award Winning', 'Recognized for excellence in patient care')}
            </div>
          </div>
        </section>

        <!-- Stats Section -->
        <section class="stats-section">
          <div class="container">
            <h2 class="section-title">By The Numbers</h2>
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-number gradient-primary">
                  <span class="stat-counter" data-target="25">0</span>+
                </div>
                <div class="stat-label">Specialist Doctors</div>
                <p class="stat-description">Qualified medical professionals</p>
              </div>
              <div class="stat-card">
                <div class="stat-number gradient-secondary">
                  <span class="stat-counter" data-target="5000">0</span>+
                </div>
                <div class="stat-label">Patients Served</div>
                <p class="stat-description">Trust and satisfaction guaranteed</p>
              </div>
              <div class="stat-card">
                <div class="stat-number gradient-accent">
                  <span class="stat-counter" data-target="98">0</span>%
                </div>
                <div class="stat-label">Satisfaction Rate</div>
                <p class="stat-description">Highly rated by patients</p>
              </div>
              <div class="stat-card">
                <div class="stat-number gradient-cyan">
                  <span class="stat-counter" data-target="10">0</span>k
                </div>
                <div class="stat-label">Appointments/Month</div>
                <p class="stat-description">Growing trust every day</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Services Section -->
        <section class="services-section">
          <div class="container">
            <h2 class="section-title">Our Services</h2>
            <div class="services-grid">
              <div class="service-card">
                <div class="service-icon">🩺</div>
                <h3>General Medicine</h3>
                <p>Comprehensive health checkups and treatment for common illnesses</p>
              </div>
              <div class="service-card">
                <div class="service-icon">❤️</div>
                <h3>Cardiology</h3>
                <p>Heart and cardiovascular system care from specialists</p>
              </div>
              <div class="service-card">
                <div class="service-icon">🦷</div>
                <h3>Dentistry</h3>
                <p>Dental care and cosmetic procedures for your smile</p>
              </div>
              <div class="service-card">
                <div class="service-icon">🧠</div>
                <h3>Neurology</h3>
                <p>Brain and nervous system disorder treatment</p>
              </div>
              <div class="service-card">
                <div class="service-icon">👀</div>
                <h3>Ophthalmology</h3>
                <p>Complete eye care and vision correction services</p>
              </div>
              <div class="service-card">
                <div class="service-icon">🦴</div>
                <h3>Orthopedics</h3>
                <p>Bone, joint, and musculoskeletal system care</p>
              </div>
            </div>
          </div>
        </section>

        <!-- CTA Section -->
        <section class="cta-section">
          <div class="container">
            <div class="cta-content">
              <h2>Ready to Get Started?</h2>
              <p>Join thousands of satisfied patients who trust us with their health</p>
              <button class="btn btn-primary btn-lg" data-action="book">
                Schedule Your Appointment Today →
              </button>
            </div>
          </div>
        </section>
      </main>
    `;

    this._attachEventListeners();
    this.animateCounters();

    // Check API health
    const isHealthy = await api.healthCheck();
    if (!isHealthy) {
      api.enableDemoMode();
      notifications.warning('Using demo mode - API unavailable', 5000);
    }
  }

  /**
   * Create feature card HTML
   */
  createFeatureCard(icon, title, description) {
    return `
      <div class="feature-card">
        <div class="feature-icon">${icon}</div>
        <h3>${title}</h3>
        <p>${description}</p>
      </div>
    `;
  }

  /**
   * Animate number counters on scroll
   */
  animateCounters() {
    const counters = document.querySelectorAll('.stat-counter');

    if (!counters.length) return;

    // Intersection Observer to detect when counters are in view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !entry.target.animated) {
          entry.target.animated = true;
          this._startCounterAnimation(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach((counter) => observer.observe(counter));
  }

  /**
   * Start animation for a single counter
   */
  _startCounterAnimation(counter) {
    const target = parseInt(counter.getAttribute('data-target'));
    let current = 0;
    const increment = target / 40; // 40 frames
    const duration = 1000; // 1 second
    const frameDuration = duration / 40;

    const animate = () => {
      current += increment;
      if (current < target) {
        counter.textContent = Math.floor(current);
        setTimeout(animate, frameDuration);
      } else {
        counter.textContent = target;
      }
    };

    animate();
  }

  /**
   * Attach event listeners
   */
  _attachEventListeners() {
    const buttons = document.querySelectorAll('[data-action]');
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        app.navigate(action);
      });
    });
  }
}

export default HomePage;
