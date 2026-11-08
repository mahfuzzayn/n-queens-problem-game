/**
 * Mobile Storage Adapter Interface and AsyncStorage Implementation.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

export interface StorageAdapter {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
}

export class AsyncStorageAdapter implements StorageAdapter {
  async get<T>(key: string): Promise<T | null> {
    try {
      const raw = await AsyncStorage.getItem(key);
      if (!raw) return null;
      return JSON.parse(raw) as T;
    } catch (e) {
      console.warn(`[AsyncStorageAdapter] Failed to get "${key}":`, e);
      return null;
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`[AsyncStorageAdapter] Failed to set "${key}":`, e);
    }
  }

  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.warn(`[AsyncStorageAdapter] Failed to remove "${key}":`, e);
    }
  }

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (e) {
      console.warn('[AsyncStorageAdapter] Failed to clear storage:', e);
    }
  }
}

export const defaultStorage: StorageAdapter = new AsyncStorageAdapter();
