/**
 * Modal Base Module
 * Shared infrastructure for creating consistent modals.
 * Handles: DOM creation, animations, keyboard/click-outside dismissal.
 */

/**
 * Create a modal overlay with inner modal container.
 * @param {Object} options
 * @param {string} options.className - Unique class for this modal type (e.g., 'confirm-modal')
 * @param {string} [options.maxWidth='400px'] - Max width of modal
 * @param {boolean} [options.dismissOnOutsideClick=true] - Close on overlay click
 * @param {boolean} [options.dismissOnEscape=true] - Close on Escape key
 * @param {Function} [options.onClose] - Callback when modal closes
 * @returns {{ overlay: HTMLElement, innerModal: HTMLElement, close: Function }}
 */
export function createModal(options = {}) {
  const {
    className,
    maxWidth = "400px",
    dismissOnOutsideClick = true,
    dismissOnEscape = true,
    onClose = null,
  } = options;

  // Remove existing modal of same type
  const existing = document.querySelector(`.${className}`);
  if (existing) existing.remove();

  // Create overlay
  const overlay = document.createElement("div");
  overlay.className = `modal-overlay ${className}`;
  overlay.style.display = "flex";

  // Create inner modal container
  const innerModal = document.createElement("div");
  innerModal.className = "modal";
  innerModal.style.maxWidth = maxWidth;
  overlay.appendChild(innerModal);

  // Close function
  const close = () => {
    overlay.classList.remove("visible");
    setTimeout(() => {
      overlay.remove();
      if (escapeHandler) {
        document.removeEventListener("keydown", escapeHandler);
      }
      if (onClose) onClose();
    }, 300);
  };

  // Stop clicks inside modal from bubbling to overlay
  innerModal.addEventListener("click", (e) => e.stopPropagation());

  // Click outside to dismiss
  if (dismissOnOutsideClick) {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) close();
    });
  }

  // Escape key to dismiss
  let escapeHandler = null;
  if (dismissOnEscape) {
    escapeHandler = (e) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", escapeHandler);
  }

  return { overlay, innerModal, close };
}

/**
 * Animate modal in (add visible class after paint).
 * @param {HTMLElement} overlay
 */
export function animateIn(overlay) {
  document.body.appendChild(overlay);
  // Trigger after paint for CSS transition
  setTimeout(() => overlay.classList.add("visible"), 10);
}

/**
 * Build standard modal header HTML.
 * @param {string} title
 * @param {boolean} [showCloseX=false]
 * @returns {string}
 */
export function buildHeader(title, showCloseX = false) {
  const closeBtn = showCloseX
    ? `<button class="close-modal modal-close-x" style="background:none; border:none; cursor:pointer; font-size:1.5rem; color:var(--text-muted);">&times;</button>`
    : "";
  return `
    <div class="modal-header">
      <h3>${title}</h3>
      ${closeBtn}
    </div>
  `;
}

/**
 * Build standard modal body HTML.
 * @param {string} content - Inner HTML content
 * @param {Object} [style] - Optional inline styles
 * @returns {string}
 */
export function buildBody(content, style = {}) {
  const styleStr = Object.entries(style)
    .map(([k, v]) => `${k}:${v}`)
    .join(";");
  return `<div class="modal-body"${
    styleStr ? ` style="${styleStr}"` : ""
  }>${content}</div>`;
}

/**
 * Build standard modal footer HTML.
 * @param {string} buttons - Button HTML
 * @param {Object} [style] - Optional inline styles
 * @returns {string}
 */
export function buildFooter(buttons, style = {}) {
  const styleStr = Object.entries(style)
    .map(([k, v]) => `${k}:${v}`)
    .join(";");
  return `<div class="modal-footer"${
    styleStr ? ` style="${styleStr}"` : ""
  }>${buttons}</div>`;
}
