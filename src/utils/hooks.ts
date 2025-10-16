import { useState, useCallback } from 'react';
import { loadFromLocalStorage, saveToLocalStorage } from './localStorage';

export const useToggle = (initialState = false) => {
  const [state, setState] = useState(initialState);
  const toggle = useCallback(() => setState(prev => !prev), []);
  return [state, toggle] as const;
};

export const useFormState = <T extends Record<string, any>>(initialState: T) => {
  const [state, setState] = useState(initialState);
  const handleChange = useCallback((field: keyof T, value: any) => {
    setState(prev => ({ ...prev, [field]: value }));
  }, []);
  const resetForm = useCallback(() => setState(initialState), [initialState]);
  return { state, handleChange, resetForm };
};

export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => loadFromLocalStorage<T>(key, initialValue));

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      setStoredValue((previousValue) => {
        const valueToStore = value instanceof Function ? value(previousValue) : value;
        saveToLocalStorage(key, valueToStore);
        return valueToStore;
      });
    },
    [key]
  );

  return [storedValue, setValue] as const;
};
