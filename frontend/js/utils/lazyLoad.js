/** ═══════════════════════════════════════════════════════════════
 * 🖼️ Lazy Loading - Images with Blur-Up Effect
 * ═══════════════════════════════════════════════════════════════ */

export const lazyLoad = {
  observer: null,

  /**
   * Initialize lazy loading
   */
  init() {
    if (this.observer) return;

    console.log('🖼️ Initializing Lazy Loading');

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadImage(entry.target);
          this.observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.01,
      rootMargin: '50px'
    });

    // Observe all lazy images
    document.querySelectorAll('img[data-src]').forEach(img => {
      this.observer.observe(img);
    });
  },

  /**
   * Load image and apply blur-up effect
   */
  loadImage(img) {
    const src = img.getAttribute('data-src');
    if (!src) return;

    // Create new image to preload
    const newImg = new Image();
    
    newImg.onload = () => {
      img.src = src;
      img.classList.add('loaded');
      img.removeAttribute('data-src');
    };

    newImg.onerror = () => {
      img.classList.add('error');
      console.warn('Failed to load image:', src);
    };

    newImg.src = src;
  },

  /**
   * Enable loading="lazy" for native lazy loading
   */
  enableNative() {
    document.querySelectorAll('img[data-lazy]').forEach(img => {
      img.loading = 'lazy';
    });
    console.log('✅ Native lazy loading enabled');
  }
};

/**
 * Auto-initialize on module load
 */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    lazyLoad.init();
    lazyLoad.enableNative();
  });
} else {
  lazyLoad.init();
  lazyLoad.enableNative();
}

export default lazyLoad;
