/** ═══════════════════════════════════════════════════════════════
 * ⏳ Loaders & Skeleton Screens
 * ═══════════════════════════════════════════════════════════════ */

export const loader = {
  container: null,

  /**
   * Initialize global loader
   */
  init() {
    if (this.container) return;
    this.container = document.createElement('div');
    this.container.id = 'global-loader';
    this.container.style.cssText = `
      position: fixed;
      inset: 0;
      background: var(--surface);
      z-index: 500;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 2rem;
      opacity: 0;
      visibility: hidden;
      transition: opacity 250ms, visibility 250ms;
    `;
    this.container.innerHTML = `
      <div style="
        width: 50px;
        height: 50px;
        border: 4px solid var(--surface-secondary);
        border-top-color: var(--neon-blue);
        border-radius: 50%;
        animation: spin 1s linear infinite;
      "></div>
      <div style="text-align: center;">
        <div style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem;">Loading...</div>
        <div style="font-size: 0.875rem; color: var(--text-secondary);">Please wait a moment</div>
      </div>
    `;
    document.body.appendChild(this.container);
  },

  /**
   * Show global loader
   */
  show() {
    this.init();
    this.container.style.opacity = '1';
    this.container.style.visibility = 'visible';
    console.log('⏳ Loader shown');
  },

  /**
   * Hide global loader
   */
  hide() {
    if (!this.container) return;
    this.container.style.opacity = '0';
    this.container.style.visibility = 'hidden';
    console.log('✅ Loader hidden');
  }
};

/**
 * Create skeleton loader for cards
 */
export function createSkeletonCard() {
  const card = document.createElement('div');
  card.className = 'skeleton skeleton-card';
  card.style.cssText = `
    border-radius: 1rem;
    padding: 1.5rem;
    gap: 1rem;
    display: flex;
    flex-direction: column;
  `;
  card.innerHTML = `
    <div class="skeleton skeleton-text" style="height: 1.5rem; width: 60%;"></div>
    <div class="skeleton skeleton-text" style="height: 1rem;"></div>
    <div class="skeleton skeleton-text" style="height: 1rem; width: 80%;"></div>
    <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
      <div class="skeleton" style="flex: 1; height: 2.5rem; border-radius: 0.5rem;"></div>
      <div class="skeleton" style="flex: 1; height: 2.5rem; border-radius: 0.5rem;"></div>
    </div>
  `;
  return card;
}

/**
 * Create skeleton grid loader
 */
export function createSkeletonGrid(columns = 3, rows = 3) {
  const grid = document.createElement('div');
  grid.style.cssText = `
    display: grid;
    grid-template-columns: repeat(${columns}, 1fr);
    gap: 1.5rem;
  `;
  for (let i = 0; i < rows * columns; i++) {
    grid.appendChild(createSkeletonCard());
  }
  return grid;
}

/**
 * Create skeleton list loader
 */
export function createSkeletonList(items = 5) {
  const list = document.createElement('div');
  list.style.cssText = `
    display: flex;
    flex-direction: column;
    gap: 1rem;
  `;
  for (let i = 0; i < items; i++) {
    const item = document.createElement('div');
    item.style.cssText = `
      display: flex;
      gap: 1rem;
      padding: 1rem;
      border-radius: 0.5rem;
    `;
    item.innerHTML = `
      <div class="skeleton skeleton-avatar"></div>
      <div style="flex: 1; display: flex; flex-direction: column; gap: 0.5rem;">
        <div class="skeleton skeleton-text" style="width: 40%;"></div>
        <div class="skeleton skeleton-text" style="width: 70%;"></div>
      </div>
    `;
    list.appendChild(item);
  }
  return list;
}

/**
 * Create loading spinner
 */
export function createSpinner(size = 'md') {
  const sizes = {
    sm: '24px',
    md: '40px',
    lg: '60px'
  };

  const spinner = document.createElement('div');
  spinner.style.cssText = `
    width: ${sizes[size] || sizes.md};
    height: ${sizes[size] || sizes.md};
    border: 3px solid var(--surface-secondary);
    border-top-color: var(--neon-blue);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  `;
  return spinner;
}

/**
 * Create loading dots
 */
export function createLoadingDots() {
  const dots = document.createElement('div');
  dots.style.cssText = `
    display: flex;
    gap: 0.5rem;
    align-items: center;
  `;
  for (let i = 0; i < 3; i++) {
    const dot = document.createElement('div');
    dot.style.cssText = `
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--neon-blue);
      animation: bounce 1.4s ease-in-out infinite;
      animation-delay: ${0.2 * i}s;
    `;
    dots.appendChild(dot);
  }
  return dots;
}

/**
 * Show loader on element
 */
export function showElementLoader(element) {
  const overlay = document.createElement('div');
  overlay.className = 'element-loader';
  overlay.style.cssText = `
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: inherit;
    z-index: 10;
  `;
  overlay.appendChild(createSpinner('md'));
  element.style.position = 'relative';
  element.appendChild(overlay);
  console.log('⏳ Element loader shown on:', element);
  return overlay;
}

/**
 * Hide element loader
 */
export function hideElementLoader(element) {
  const loader = element.querySelector('.element-loader');
  if (loader) {
    loader.remove();
    console.log('✅ Element loader hidden');
  }
}

export default { loader, createSkeletonCard, createSkeletonGrid, createSkeletonList, createSpinner, createLoadingDots };
