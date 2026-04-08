/** ═══════════════════════════════════════════════════════════════
 * 🔔 Toast Notifications
 * ═══════════════════════════════════════════════════════════════ */

export const toast = {
  container: null,

  /**
   * Initialize toast container
   */
  init() {
    if (this.container) return;
    this.container = document.createElement('div');
    this.container.id = 'toast-container';
    this.container.style.cssText = `
      position: fixed;
      bottom: 1.5rem;
      right: 1.5rem;
      z-index: 400;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      pointer-events: none;
    `;
    document.body.appendChild(this.container);
  },

  /**
   * Show toast notification
   */
  show(message, type = 'info', duration = 4000) {
    this.init();

    const toastEl = document.createElement('div');
    toastEl.className = `toast ${type}`;
    toastEl.style.cssText = `
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 0.5rem;
      padding: 1rem;
      max-width: 400px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      display: flex;
      gap: 1rem;
      align-items: flex-start;
      animation: slideUp 250ms cubic-bezier(0.19, 1, 0.22, 1);
      pointer-events: auto;
    `;

    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };

    const colors = {
      success: 'var(--success)',
      error: 'var(--error)',
      warning: 'var(--warning)',
      info: 'var(--info)'
    };

    toastEl.innerHTML = `
      <span style="font-size: 1.25rem; flex-shrink: 0;">
        ${icons[type] || icons.info}
      </span>
      <span style="flex: 1; color: ${colors[type] || colors.info}; font-size: 0.875rem;">
        ${message}
      </span>
      <button style="
        background: none;
        border: none;
        cursor: pointer;
        color: var(--text-secondary);
        padding: 0;
        font-size: 1.25rem;
        height: 20px;
        width: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
      ">×</button>
    `;

    const closeBtn = toastEl.querySelector('button');
    closeBtn.addEventListener('click', () => {
      toastEl.style.animation = 'slideUp 250ms cubic-bezier(0.19, 1, 0.22, 1) reverse';
      setTimeout(() => toastEl.remove(), 250);
    });

    this.container.appendChild(toastEl);

    console.log(`🔔 Toast (${type}):`, message);

    if (duration > 0) {
      setTimeout(() => {
        if (toastEl.parentElement) {
          toastEl.style.animation = 'slideUp 250ms cubic-bezier(0.19, 1, 0.22, 1) reverse';
          setTimeout(() => toastEl.remove(), 250);
        }
      }, duration);
    }

    return toastEl;
  },

  success(message, duration = 4000) {
    return this.show(message, 'success', duration);
  },

  error(message, duration = 5000) {
    return this.show(message, 'error', duration);
  },

  warning(message, duration = 4000) {
    return this.show(message, 'warning', duration);
  },

  info(message, duration = 4000) {
    return this.show(message, 'info', duration);
  }
};

export default toast;
