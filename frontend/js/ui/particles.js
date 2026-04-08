/** ═══════════════════════════════════════════════════════════════
 * ✨ Particles Animation - CSS-only Background Effect
 * ═══════════════════════════════════════════════════════════════ */

export const particles = {
  container: null,

  /**
   * Initialize particles
   */
  init() {
    if (this.container) return;

    // Create container
    this.container = document.createElement('div');
    this.container.id = 'particles-bg';
    this.container.style.cssText = `
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 0;
      background: radial-gradient(ellipse at 20% 50%, rgba(0, 242, 254, 0.15) 0%, transparent 50%),
                  radial-gradient(ellipse at 80% 80%, rgba(118, 75, 162, 0.15) 0%, transparent 50%);
    `;

    // Add 20 particle elements
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: absolute;
        width: ${Math.random() * 100 + 50}px;
        height: ${Math.random() * 100 + 50}px;
        background: radial-gradient(circle, rgba(0, 242, 254, 0.1) 0%, transparent 70%);
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation: drift ${15 + Math.random() * 20}s ease-in-out infinite;
        animation-delay: ${Math.random() * 5}s;
      `;
      this.container.appendChild(particle);
    }

    // Add to body before main content
    const app = document.getElementById('app');
    if (app) {
      app.parentElement.insertBefore(this.container, app);
    } else {
      document.body.insertBefore(this.container, document.body.firstChild);
    }

    // Ensure main content is on top
    const mainContent = document.getElementById('app');
    if (mainContent) {
      mainContent.style.position = 'relative';
      mainContent.style.zIndex = '1';
    }

    console.log('✨ Particles initialized');
  },

  /**
   * Destroy particles
   */
  destroy() {
    if (this.container) {
      this.container.remove();
      this.container = null;
      console.log('✨ Particles destroyed');
    }
  },

  /**
   * Add extra particles at random positions (for effects)
   */
  burst(x = window.innerWidth / 2, y = window.innerHeight / 2, count = 10) {
    if (!this.container) return;

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      const size = Math.random() * 20 + 10;
      const angle = (Math.PI * 2 * i) / count;
      const velocity = Math.random() * 300 + 100;

      particle.style.cssText = `
        position: fixed;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: linear-gradient(135deg, rgba(0, 242, 254, 0.5), rgba(118, 75, 162, 0.5));
        border-radius: 50%;
        pointer-events: none;
        z-index: 100;
      `;

      document.body.appendChild(particle);

      // Animate particle outward
      const startTime = Date.now();
      const duration = 1000;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = elapsed / duration;

        if (progress <= 1) {
          const distance = velocity * progress;
          particle.style.left = (x + Math.cos(angle) * distance) + 'px';
          particle.style.top = (y + Math.sin(angle) * distance) + 'px';
          particle.style.opacity = 1 - progress;
          requestAnimationFrame(animate);
        } else {
          particle.remove();
        }
      };

      animate();
    }

    console.log('💥 Particle burst at', { x, y });
  }
};

export default particles;
