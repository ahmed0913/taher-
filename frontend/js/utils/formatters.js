/** ═══════════════════════════════════════════════════════════════
 * 📅 Formatters - Date, Phone, Text Formatting
 * ═══════════════════════════════════════════════════════════════ */

export const formatters = {
  /**
   * Format date (YYYY-MM-DD → Display format)
   */
  formatDate(dateString, format = 'long') {
    if (!dateString) return '';

    const date = new Date(dateString);
    if (isNaN(date)) return dateString;

    const options = {
      short: { month: '2-digit', day: '2-digit', year: '2-digit' },
      long: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' },
      medium: { month: 'short', day: 'numeric', year: 'numeric' }
    };

    return date.toLocaleDateString('en-US', options[format] || options.long);
  },

  /**
   * Format time
   */
  formatTime(dateString) {
    if (!dateString) return '';

    const date = new Date(dateString);
    if (isNaN(date)) return dateString;

    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  },

  /**
   * Format date and time
   */
  formatDateTime(dateString) {
    return this.formatDate(dateString, 'long') + ' ' + this.formatTime(dateString);
  },

  /**
   * Format phone number (XXX-XXX-XXXX)
   */
  formatPhone(phone) {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  },

  /**
   * Format currency
   */
  formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  },

  /**
   * Capitalize first letter
   */
  capitalize(text) {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  },

  /**
   * Truncate text
   */
  truncate(text, length = 50, suffix = '...') {
    if (!text) return '';
    if (text.length <= length) return text;
    return text.substring(0, length) + suffix;
  },

  /**
   * Get initials from name
   */
  getInitials(name) {
    if (!name) return '';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  },

  /**
   * Get relative time (Today, Yesterday, 2 days ago, etc.)
   */
  getRelativeTime(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Normalize dates to compare only date part
    date.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    yesterday.setHours(0, 0, 0, 0);

    if (date.getTime() === today.getTime()) {
      return 'Today';
    } else if (date.getTime() === yesterday.getTime()) {
      return 'Yesterday';
    } else {
      const daysAgo = Math.floor((today - date) / (1000 * 60 * 60 * 24));
      if (daysAgo > 0) {
        return `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`;
      }
      const daysAhead = Math.floor((date - today) / (1000 * 60 * 60 * 24));
      if (daysAhead > 0) {
        return `In ${daysAhead} day${daysAhead > 1 ? 's' : ''}`;
      }
    }

    return this.formatDate(dateString, 'medium');
  },

  /**
   * Format duration
   */
  formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const parts = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (secs > 0) parts.push(`${secs}s`);

    return parts.join(' ');
  }
};

export default formatters;
