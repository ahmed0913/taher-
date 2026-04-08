/**
 * 🔔 Toast Notification System with Store Integration
 * Auto-displays notifications from store state
 */

import store from '../store.js';

class NotificationManager {
  constructor() {
    this.container = null;
    this.toasts = new Map();
    this.init();
  }

  init() {
    // Create or find container
    let container = document.querySelector('.notification-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'notification-container';
      document.body.appendChild(container);
    }
    this.container = container;

    // Subscribe to store notifications
    store.subscribe('notification', (notification) => {
      if (notification) {
        this.show(notification.message, notification.type);
      }
    });
  }

  /**
   * Show a toast notification
   * @param {string} message - Notification message
   * @param {string} type - 'success', 'error', 'warning', 'info'
   * @param {number} duration - Auto-hide duration in ms (0 = manual dismiss)
   * @returns {string} Toast ID
   */
  show(message, type = 'info', duration = 3000) {
    if (!this.container) this.init();

    const id = `toast-${Date.now()}`;
    const toast = this._createToast(id, message, type);

    this.container.appendChild(toast);
    this.toasts.set(id, { element: toast, timeout: null });

    // Animate in
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    // Auto-hide
    if (duration) {
      const timeout = setTimeout(() => {
        this.hide(id);
      }, duration);
      this.toasts.get(id).timeout = timeout;
    }

    return id;
  }

  /**
   * Hide a specific toast
   * @param {string} id - Toast ID
   */
  hide(id) {
    const toast = this.toasts.get(id);
    if (!toast) return;

    const { element, timeout } = toast;

    if (timeout) {
      clearTimeout(timeout);
    }

    element.classList.remove('show');

    setTimeout(() => {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
      this.toasts.delete(id);
    }, 300);
  }

  /**
   * Hide all toasts
   */
  hideAll() {
    this.toasts.forEach((_, id) => {
      this.hide(id);
    });
  }

  /**
   * Convenience methods
   */
  success(message, duration = 3000) {
    return this.show(message, 'success', duration);
  }

  error(message, duration = 5000) {
    return this.show(message, 'error', duration);
  }

  warning(message, duration = 4000) {
    return this.show(message, 'warning', duration);
  }

  info(message, duration = 3000) {
    return this.show(message, 'info', duration);
  }

  /**
   * Create toast element
   */
  _createToast(id, message, type) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.id = id;

    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ',
    };

    const icon = icons[type] || icons.info;

    toast.innerHTML = `
      <div class="toast-icon">${icon}</div>
      <div class="toast-content">
        <div class="toast-message">${this._escapeHtml(message)}</div>
      </div>
      <button class="toast-close" aria-label="Close notification">×</button>
    `;

    // Close button
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
      this.hide(id);
    });

    return toast;
  }

  /**
   * Escape HTML to prevent XSS
   */
  _escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Create global instance
const notifications = new NotificationManager();

export default notifications;
