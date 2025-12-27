/**
 * Storage Service
 * Centralized wrapper for localStorage with type safety and error handling.
 */

export const StorageService = {
  /**
   * Get an item from storage
   */
  getItem<T>(key: string, defaultValue: T | null = null): T | null {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;
      return JSON.parse(item) as T;
    } catch (e) {
      console.warn(`[Storage] Failed to load key "${key}":`, e);
      return defaultValue;
    }
  },

  /**
   * Save an item to storage
   */
  setItem<T>(key: string, value: T): boolean {
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
   */
  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn(`[Storage] Failed to remove key "${key}":`, e);
    }
  },

  /**
   * Clear all items (use with caution)
   */
  clear(): void {
    try {
      localStorage.clear();
    } catch (e) {
      console.warn("[Storage] Failed to clear storage:", e);
    }
  },
};
