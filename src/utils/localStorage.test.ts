import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  __LOCAL_STORAGE_TESTING__,
  loadFromLocalStorage,
  removeFromLocalStorage,
  saveToLocalStorage
} from './localStorage';

class MemoryStorage implements Storage {
  private readonly store = new Map<string, string>();

  get length(): number {
    return this.store.size;
  }

  clear(): void {
    this.store.clear();
  }

  getItem(key: string): string | null {
    return this.store.has(key) ? this.store.get(key)! : null;
  }

  key(index: number): string | null {
    return Array.from(this.store.keys())[index] ?? null;
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }
}

const stubWindowWithStorage = (storage: Storage): void => {
  const windowMock = {
    localStorage: storage
  } as unknown as Window & typeof globalThis;

  vi.stubGlobal('window', windowMock);
};

describe('localStorage utilities', () => {
  beforeEach(() => {
    __LOCAL_STORAGE_TESTING__.resetCache();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    __LOCAL_STORAGE_TESTING__.resetCache();
  });

  it('returns the default value when localStorage is unavailable', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const result = loadFromLocalStorage('missing', 'fallback');

    expect(result).toBe('fallback');
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('saves and loads values when localStorage is available', () => {
    const storage = new MemoryStorage();
    stubWindowWithStorage(storage);

    saveToLocalStorage('key', { foo: 'bar' });
    expect(storage.getItem('key')).toBe(JSON.stringify({ foo: 'bar' }));

    const value = loadFromLocalStorage('key', { foo: 'baz' });
    expect(value).toEqual({ foo: 'bar' });
  });

  it('removes values when localStorage is available', () => {
    const storage = new MemoryStorage();
    storage.setItem('key', JSON.stringify({ foo: 'bar' }));
    stubWindowWithStorage(storage);

    removeFromLocalStorage('key');

    expect(storage.getItem('key')).toBeNull();
  });

  it('logs a warning when attempting to save without localStorage support', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    saveToLocalStorage('key', 'value');

    expect(warnSpy).toHaveBeenCalledWith(
      'localStorage est indisponible; impossible de sauvegarder la clé key.'
    );
  });

  it('returns the default value and logs when JSON parsing fails', () => {
    const storage = new MemoryStorage();
    storage.setItem('broken', '{invalid');
    stubWindowWithStorage(storage);
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const result = loadFromLocalStorage('broken', { foo: 'default' });

    expect(result).toEqual({ foo: 'default' });
    expect(warnSpy).toHaveBeenCalledWith(
      'Erreur lors de la lecture de broken depuis localStorage:',
      expect.any(SyntaxError)
    );
  });
});
