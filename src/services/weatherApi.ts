/**
 * Weather API Service
 * 
 * This service handles all communication with the OpenWeatherMap API,
 * including fetching current weather, forecasts, and geocoding.
 * Implements proper error handling and loading states.
 */

import axios, { type AxiosError, type AxiosInstance } from 'axios';
import type {
  CurrentWeatherResponse,
  ForecastResponse,
  Coordinates,
  ApiError,
  TemperatureUnit,
} from '@/types/weather';

// API Configuration
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_API_BASE_URL = 'https://api.openweathermap.org/geo/1.0';

// Get API key from environment variables
const API_KEY = (import.meta.env.VITE_OPENWEATHER_API_KEY || '')
  .trim()
  .replace(/^['"]|['"]$/g, '');

export const API_KEY_SETUP_MESSAGE =
  'Add VITE_OPENWEATHER_API_KEY in Vercel Environment Variables, then redeploy.';

/**
 * Custom error class for weather API errors
 */
export class WeatherApiError extends Error {
  code: string | number;
  originalError?: AxiosError;
  
  constructor(
    message: string,
    code: string | number,
    originalError?: AxiosError
  ) {
    super(message);
    this.name = 'WeatherApiError';
    this.code = code;
    this.originalError = originalError;
  }
}

/**
 * Create configured axios instance
 */
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000, // 10 second timeout
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor for logging
  client.interceptors.request.use(
    (config) => {
      console.log(`[WeatherAPI] ${config.method?.toUpperCase()} ${config.url}`);
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor for error handling
  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ApiError>) => {
      if (error.response) {
        const { status, data } = error.response;
        const message = data?.message || 'An error occurred while fetching weather data';
        
        // Handle specific HTTP status codes
        switch (status) {
          case 401:
            throw new WeatherApiError(
              'OpenWeatherMap rejected this API key. If you just updated .env, restart the Vite dev server.',
              401,
              error
            );
          case 404:
            throw new WeatherApiError('City not found. Please check the spelling and try again.', 404, error);
          case 429:
            throw new WeatherApiError('Too many requests. Please wait a moment and try again.', 429, error);
          default:
            throw new WeatherApiError(message, status, error);
        }
      } else if (error.request) {
        // Network error
        throw new WeatherApiError(
          'Network error. Please check your internet connection.',
          'NETWORK_ERROR',
          error
        );
      } else {
        throw new WeatherApiError(
          'An unexpected error occurred.',
          'UNKNOWN_ERROR',
          error
        );
      }
    }
  );

  return client;
};

const apiClient = createApiClient();

/**
 * Get temperature unit parameter for API calls
 */
const getUnitParam = (unit: TemperatureUnit): string => {
  return unit === 'celsius' ? 'metric' : 'imperial';
};

/**
 * Fetch current weather by city name
 * 
 * @param city - City name (e.g., "London", "New York")
 * @param unit - Temperature unit (celsius or fahrenheit)
 * @returns Promise with current weather data
 */
export const getCurrentWeatherByCity = async (
  city: string,
  unit: TemperatureUnit = 'celsius'
): Promise<CurrentWeatherResponse> => {
  if (!API_KEY) {
    throw new WeatherApiError(
      `OpenWeatherMap API key is not configured. ${API_KEY_SETUP_MESSAGE}`,
      'MISSING_API_KEY'
    );
  }

  if (!city.trim()) {
    throw new WeatherApiError('City name is required', 'INVALID_INPUT');
  }

  const response = await apiClient.get<CurrentWeatherResponse>('/weather', {
    params: {
      q: city.trim(),
      appid: API_KEY,
      units: getUnitParam(unit),
    },
  });

  return response.data;
};

/**
 * Fetch current weather by geographic coordinates
 * 
 * @param coordinates - Latitude and longitude
 * @param unit - Temperature unit (celsius or fahrenheit)
 * @returns Promise with current weather data
 */
export const getCurrentWeatherByCoords = async (
  coordinates: Coordinates,
  unit: TemperatureUnit = 'celsius'
): Promise<CurrentWeatherResponse> => {
  if (!API_KEY) {
    throw new WeatherApiError(
      `OpenWeatherMap API key is not configured. ${API_KEY_SETUP_MESSAGE}`,
      'MISSING_API_KEY'
    );
  }

  const response = await apiClient.get<CurrentWeatherResponse>('/weather', {
    params: {
      lat: coordinates.lat,
      lon: coordinates.lon,
      appid: API_KEY,
      units: getUnitParam(unit),
    },
  });

  return response.data;
};

/**
 * Fetch 5-day weather forecast by city name
 * 
 * @param city - City name
 * @param unit - Temperature unit (celsius or fahrenheit)
 * @returns Promise with forecast data
 */
export const getForecastByCity = async (
  city: string,
  unit: TemperatureUnit = 'celsius'
): Promise<ForecastResponse> => {
  if (!API_KEY) {
    throw new WeatherApiError(
      `OpenWeatherMap API key is not configured. ${API_KEY_SETUP_MESSAGE}`,
      'MISSING_API_KEY'
    );
  }

  if (!city.trim()) {
    throw new WeatherApiError('City name is required', 'INVALID_INPUT');
  }

  const response = await apiClient.get<ForecastResponse>('/forecast', {
    params: {
      q: city.trim(),
      appid: API_KEY,
      units: getUnitParam(unit),
    },
  });

  return response.data;
};

/**
 * Fetch 5-day weather forecast by geographic coordinates
 * 
 * @param coordinates - Latitude and longitude
 * @param unit - Temperature unit (celsius or fahrenheit)
 * @returns Promise with forecast data
 */
export const getForecastByCoords = async (
  coordinates: Coordinates,
  unit: TemperatureUnit = 'celsius'
): Promise<ForecastResponse> => {
  if (!API_KEY) {
    throw new WeatherApiError(
      `OpenWeatherMap API key is not configured. ${API_KEY_SETUP_MESSAGE}`,
      'MISSING_API_KEY'
    );
  }

  const response = await apiClient.get<ForecastResponse>('/forecast', {
    params: {
      lat: coordinates.lat,
      lon: coordinates.lon,
      appid: API_KEY,
      units: getUnitParam(unit),
    },
  });

  return response.data;
};

/**
 * Fetch both current weather and forecast by city name
 * 
 * @param city - City name
 * @param unit - Temperature unit (celsius or fahrenheit)
 * @returns Promise with both current weather and forecast
 */
export const getFullWeatherByCity = async (
  city: string,
  unit: TemperatureUnit = 'celsius'
): Promise<{ current: CurrentWeatherResponse; forecast: ForecastResponse }> => {
  const [current, forecast] = await Promise.all([
    getCurrentWeatherByCity(city, unit),
    getForecastByCity(city, unit),
  ]);

  return { current, forecast };
};

/**
 * Fetch both current weather and forecast by coordinates
 * 
 * @param coordinates - Latitude and longitude
 * @param unit - Temperature unit (celsius or fahrenheit)
 * @returns Promise with both current weather and forecast
 */
export const getFullWeatherByCoords = async (
  coordinates: Coordinates,
  unit: TemperatureUnit = 'celsius'
): Promise<{ current: CurrentWeatherResponse; forecast: ForecastResponse }> => {
  const [current, forecast] = await Promise.all([
    getCurrentWeatherByCoords(coordinates, unit),
    getForecastByCoords(coordinates, unit),
  ]);

  return { current, forecast };
};

/**
 * Reverse geocoding - get city name from coordinates
 * 
 * @param coordinates - Latitude and longitude
 * @returns Promise with location name
 */
export const reverseGeocode = async (
  coordinates: Coordinates
): Promise<{ name: string; country: string }> => {
  if (!API_KEY) {
    throw new WeatherApiError(
      `OpenWeatherMap API key is not configured. ${API_KEY_SETUP_MESSAGE}`,
      'MISSING_API_KEY'
    );
  }

  try {
    const response = await axios.get(`${GEO_API_BASE_URL}/reverse`, {
      params: {
        lat: coordinates.lat,
        lon: coordinates.lon,
        limit: 1,
        appid: API_KEY,
      },
      timeout: 10000,
    });

    if (response.data && response.data.length > 0) {
      const location = response.data[0];
      return {
        name: location.name,
        country: location.country,
      };
    }

    throw new WeatherApiError('Location not found', 'NOT_FOUND');
  } catch (error) {
    if (error instanceof WeatherApiError) {
      throw error;
    }
    throw new WeatherApiError(
      'Failed to get location name',
      'GEOCODE_ERROR',
      error as AxiosError
    );
  }
};

/**
 * Check if API key is configured
 */
export const isApiKeyConfigured = (): boolean => {
  return !!API_KEY && API_KEY.length > 0 && API_KEY !== 'your_openweathermap_api_key_here';
};

/**
 * Get weather icon URL from icon code
 * 
 * @param iconCode - Icon code from API (e.g., "01d", "02n")
 * @param size - Icon size ('', '@2x', or '@4x')
 * @returns Full URL to weather icon
 */
export const getWeatherIconUrl = (iconCode: string, size: '' | '@2x' | '@4x' = '@2x'): string => {
  return `https://openweathermap.org/img/wn/${iconCode}${size}.png`;
};
