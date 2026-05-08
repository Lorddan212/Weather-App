/* eslint-disable react-hooks/set-state-in-effect */
/**
 * useTheme Hook
 * 
 * Custom hook for managing dark/light mode theme.
 * Persists preference to localStorage and respects system preference.
 */

import { useState, useEffect, useCallback } from 'react';
import type { ThemeMode } from '@/types/weather';

interface UseThemeReturn {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
  isLoaded: boolean;
}

/**
 * Check if dark mode is preferred by the system
 */
const getSystemPreference = (): ThemeMode => {
  if (typeof window === 'undefined') return 'light';
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches 
    ? 'dark' 
    : 'light';
};

/**
 * Hook for managing theme mode
 * 
 * @returns Theme state and control functions
 */
export const useTheme = (): UseThemeReturn => {
  const [theme, setThemeState] = useState<ThemeMode>('light');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const stored = window.localStorage.getItem('weather-app-theme');
      if (stored === 'dark' || stored === 'light') {
        setThemeState(stored);
      } else {
        // Use system preference as default
        setThemeState(getSystemPreference());
      }
    } catch {
      setThemeState(getSystemPreference());
    }
    setIsLoaded(true);
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (!isLoaded || typeof window === 'undefined') return;

    const root = window.document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Store preference
    try {
      window.localStorage.setItem('weather-app-theme', theme);
    } catch (error) {
      console.warn('Failed to save theme preference:', error);
    }
  }, [theme, isLoaded]);

  // Listen for system preference changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if no preference is stored
      try {
        const stored = window.localStorage.getItem('weather-app-theme');
        if (!stored) {
          setThemeState(e.matches ? 'dark' : 'light');
        }
      } catch {
        setThemeState(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const setTheme = useCallback((newTheme: ThemeMode) => {
    setThemeState(newTheme);
  }, []);

  return {
    theme,
    toggleTheme,
    setTheme,
    isLoaded,
  };
};
