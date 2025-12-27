/**
 * Storage Service
 * Centralized wrapper for localStorage with type safety and error handling.
 */

export const StorageService = {
  /**
   * Get an item from storage
   * @param {string} key - Storage key
   * @param {*} defaultValue - Default value if key doesn't exist or error occurs
   * @returns {*} Parsed value or default
   */
  getItem(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;
      return JSON.parse(item);
    } catch (e) {
      console.warn(`[Storage] Failed to load key "${key}":`, e);
      return defaultValue;
    }
  },

  /**
   * Save an item to storage
   * @param {string} key - Storage key
   * @param {*} value - Value to store (will be JSON.stringified)
   * @returns {boolean} True if successful
   */
  setItem(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error(`[Storage] Failed to save key "${key}":`, e);
      return false;
    }
  },

  /**
   * Remove an item from storage
   * @param {string} key - Storage key
   */
  removeItem(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn(`[Storage] Failed to remove key "${key}":`, e);
    }
  },

  /**
   * Clear all items (use with caution)
   */
  clear() {
    try {
      localStorage.clear();
    } catch (e) {
      console.warn("[Storage] Failed to clear storage:", e);
    }
  },
};
