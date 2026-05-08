/**
 * useWeather Hook
 * 
 * Custom hook for fetching and managing weather data.
 * Handles loading states, errors, and data transformation.
 */

import { useState, useCallback, useEffect } from 'react';
import {
  getFullWeatherByCity,
  getFullWeatherByCoords,
  WeatherApiError,
} from '@/services/weatherApi';
import {
  transformWeatherData,
} from '@/utils/weatherUtils';
import type {
  WeatherData,
  Coordinates,
  TemperatureUnit,
} from '@/types/weather';

interface UseWeatherState {
  data: WeatherData | null;
  loading: boolean;
  error: string | null;
}

interface UseWeatherReturn extends UseWeatherState {
  fetchByCity: (city: string) => Promise<void>;
  fetchByCoords: (coords: Coordinates) => Promise<void>;
  refetch: () => void;
  clearError: () => void;
}

/**
 * Hook for managing weather data fetching
 * 
 * @param unit - Temperature unit preference
 * @returns Weather state and fetch functions
 */
export const useWeather = (unit: TemperatureUnit = 'celsius'): UseWeatherReturn => {
  const [state, setState] = useState<UseWeatherState>({
    data: null,
    loading: false,
    error: null,
  });

  const [lastSearch, setLastSearch] = useState<{ type: 'city' | 'coords'; value: string | Coordinates } | null>(null);

  /**
   * Fetch weather data by city name
   */
  const fetchByCity = useCallback(async (city: string) => {
    if (!city.trim()) {
      setState((prev) => ({ ...prev, error: 'Please enter a city name' }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));
    setLastSearch({ type: 'city', value: city });

    try {
      const { current, forecast } = await getFullWeatherByCity(city, unit);
      const weatherData = transformWeatherData(current, forecast);
      
      setState({
        data: weatherData,
        loading: false,
        error: null,
      });
    } catch (err) {
      const errorMessage = err instanceof WeatherApiError 
        ? err.message 
        : 'Failed to fetch weather data. Please try again.';
      
      setState({
        data: null,
        loading: false,
        error: errorMessage,
      });
    }
  }, [unit]);

  /**
   * Fetch weather data by coordinates
   */
  const fetchByCoords = useCallback(async (coords: Coordinates) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    setLastSearch({ type: 'coords', value: coords });

    try {
      const { current, forecast } = await getFullWeatherByCoords(coords, unit);
      const weatherData = transformWeatherData(current, forecast);
      
      setState({
        data: weatherData,
        loading: false,
        error: null,
      });
    } catch (err) {
      const errorMessage = err instanceof WeatherApiError 
        ? err.message 
        : 'Failed to fetch weather data for your location.';
      
      setState({
        data: null,
        loading: false,
        error: errorMessage,
      });
    }
  }, [unit]);

  /**
   * Refetch using last search parameters
   */
  const refetch = useCallback(() => {
    if (!lastSearch) return;

    if (lastSearch.type === 'city') {
      fetchByCity(lastSearch.value as string);
    } else {
      fetchByCoords(lastSearch.value as Coordinates);
    }
  }, [lastSearch, fetchByCity, fetchByCoords]);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  // Refetch when unit changes
  useEffect(() => {
    if (lastSearch && state.data) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      refetch();
    }
  }, [unit]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    ...state,
    fetchByCity,
    fetchByCoords,
    refetch,
    clearError,
  };
};
