import { useState, useCallback, useEffect } from 'react';

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
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
};