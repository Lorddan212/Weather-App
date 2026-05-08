/**
 * useGeolocation Hook
 * 
 * Custom hook for accessing the browser's Geolocation API.
 * Handles permission requests, errors, and loading states.
 */

import { useState, useCallback, useEffect } from 'react';
import type { GeoPosition } from '@/types/weather';

interface UseGeolocationState {
  position: GeoPosition | null;
  loading: boolean;
  error: string | null;
  permission: 'granted' | 'denied' | 'prompt' | 'unknown';
}

interface UseGeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  immediate?: boolean;
}

interface UseGeolocationReturn extends UseGeolocationState {
  getPosition: () => Promise<void>;
  clearError: () => void;
  isSupported: boolean;
}

/**
 * Check if geolocation is supported by the browser
 */
const isGeolocationSupported = (): boolean => {
  return 'geolocation' in navigator;
};

/**
 * Hook for accessing browser geolocation
 * 
 * @param options - Geolocation options
 * @returns Geolocation state and control functions
 */
export const useGeolocation = (options: UseGeolocationOptions = {}): UseGeolocationReturn => {
  const {
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 0,
    immediate = false,
  } = options;

  const [state, setState] = useState<UseGeolocationState>({
    position: null,
    loading: false,
    error: null,
    permission: 'unknown',
  });

  const isSupported = isGeolocationSupported();

  /**
   * Check permission status (if Permissions API is available)
   */
  const checkPermission = useCallback(async () => {
    if ('permissions' in navigator) {
      try {
        const result = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
        setState((prev) => ({ ...prev, permission: result.state as 'granted' | 'denied' | 'prompt' }));
        
        result.addEventListener('change', () => {
          setState((prev) => ({ ...prev, permission: result.state as 'granted' | 'denied' | 'prompt' }));
        });
      } catch {
        // Permissions API not supported or failed
      }
    }
  }, []);

  /**
   * Handle successful position retrieval
   */
  const handleSuccess = useCallback((position: GeolocationPosition) => {
    setState({
      position: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
      loading: false,
      error: null,
      permission: 'granted',
    });
  }, []);

  /**
   * Handle position retrieval error
   */
  const handleError = useCallback((error: GeolocationPositionError) => {
    let errorMessage: string;
    let permission: 'granted' | 'denied' | 'prompt' | 'unknown' = state.permission;

    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage = 'Location access denied. Please enable location permissions in your browser settings.';
        permission = 'denied';
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage = 'Location information unavailable. Please try again later.';
        break;
      case error.TIMEOUT:
        errorMessage = 'Location request timed out. Please try again.';
        break;
      default:
        errorMessage = 'An unknown error occurred while getting your location.';
    }

    setState((prev) => ({
      ...prev,
      loading: false,
      error: errorMessage,
      permission,
    }));
  }, [state.permission]);

  /**
   * Get current position
   */
  const getPosition = useCallback(async (): Promise<void> => {
    if (!isSupported) {
      setState((prev) => ({
        ...prev,
        error: 'Geolocation is not supported by your browser.',
      }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      handleSuccess,
      handleError,
      {
        enableHighAccuracy,
        timeout,
        maximumAge,
      }
    );
  }, [enableHighAccuracy, timeout, maximumAge, isSupported, handleSuccess, handleError]);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  // Check permission on mount
  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  // Get position immediately if requested
  useEffect(() => {
    if (immediate && isSupported) {
      getPosition();
    }
  }, [immediate, isSupported, getPosition]);

  return {
    ...state,
    getPosition,
    clearError,
    isSupported,
  };
};
