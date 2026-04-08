/** ═══════════════════════════════════════════════════════════════
 * 🛡️ Safe DOM Access Utility - Defensive Programming
 * Prevents null reference errors in rendering
 * ═══════════════════════════════════════════════════════════════ */

/**
 * Safely query selector with null check
 * @param {string} selector - CSS selector
 * @param {Element} container - Parent element (defaults to document)
 * @returns {Element|null} - Element or null
 */
export function safeQuery(selector, container = document) {
  try {
    if (!selector || typeof selector !== 'string') {
      console.warn('⚠️ Invalid selector:', selector);
      return null;
    }
    return container.querySelector(selector);
  } catch (error) {
    console.error('❌ Query selector error:', error);
    return null;
  }
}

/**
 * Safely query all elements
 * @param {string} selector - CSS selector
 * @param {Element} container - Parent element
 * @returns {NodeList} - List of elements
 */
export function safeQueryAll(selector, container = document) {
  try {
    if (!selector || typeof selector !== 'string') return [];
    return container.querySelectorAll(selector);
  } catch (error) {
    console.error('❌ QueryAll error:', error);
    return [];
  }
}

/**
 * Safely set innerHTML with safeguards
 * @param {Element} element - Target element
 * @param {string} html - HTML content
 * @returns {boolean} - Success flag
 */
export function safeSetHTML(element, html) {
  if (!element || !(element instanceof Element)) {
    console.warn('⚠️ Invalid element for innerHTML:', element);
    return false;
  }

  try {
    element.innerHTML = html;
    return true;
  } catch (error) {
    console.error('❌ innerHTML error:', error);
    return false;
  }
}

/**
 * Safely set text content
 * @param {Element} element - Target element
 * @param {string} text - Text content
 * @returns {boolean} - Success flag
 */
export function safeSetText(element, text) {
  if (!element || !(element instanceof Element)) {
    console.warn('⚠️ Invalid element for textContent:', element);
    return false;
  }

  try {
    element.textContent = text;
    return true;
  } catch (error) {
    console.error('❌ textContent error:', error);
    return false;
  }
}

/**
 * Safely add event listener
 * @param {Element} element - Target element
 * @param {string} event - Event name
 * @param {Function} handler - Event handler
 * @param {Object} options - Listener options
 * @returns {boolean} - Success flag
 */
export function safeAddListener(element, event, handler, options = {}) {
  if (!element || !(element instanceof Element)) {
    console.warn('⚠️ Invalid element for addEventListener');
    return false;
  }

  if (typeof handler !== 'function') {
    console.warn('⚠️ Invalid handler for addEventListener');
    return false;
  }

  try {
    element.addEventListener(event, handler, options);
    return true;
  } catch (error) {
    console.error('❌ addEventListener error:', error);
    return false;
  }
}

/**
 * Safely remove event listener
 * @param {Element} element - Target element
 * @param {string} event - Event name
 * @param {Function} handler - Event handler
 * @param {Object} options - Listener options
 * @returns {boolean} - Success flag
 */
export function safeRemoveListener(element, event, handler, options = {}) {
  if (!element || !(element instanceof Element)) return false;

  try {
    element.removeEventListener(event, handler, options);
    return true;
  } catch (error) {
    console.error('❌ removeEventListener error:', error);
    return false;
  }
}

/**
 * Safely set attribute
 * @param {Element} element - Target element
 * @param {string} name - Attribute name
 * @param {string} value - Attribute value
 * @returns {boolean} - Success flag
 */
export function safeSetAttr(element, name, value) {
  if (!element || !(element instanceof Element)) return false;

  try {
    element.setAttribute(name, value);
    return true;
  } catch (error) {
    console.error('❌ setAttribute error:', error);
    return false;
  }
}

/**
 * Safely get attribute
 * @param {Element} element - Target element
 * @param {string} name - Attribute name
 * @returns {string|null} - Attribute value or null
 */
export function safeGetAttr(element, name) {
  if (!element || !(element instanceof Element)) return null;

  try {
    return element.getAttribute(name);
  } catch (error) {
    console.error('❌ getAttribute error:', error);
    return null;
  }
}

/**
 * Safely add class
 * @param {Element} element - Target element
 * @param {string} className - Class name(s)
 * @returns {boolean} - Success flag
 */
export function safeAddClass(element, className) {
  if (!element || !(element instanceof Element) || !className) return false;

  try {
    className.split(' ').forEach(cls => {
      if (cls.trim()) element.classList.add(cls.trim());
    });
    return true;
  } catch (error) {
    console.error('❌ classList.add error:', error);
    return false;
  }
}

/**
 * Safely remove class
 * @param {Element} element - Target element
 * @param {string} className - Class name(s)
 * @returns {boolean} - Success flag
 */
export function safeRemoveClass(element, className) {
  if (!element || !(element instanceof Element) || !className) return false;

  try {
    className.split(' ').forEach(cls => {
      if (cls.trim()) element.classList.remove(cls.trim());
    });
    return true;
  } catch (error) {
    console.error('❌ classList.remove error:', error);
    return false;
  }
}

/**
 * Safely toggle class
 * @param {Element} element - Target element
 * @param {string} className - Class name
 * @returns {boolean} - New state
 */
export function safeToggleClass(element, className) {
  if (!element || !(element instanceof Element) || !className) return false;

  try {
    return element.classList.toggle(className);
  } catch (error) {
    console.error('❌ classList.toggle error:', error);
    return false;
  }
}

/**
 * Safely set style
 * @param {Element} element - Target element
 * @param {string} property - CSS property
 * @param {string} value - CSS value
 * @returns {boolean} - Success flag
 */
export function safeSetStyle(element, property, value) {
  if (!element || !(element instanceof Element)) return false;

  try {
    element.style[property] = value;
    return true;
  } catch (error) {
    console.error('❌ style error:', error);
    return false;
  }
}

export const dom = {
  safeQuery,
  safeQueryAll,
  safeSetHTML,
  safeSetText,
  safeAddListener,
  safeRemoveListener,
  safeSetAttr,
  safeGetAttr,
  safeAddClass,
  safeRemoveClass,
  safeToggleClass,
  safeSetStyle
};
