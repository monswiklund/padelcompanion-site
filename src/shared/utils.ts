// Shared Utility Functions

/**
 * Shuffle an array in place using Fisher-Yates algorithm
 */
export function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

type ToastType = "default" | "success" | "error" | "warning" | "info";

interface ToastOptions {
  type?: ToastType;
  duration?: number;
  dismissible?: boolean;
}

/**
 * Show a toast notification
 */
export function showToast(
  message: string,
  options: ToastOptions | number | string = {}
): void {
  let type: ToastType = "default";
  let duration: number | undefined;
  let dismissible: boolean | undefined;

  // Legacy support: showToast(msg, duration) or showToast(msg, type)
  if (typeof options === "number") {
    duration = options;
  } else if (typeof options === "string") {
    type = options as ToastType;
  } else if (typeof options === "object") {
    type = options.type ?? "default";
    duration = options.duration;
    dismissible = options.dismissible;
  }

  // Smart defaults per type
  const defaults: Record<
    ToastType,
    { duration: number; dismissible: boolean }
  > = {
    success: { duration: 2500, dismissible: false },
    info: { duration: 3000, dismissible: false },
    warning: { duration: 5000, dismissible: true },
    error: { duration: 0, dismissible: true }, // 0 = sticky
    default: { duration: 3000, dismissible: false },
  };

  const typeDefaults = defaults[type] || defaults.default;
  duration = duration ?? typeDefaults.duration;
  dismissible = dismissible ?? typeDefaults.dismissible;

  // Remove existing toast
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();

  // Type icons
  const icons: Record<ToastType, string> = {
    success: "✓",
    error: "✕",
    warning: "⚠",
    info: "ℹ",
    default: "",
  };

  // Create toast element
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;

  // Correct ARIA: error = alert (assertive), others = status (polite)
  if (type === "error") {
    toast.setAttribute("role", "alert");
    toast.setAttribute("aria-live", "assertive");
  } else {
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
  }

  // Build content with textContent (XSS-safe)
  const icon = icons[type] || "";
  if (icon) {
    const iconSpan = document.createElement("span");
    iconSpan.className = "toast-icon";
    iconSpan.textContent = icon;
    toast.appendChild(iconSpan);
  }

  const messageSpan = document.createElement("span");
  messageSpan.className = "toast-message";
  messageSpan.textContent = message;
  toast.appendChild(messageSpan);

  // Dismiss function
  const dismiss = () => {
    toast.classList.remove("visible");
    setTimeout(() => toast.remove(), 300);
  };

  // Close button for dismissible toasts
  if (dismissible) {
    const closeBtn = document.createElement("button");
    closeBtn.className = "toast-close";
    closeBtn.setAttribute("aria-label", "Close notification");
    closeBtn.textContent = "×";
    closeBtn.addEventListener("click", dismiss);
    toast.appendChild(closeBtn);
  }

  document.body.appendChild(toast);

  // Keyboard support: Esc to dismiss
  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === "Escape" && dismissible) {
      dismiss();
      document.removeEventListener("keydown", handleKeydown);
    }
  };
  if (dismissible) {
    document.addEventListener("keydown", handleKeydown);
  }

  // Show with animation
  setTimeout(() => toast.classList.add("visible"), 10);

  // Auto-dismiss (unless sticky: duration = 0)
  if (duration > 0) {
    setTimeout(() => {
      dismiss();
      document.removeEventListener("keydown", handleKeydown);
    }, duration);
  }
}

/**
 * Create a unique ID
 */
export function createId(): string {
  return String(Math.floor(Date.now() + Math.random() * 1000000));
}
