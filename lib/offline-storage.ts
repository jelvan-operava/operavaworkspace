// Offline Local Storage & Data Persistence Manager

const STORAGE_PREFIX = 'gworkspace_portal_cache_v1_';

export function loadFromLocalStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = window.localStorage.getItem(STORAGE_PREFIX + key);
    if (!item) return defaultValue;
    return JSON.parse(item) as T;
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
}

export function saveToLocalStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Error writing to localStorage key "${key}":`, error);
  }
}

export function clearLocalStorageCache(): void {
  if (typeof window === 'undefined') return;
  try {
    Object.keys(window.localStorage).forEach((key) => {
      if (key.startsWith(STORAGE_PREFIX)) {
        window.localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.warn('Error clearing offline local storage:', error);
  }
}

export const offlineStorage = {
  loadData: (): Record<string, any> | null => {
    return loadFromLocalStorage('all_portal_data', null);
  },
  saveData: (data: Record<string, any>): void => {
    saveToLocalStorage('all_portal_data', data);
  },
  clearCache: clearLocalStorageCache,
};
