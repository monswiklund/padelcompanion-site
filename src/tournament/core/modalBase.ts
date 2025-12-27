/**
 * Modal Base Module
 * Shared infrastructure for creating consistent modals.
 */

interface ModalOptions {
  className: string;
  maxWidth?: string;
  dismissOnOutsideClick?: boolean;
  dismissOnEscape?: boolean;
  onClose?: () => void;
}

interface ModalResult {
  overlay: HTMLDivElement;
  innerModal: HTMLDivElement;
  close: () => void;
}

/**
 * Create a modal overlay with inner modal container.
 */
export function createModal(options: ModalOptions): ModalResult {
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
  const overlay = document.createElement("div") as HTMLDivElement;
  overlay.className = `modal-overlay ${className}`;
  overlay.style.display = "flex";

  // Create inner modal container
  const innerModal = document.createElement("div") as HTMLDivElement;
  innerModal.className = "modal";
  innerModal.style.maxWidth = maxWidth;
  overlay.appendChild(innerModal);

  let escapeHandler: ((e: KeyboardEvent) => void) | null = null;

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
  if (dismissOnEscape) {
    escapeHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", escapeHandler);
  }

  return { overlay, innerModal, close };
}

/**
 * Animate modal in (add visible class after paint).
 */
export function animateIn(overlay: HTMLElement): void {
  document.body.appendChild(overlay);
  setTimeout(() => overlay.classList.add("visible"), 10);
}

/**
 * Build standard modal header HTML.
 */
export function buildHeader(title: string, showCloseX = false): string {
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
 */
export function buildBody(
  content: string,
  style: Record<string, string> = {}
): string {
  const styleStr = Object.entries(style)
    .map(([k, v]) => `${k}:${v}`)
    .join(";");
  return `<div class="modal-body"${
    styleStr ? ` style="${styleStr}"` : ""
  }>${content}</div>`;
}

/**
 * Build standard modal footer HTML.
 */
export function buildFooter(
  buttons: string,
  style: Record<string, string> = {}
): string {
  const styleStr = Object.entries(style)
    .map(([k, v]) => `${k}:${v}`)
    .join(";");
  return `<div class="modal-footer"${
    styleStr ? ` style="${styleStr}"` : ""
  }>${buttons}</div>`;
}
