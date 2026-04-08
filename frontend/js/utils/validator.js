/**
 * ✅ Form Validation System with Real-time Feedback
 * Provides validation rules, error messages, and UI feedback
 */

class FormValidator {
  constructor(formElement) {
    this.form = formElement;
    this.fields = new Map();
    this.errors = new Map();
    this.touched = new Set();
    this._init();
  }

  /* ─── Initialization ─── */

  _init() {
    if (!this.form) return;

    // Find all input fields
    const inputs = this.form.querySelectorAll(
      'input, textarea, select'
    );

    inputs.forEach((input) => {
      const name = input.name;
      if (name) {
        this.fields.set(name, {
          element: input,
          rules: [],
          errorElement: null,
          successElement: null,
        });

        // Add event listeners
        input.addEventListener('blur', () => this._validateField(name));
        input.addEventListener('input', () => {
          if (this.touched.has(name)) {
            this._validateField(name);
          }
        });
        input.addEventListener('change', () => this._validateField(name));
      }
    });

    // Form submit
    this.form.addEventListener('submit', (e) => {
      if (!this.validate()) {
        e.preventDefault();
      }
    });
  }

  /* ─── Rule Management ─── */

  /**
   * Add validation rule to field
   * @param {string} fieldName - Field name
   * @param {string} ruleName - Rule name ('required', 'email', 'min', etc.)
   * @param {*} value - Rule parameter (e.g., min length)
   * @param {string} message - Custom error message
   */
  addRule(fieldName, ruleName, value = null, message = null) {
    const field = this.fields.get(fieldName);
    if (!field) return this;

    field.rules.push({
      name: ruleName,
      value,
      message,
    });

    return this;
  }

  /**
   * Add multiple rules at once
   * @param {string} fieldName - Field name
   * @param {string} rulesString - Rules in format: 'required|email|min:8'
   */
  addRules(fieldName, rulesString) {
    const rules = rulesString.split('|');

    rules.forEach((rule) => {
      let ruleName = rule;
      let ruleValue = null;

      if (rule.includes(':')) {
        [ruleName, ruleValue] = rule.split(':');
      }

      this.addRule(fieldName, ruleName, ruleValue);
    });

    return this;
  }

  /* ─── Validation Logic ─── */

  /**
   * Validate entire form
   * @returns {boolean} Is form valid
   */
  validate() {
    let isValid = true;

    this.fields.forEach((_, fieldName) => {
      if (!this._validateField(fieldName)) {
        isValid = false;
      }
    });

    return isValid;
  }

  /**
   * Validate single field
   * @param {string} fieldName - Field name
   * @returns {boolean} Is field valid
   */
  _validateField(fieldName) {
    const field = this.fields.get(fieldName);
    if (!field) return true;

    const { element, rules } = field;
    this.touched.add(fieldName);

    let error = null;

    // Run validation rules
    for (const rule of rules) {
      error = this._runRule(element, rule);
      if (error) break;
    }

    this._setFieldError(fieldName, error);
    return !error;
  }

  /**
   * Run individual validation rule
   */
  _runRule(element, rule) {
    const value = element.value?.trim() || '';
    const { name, value: ruleValue, message } = rule;

    // Get default message
    const defaultMessage = this._getDefaultMessage(name, ruleValue);
    const errorMessage = message || defaultMessage;

    switch (name) {
      case 'required':
        return !value ? errorMessage : null;

      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return value && !emailRegex.test(value) ? errorMessage : null;

      case 'phone':
        const phoneRegex = /^[0-9\s\-\+\(\)]{10,}$/;
        return value && !phoneRegex.test(value) ? errorMessage : null;

      case 'min':
        return value && value.length < parseInt(ruleValue)
          ? errorMessage
          : null;

      case 'max':
        return value && value.length > parseInt(ruleValue)
          ? errorMessage
          : null;

      case 'minNumber':
        return value && parseInt(value) < parseInt(ruleValue)
          ? errorMessage
          : null;

      case 'maxNumber':
        return value && parseInt(value) > parseInt(ruleValue)
          ? errorMessage
          : null;

      case 'number':
        return value && isNaN(value) ? errorMessage : null;

      case 'date':
        return value && isNaN(new Date(value))
          ? errorMessage
          : null;

      case 'url':
        try {
          new URL(value);
          return null;
        } catch {
          return value ? errorMessage : null;
        }

      case 'pattern':
        const regex = new RegExp(ruleValue);
        return value && !regex.test(value) ? errorMessage : null;

      case 'match':
        const matchField = document.querySelector(`[name="${ruleValue}"]`);
        return value !== matchField?.value ? errorMessage : null;

      case 'custom':
        // Custom validator function passed in ruleValue
        return !ruleValue(value) ? errorMessage : null;

      default:
        return null;
    }
  }

  /**
   * Get default error message for rule
   */
  _getDefaultMessage(ruleName, ruleValue) {
    const messages = {
      required: 'This field is required',
      email: 'Enter a valid email address',
      phone: 'Enter a valid phone number',
      min: `Must be at least ${ruleValue} characters`,
      max: `Must be at most ${ruleValue} characters`,
      minNumber: `Must be at least ${ruleValue}`,
      maxNumber: `Must be at most ${ruleValue}`,
      number: 'Must be a valid number',
      date: 'Must be a valid date',
      url: 'Must be a valid URL',
      pattern: 'Invalid format',
      match: 'Fields do not match',
    };

    return messages[ruleName] || 'Invalid value';
  }

  /* ─── Error Display ─── */

  /**
   * Set field error and update UI
   */
  _setFieldError(fieldName, error) {
    const field = this.fields.get(fieldName);
    if (!field) return;

    const { element } = field;

    this.errors.set(fieldName, error);

    this._updateFieldDisplay(element, error);
  }

  /**
   * Update field display (add/remove error/success classes)
   */
  _updateFieldDisplay(element, error) {
    // Remove existing error/success elements
    const existingError = element.parentNode?.querySelector('.form-error');
    const existingSuccess = element.parentNode?.querySelector('.form-success');

    if (existingError) existingError.remove();
    if (existingSuccess) existingSuccess.remove();

    // Update field classes
    if (error) {
      element.classList.remove('is-valid');
      element.classList.add('is-invalid');

      // Add error message
      const errorEl = document.createElement('div');
      errorEl.className = 'form-error';
      errorEl.textContent = `❌ ${error}`;
      element.parentNode?.appendChild(errorEl);
    } else if (element.value?.trim()) {
      element.classList.remove('is-invalid');
      element.classList.add('is-valid');

      // Add success message
      const successEl = document.createElement('div');
      successEl.className = 'form-success';
      successEl.textContent = '✓ Valid';
      element.parentNode?.appendChild(successEl);
    } else {
      element.classList.remove('is-invalid', 'is-valid');
    }
  }

  /* ─── Utilities ─── */

  /**
   * Get all form data as object
   */
  getData() {
    const data = {};

    this.fields.forEach((field, name) => {
      data[name] = field.element.value;
    });

    return data;
  }

  /**
   * Set form data
   */
  setData(data) {
    Object.keys(data).forEach((name) => {
      const field = this.fields.get(name);
      if (field) {
        field.element.value = data[name];
      }
    });
  }

  /**
   * Reset form
   */
  reset() {
    this.form?.reset();
    this.errors.clear();
    this.touched.clear();
    this.fields.forEach((field) => {
      field.element.classList.remove('is-valid', 'is-invalid');
      const errorEl = field.element.parentNode?.querySelector('.form-error');
      const successEl = field.element.parentNode?.querySelector('.form-success');
      errorEl?.remove();
      successEl?.remove();
    });
  }

  /**
   * Reset specific field
   */
  resetField(fieldName) {
    const field = this.fields.get(fieldName);
    if (!field) return;

    field.element.value = '';
    this.errors.delete(fieldName);
    this.touched.delete(fieldName);
    field.element.classList.remove('is-valid', 'is-invalid');

    const errorEl = field.element.parentNode?.querySelector('.form-error');
    const successEl = field.element.parentNode?.querySelector('.form-success');
    errorEl?.remove();
    successEl?.remove();
  }

  /**
   * Get all errors as object
   */
  getErrors() {
    const errors = {};
    this.errors.forEach((error, fieldName) => {
      if (error) {
        errors[fieldName] = error;
      }
    });
    return errors;
  }

  /**
   * Check if form is valid (including untouched fields)
   */
  isValid() {
    return Object.keys(this.getErrors()).length === 0;
  }

  /**
   * Get specific field error
   */
  getError(fieldName) {
    return this.errors.get(fieldName) || null;
  }

  /**
   * Check if field has been touched
   */
  isTouched(fieldName) {
    return this.touched.has(fieldName);
  }
}

export default FormValidator;
