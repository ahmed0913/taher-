/** ═══════════════════════════════════════════════════════════════
 * 🎭 Demo Mode Badge - Shows when using mock data
 * ═══════════════════════════════════════════════════════════════ */

import { config } from '../config.js';
import { dom } from '../utils/dom.js';

class DemoModeBadge {
  constructor() {
    this.isVisible = false;
    this.element = null;
  }

  /**
   * Initialize badge
   */
  init() {
    if (!config.demo.showBadge) return;

    // Create badge element
    this.element = document.createElement('div');
    this.element.id = 'demo-mode-badge';
    this.element.innerHTML = `
      <span style="display: flex; align-items: center; gap: 0.5rem;">
        <span style="width: 8px; height: 8px; background: #f5576c; border-radius: 50%; animation: pulse 2s infinite;"></span>
        🎭 DEMO MODE
      </span>
    `;

    // Style badge
    const styles = `
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      background: rgba(15, 23, 42, 0.9);
      color: #f5576c;
      padding: 0.75rem 1.25rem;
      border-radius: 2rem;
      font-size: 0.875rem;
      font-weight: 600;
      border: 1px solid rgba(245, 87, 108, 0.2);
      z-index: 9999;
      animation: slideUp 300ms ease-out;
      backdrop-filter: blur(10px);
      cursor: pointer;
      transition: all 250ms ease;
    `;

    this.element.style.cssText = styles;

    // Add click handler to toggle info
    this.element.addEventListener('click', () => this.toggleInfo());

    // Add to page
    document.body.appendChild(this.element);
    this.isVisible = true;

    console.log('🎭 Demo Mode Badge initialized');
  }

  /**
   * Toggle info on click
   */
  toggleInfo() {
    if (!this.element) return;

    const title = this.element.querySelector('span');
    if (title && title.textContent.includes('DEMO MODE')) {
      title.textContent = '💾 Using sample data (API offline)';
    } else if (title) {
      title.innerHTML = `
        <span style="display: flex; align-items: center; gap: 0.5rem;">
          <span style="width: 8px; height: 8px; background: #f5576c; border-radius: 50%; animation: pulse 2s infinite;"></span>
          🎭 DEMO MODE
        </span>
      `;
    }
  }

  /**
   * Show badge
   */
  show() {
    if (!this.element) this.init();
    if (this.element) dom.safeSetStyle(this.element, 'display', 'block');
    this.isVisible = true;
  }

  /**
   * Hide badge
   */
  hide() {
    if (this.element) dom.safeSetStyle(this.element, 'display', 'none');
    this.isVisible = false;
  }

  /**
   * Destroy badge
   */
  destroy() {
    if (this.element && this.element.parentElement) {
      this.element.remove();
    }
    this.element = null;
    this.isVisible = false;
  }
}

export const demoModeBadge = new DemoModeBadge();
