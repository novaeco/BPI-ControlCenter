const LOCAL_STORAGE_TEST_KEY = '__bpi_local_storage_test__';

let cachedStorage: Storage | null | undefined;

const resolveStorage = (): Storage | null => {
  if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
    return null;
  }

  try {
    const { localStorage } = window;
    localStorage.setItem(LOCAL_STORAGE_TEST_KEY, LOCAL_STORAGE_TEST_KEY);
    localStorage.removeItem(LOCAL_STORAGE_TEST_KEY);
    return localStorage;
  } catch {
    return null;
  }
};

const getStorage = (): Storage | null => {
  if (cachedStorage === undefined) {
    cachedStorage = resolveStorage();
  }

  return cachedStorage;
};

export const loadFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  const storage = getStorage();
  if (!storage) {
    return defaultValue;
  }

  try {
    const item = storage.getItem(key);
    return item ? (JSON.parse(item) as T) : defaultValue;
  } catch (error) {
    console.warn(`Erreur lors de la lecture de ${key} depuis localStorage:`, error);
    return defaultValue;
  }
};

export const saveToLocalStorage = <T>(key: string, value: T): void => {
  const storage = getStorage();
  if (!storage) {
    console.warn(`localStorage est indisponible; impossible de sauvegarder la clé ${key}.`);
    return;
  }

  try {
    storage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Erreur lors de la sauvegarde de ${key} dans localStorage:`, error);
  }
};

export const removeFromLocalStorage = (key: string): void => {
  const storage = getStorage();
  if (!storage) {
    console.warn(`localStorage est indisponible; impossible de supprimer la clé ${key}.`);
    return;
  }

  try {
    storage.removeItem(key);
  } catch (error) {
    console.warn(`Erreur lors de la suppression de ${key} depuis localStorage:`, error);
  }
};

export const __LOCAL_STORAGE_TESTING__ = {
  resetCache: (): void => {
    cachedStorage = undefined;
  }
};
