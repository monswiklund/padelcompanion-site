// Shared Utility Functions

/**
 * Shuffle an array in place using Fisher-Yates algorithm
 * @param {Array} array - The array to shuffle
 * @returns {Array} The shuffled array
 */
export function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Show a toast notification
 * @param {string} message - The message to display
 * @param {number} duration - Duration in ms (default: 3000)
 */
export function showToast(message, arg2, arg3) {
  let duration = 3000;
  let type = "default";

  if (typeof arg2 === "number") {
    duration = arg2;
    if (typeof arg3 === "string") type = arg3;
  } else if (typeof arg2 === "string") {
    type = arg2;
    if (typeof arg3 === "number") duration = arg3;
  }

  const existing = document.querySelector(".toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add("visible"), 10);
  setTimeout(() => {
    toast.classList.remove("visible");
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/**
 * Create a unique ID
 * @returns {number} A unique timestamp-based ID
 */
export function createId() {
  return Math.floor(Date.now() + Math.random() * 1000000);
}
