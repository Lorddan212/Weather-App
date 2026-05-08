/**
 * useLocalStorage Hook
 * 
 * Custom hook for persisting state to localStorage.
 * Handles JSON serialization, error handling, and SSR compatibility.
 */

import { useState, useCallback } from 'react';

interface UseLocalStorageOptions<T> {
  key: string;
  initialValue: T;
  serialize?: (value: T) => string;
  deserialize?: (value: string) => T;
}

interface UseLocalStorageReturn<T> {
  value: T;
  setValue: (value: T | ((prev: T) => T)) => void;
  removeValue: () => void;
  isLoaded: boolean;
}

/**
 * Check if localStorage is available
 */
const isLocalStorageAvailable = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  try {
    const test = '__localStorage_test__';
    window.localStorage.setItem(test, test);
    window.localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

/**
 * Hook for persisting state to localStorage
 * 
 * @param options - Configuration options
 * @returns Stored value and control functions
 */
export function useLocalStorage<T>({
  key,
  initialValue,
  serialize = JSON.stringify,
  deserialize = JSON.parse,
}: UseLocalStorageOptions<T>): UseLocalStorageReturn<T> {
  const [state, setState] = useState<{
    value: T;
    isLoaded: boolean;
  }>(() => {
    if (!isLocalStorageAvailable()) {
      return { value: initialValue, isLoaded: true };
    }

    try {
      const item = window.localStorage.getItem(key);
      return {
        value: item ? deserialize(item) : initialValue,
        isLoaded: true,
      };
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return { value: initialValue, isLoaded: true };
    }
  });

  // Save to localStorage when value changes
  const setValue = useCallback((newValue: T | ((prev: T) => T)) => {
    setState((prev) => {
      const valueToStore = newValue instanceof Function ? newValue(prev.value) : newValue;
      
      if (isLocalStorageAvailable()) {
        try {
          window.localStorage.setItem(key, serialize(valueToStore));
        } catch (error) {
          console.warn(`Error setting localStorage key "${key}":`, error);
        }
      }
      
      return { ...prev, value: valueToStore };
    });
  }, [key, serialize]);

  // Remove from localStorage
  const removeValue = useCallback(() => {
    if (isLocalStorageAvailable()) {
      try {
        window.localStorage.removeItem(key);
      } catch (error) {
        console.warn(`Error removing localStorage key "${key}":`, error);
      }
    }
    setState((prev) => ({ ...prev, value: initialValue }));
  }, [key, initialValue]);

  return {
    value: state.value,
    setValue,
    removeValue,
    isLoaded: state.isLoaded,
  };
}

/**
 * Hook for managing search history in localStorage
 */
export interface SearchHistoryItem {
  city: string;
  country: string;
  timestamp: number;
}

interface UseSearchHistoryReturn {
  history: SearchHistoryItem[];
  addToHistory: (city: string, country: string) => void;
  removeFromHistory: (city: string) => void;
  clearHistory: () => void;
  isLoaded: boolean;
}

const MAX_HISTORY_ITEMS = 10;

export const useSearchHistory = (): UseSearchHistoryReturn => {
  const { value, setValue, isLoaded } = useLocalStorage<SearchHistoryItem[]>({
    key: 'weather-app-search-history',
    initialValue: [],
  });

  const addToHistory = useCallback((city: string, country: string) => {
    setValue((prev) => {
      // Remove if already exists
      const filtered = prev.filter((item) => 
        item.city.toLowerCase() !== city.toLowerCase()
      );
      
      // Add new item at the beginning
      const newItem: SearchHistoryItem = {
        city,
        country,
        timestamp: Date.now(),
      };
      
      // Keep only the most recent items
      return [newItem, ...filtered].slice(0, MAX_HISTORY_ITEMS);
    });
  }, [setValue]);

  const removeFromHistory = useCallback((city: string) => {
    setValue((prev) => 
      prev.filter((item) => item.city.toLowerCase() !== city.toLowerCase())
    );
  }, [setValue]);

  const clearHistory = useCallback(() => {
    setValue([]);
  }, [setValue]);

  return {
    history: value,
    addToHistory,
    removeFromHistory,
    clearHistory,
    isLoaded,
  };
};

/**
 * Hook for managing last searched city
 */
export const useLastSearchedCity = (): {
  lastCity: string | null;
  setLastCity: (city: string) => void;
  isLoaded: boolean;
} => {
  const { value, setValue, isLoaded } = useLocalStorage<string | null>({
    key: 'weather-app-last-city',
    initialValue: null,
  });

  return {
    lastCity: value,
    setLastCity: setValue,
    isLoaded,
  };
};
