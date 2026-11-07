/**
 * Storage Adapter Interface and Implementations.
 * 
 * Defines a decoupled persistence contract so that:
 * 1. Web uses LocalStorageAdapter (with memory fallback)
 * 2. React Native (Phase 2) can swap to AsyncStorage
 * 3. Cloud/backend (Phase 3) can swap to an API adapter
 */

export interface StorageAdapter {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
}

/**
 * In-memory fallback adapter for SSR, incognito restrictions, or tests.
 */
export class MemoryStorageAdapter implements StorageAdapter {
  private memory = new Map<string, string>();

  async get<T>(key: string): Promise<T | null> {
    const raw = this.memory.get(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    this.memory.set(key, JSON.stringify(value));
  }

  async remove(key: string): Promise<void> {
    this.memory.delete(key);
  }

  async clear(): Promise<void> {
    this.memory.clear();
  }
}

/**
 * Browser localStorage adapter with automatic memory fallback.
 */
export class LocalStorageAdapter implements StorageAdapter {
  private fallback = new MemoryStorageAdapter();

  private isAvailable(): boolean {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    try {
      const testKey = '__storage_test__';
      window.localStorage.setItem(testKey, testKey);
      window.localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.isAvailable()) {
      return this.fallback.get<T>(key);
    }
    try {
      const item = window.localStorage.getItem(key);
      if (!item) return null;
      return JSON.parse(item) as T;
    } catch (e) {
      console.warn(`[LocalStorageAdapter] Failed to get "${key}":`, e);
      return this.fallback.get<T>(key);
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    if (!this.isAvailable()) {
      return this.fallback.set<T>(key, value);
    }
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`[LocalStorageAdapter] Quota or access error setting "${key}", falling back to memory:`, e);
      await this.fallback.set<T>(key, value);
    }
  }

  async remove(key: string): Promise<void> {
    if (!this.isAvailable()) {
      return this.fallback.remove(key);
    }
    try {
      window.localStorage.removeItem(key);
    } catch {
      await this.fallback.remove(key);
    }
  }

  async clear(): Promise<void> {
    if (!this.isAvailable()) {
      return this.fallback.clear();
    }
    try {
      window.localStorage.clear();
    } catch {
      await this.fallback.clear();
    }
  }
}

// Global default storage adapter instance
export const defaultStorage: StorageAdapter = new LocalStorageAdapter();
