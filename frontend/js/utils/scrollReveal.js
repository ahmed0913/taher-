/** ═══════════════════════════════════════════════════════════════
 * 🎭 Scroll Reveal - Luxury Animation on Scroll
 * IntersectionObserver-based progressive reveal
 * ═══════════════════════════════════════════════════════════════ */

export const scrollReveal = {
  // Track observer instance
  observer: null,

  /**
   * Initialize scroll reveal animations
   * Add .reveal-on-scroll class to elements
   */
  init() {
    if (this.observer) return; // Already initialized

    console.log('🎬 Initializing Scroll Reveal Animations');

    const options = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Set animation delay for staggered effect
          const delay = index * 100; // 100ms between each element
          entry.target.style.setProperty('--reveal-delay', `${delay}ms`);
          
          // Add visible class to trigger animation
          entry.target.classList.add('is-visible');
          
          // Stop observing this element
          this.observer.unobserve(entry.target);
        }
      });
    }, options);

    // Start observing all reveal elements
    this.observeAll();
  },

  /**
   * Observe all elements with .reveal-on-scroll class
   */
  observeAll() {
    const elements = document.querySelectorAll('.reveal-on-scroll');
    console.log(`📍 Found ${elements.length} reveal elements`);
    
    elements.forEach((el, index) => {
      // Set stagger variable for CSS animations
      el.style.setProperty('--i', index);
      this.observer?.observe(el);
    });
  },

  /**
   * Observe a specific element
   */
  observe(element) {
    if (!this.observer) this.init();
    if (element) this.observer.observe(element);
  },

  /**
   * Stop observing an element
   */
  unobserve(element) {
    if (this.observer && element) {
      this.observer.unobserve(element);
    }
  },

  /**
   * Stop all observers and clean up
   */
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
      console.log('✅ Scroll Reveal destroyed');
    }
  },

  /**
   * Add class to element for reveal animation
   */
  addRevealClass(element) {
    if (element) {
      element.classList.add('reveal-on-scroll');
      this.observe(element);
    }
  }
};

/**
 * Auto-initialize on module load
 */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    scrollReveal.init();
  });
} else {
  scrollReveal.init();
}

export default scrollReveal;
