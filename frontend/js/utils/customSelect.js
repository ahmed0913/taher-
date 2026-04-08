/** ═══════════════════════════════════════════════════════════════
 * 🎯 Custom Select - Luxury Dropdown Component
 * ═══════════════════════════════════════════════════════════════ */

export class CustomSelect {
  constructor(element) {
    this.select = element;
    this.options = Array.from(element.options);
    this.isOpen = false;
    this.init();
  }

  /**
   * Initialize custom select
   */
  init() {
    // Create wrapper
    this.wrapper = document.createElement('div');
    this.wrapper.className = 'custom-select';
    this.select.parentNode.insertBefore(this.wrapper, this.select);

    // Create display button
    this.button = document.createElement('button');
    this.button.className = 'custom-select-button';
    this.button.type = 'button';
    this.updateButtonText();
    this.wrapper.appendChild(this.button);

    // Create dropdown menu
    this.menu = document.createElement('div');
    this.menu.className = 'custom-select-menu';
    this.wrapper.appendChild(this.menu);

    // Move original select into wrapper (hidden)
    this.select.style.display = 'none';
    this.wrapper.appendChild(this.select);

    // Populate menu
    this.renderOptions();

    // Event listeners
    this.button.addEventListener('click', () => this.toggle());
    this.select.addEventListener('change', () => this.updateButtonText());

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!this.wrapper.contains(e.target) && this.isOpen) {
        this.close();
      }
    });
  }

  /**
   * Render options in dropdown menu
   */
  renderOptions() {
    this.menu.innerHTML = '';

    this.options.forEach((option) => {
      const item = document.createElement('div');
      item.className = 'custom-select-item';
      item.textContent = option.text;
      
      if (option.selected) {
        item.classList.add('selected');
      }

      item.addEventListener('click', () => {
        this.select.value = option.value;
        this.select.dispatchEvent(new Event('change'));
        this.updateButtonText();
        this.close();
      });

      this.menu.appendChild(item);
    });

    // Add divider
    const divider = document.createElement('div');
    divider.className = 'custom-select-divider';
    this.menu.appendChild(divider);

    // Add create new option
    const createNew = document.createElement('div');
    createNew.className = 'custom-select-item create-new';
    createNew.innerHTML = '➕ Create New Patient';
    createNew.addEventListener('click', () => {
      this.onCreateNew?.();
      this.close();
    });
    this.menu.appendChild(createNew);
  }

  /**
   * Update button text
   */
  updateButtonText() {
    const selected = this.select.options[this.select.selectedIndex];
    this.button.textContent = selected?.text || 'Select...';
  }

  /**
   * Toggle menu
   */
  toggle() {
    this.isOpen ? this.close() : this.open();
  }

  /**
   * Open menu
   */
  open() {
    this.isOpen = true;
    this.menu.classList.add('open');
    this.button.classList.add('open');
  }

  /**
   * Close menu
   */
  close() {
    this.isOpen = false;
    this.menu.classList.remove('open');
    this.button.classList.remove('open');
  }

  /**
   * Set callback for create new
   */
  onCreateNew(callback) {
    this.onCreateNew = callback;
  }
}

/**
 * Initialize all custom selects on page
 */
export function initCustomSelects() {
  document.querySelectorAll('select.custom').forEach(select => {
    if (!select.__customSelect) {
      select.__customSelect = new CustomSelect(select);
    }
  });
}

/**
 * Auto-initialize on module load
 */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCustomSelects);
} else {
  initCustomSelects();
}

export default CustomSelect;
