import { useEffect, useMemo, useState } from 'react';
import {
  getCurrentWeatherByCity,
  isApiKeyConfigured,
  WeatherApiError,
} from '@/services/weatherApi';
import type {
  CurrentWeatherDisplay,
  TemperatureUnit,
  WeatherConditionType,
} from '@/types/weather';
import { convertTemperature, transformCurrentWeather } from '@/utils/weatherUtils';

export const CITY_ROTATION_INTERVAL_MS = 60_000;

export const CITY_ROTATION_BATCHES = [
  ['London', 'New York', 'Tokyo', 'Paris', 'Dubai', 'Lagos'],
  ['Sydney', 'Singapore', 'Cairo', 'Rio de Janeiro', 'Toronto', 'Mumbai'],
  ['Cape Town', 'Mexico City', 'Seoul', 'Berlin', 'Buenos Aires', 'Nairobi'],
] as const;

export const POPULAR_CITIES = CITY_ROTATION_BATCHES[0];

interface FallbackCity {
  city: string;
  country: string;
  temperature: number;
  description: string;
  conditionType: WeatherConditionType;
  windSpeed: number;
  humidity: number;
  coordinates: {
    lat: number;
    lon: number;
  };
}

const fallbackCityData: FallbackCity[] = [
  { city: 'London', country: 'GB', temperature: 8, description: 'broken clouds', conditionType: 'clouds', windSpeed: 2.6, humidity: 89, coordinates: { lat: 51.5085, lon: -0.1257 } },
  { city: 'New York', country: 'US', temperature: 12, description: 'clear sky', conditionType: 'clear', windSpeed: 4.2, humidity: 62, coordinates: { lat: 40.7128, lon: -74.006 } },
  { city: 'Tokyo', country: 'JP', temperature: 15, description: 'light rain', conditionType: 'rain', windSpeed: 3.1, humidity: 74, coordinates: { lat: 35.6762, lon: 139.6503 } },
  { city: 'Paris', country: 'FR', temperature: 10, description: 'light drizzle', conditionType: 'drizzle', windSpeed: 2.9, humidity: 78, coordinates: { lat: 48.8566, lon: 2.3522 } },
  { city: 'Dubai', country: 'AE', temperature: 29, description: 'clear sky', conditionType: 'clear', windSpeed: 4.8, humidity: 49, coordinates: { lat: 25.2048, lon: 55.2708 } },
  { city: 'Lagos', country: 'NG', temperature: 28, description: 'scattered clouds', conditionType: 'clouds', windSpeed: 3.7, humidity: 82, coordinates: { lat: 6.5244, lon: 3.3792 } },
  { city: 'Sydney', country: 'AU', temperature: 19, description: 'few clouds', conditionType: 'clouds', windSpeed: 5.1, humidity: 65, coordinates: { lat: -33.8688, lon: 151.2093 } },
  { city: 'Singapore', country: 'SG', temperature: 30, description: 'thunderstorm', conditionType: 'thunderstorm', windSpeed: 2.2, humidity: 84, coordinates: { lat: 1.3521, lon: 103.8198 } },
  { city: 'Cairo', country: 'EG', temperature: 25, description: 'haze', conditionType: 'haze', windSpeed: 4.0, humidity: 42, coordinates: { lat: 30.0444, lon: 31.2357 } },
  { city: 'Rio de Janeiro', country: 'BR', temperature: 27, description: 'light rain', conditionType: 'rain', windSpeed: 3.5, humidity: 78, coordinates: { lat: -22.9068, lon: -43.1729 } },
  { city: 'Toronto', country: 'CA', temperature: 9, description: 'overcast clouds', conditionType: 'clouds', windSpeed: 4.4, humidity: 70, coordinates: { lat: 43.6532, lon: -79.3832 } },
  { city: 'Mumbai', country: 'IN', temperature: 31, description: 'mist', conditionType: 'mist', windSpeed: 3.2, humidity: 76, coordinates: { lat: 19.076, lon: 72.8777 } },
  { city: 'Cape Town', country: 'ZA', temperature: 18, description: 'clear sky', conditionType: 'clear', windSpeed: 6.0, humidity: 58, coordinates: { lat: -33.9249, lon: 18.4241 } },
  { city: 'Mexico City', country: 'MX', temperature: 20, description: 'few clouds', conditionType: 'clouds', windSpeed: 2.7, humidity: 52, coordinates: { lat: 19.4326, lon: -99.1332 } },
  { city: 'Seoul', country: 'KR', temperature: 14, description: 'clear sky', conditionType: 'clear', windSpeed: 2.9, humidity: 55, coordinates: { lat: 37.5665, lon: 126.978 } },
  { city: 'Berlin', country: 'DE', temperature: 9, description: 'light drizzle', conditionType: 'drizzle', windSpeed: 3.6, humidity: 80, coordinates: { lat: 52.52, lon: 13.405 } },
  { city: 'Buenos Aires', country: 'AR', temperature: 17, description: 'scattered clouds', conditionType: 'clouds', windSpeed: 4.1, humidity: 67, coordinates: { lat: -34.6037, lon: -58.3816 } },
  { city: 'Nairobi', country: 'KE', temperature: 21, description: 'light rain', conditionType: 'rain', windSpeed: 3.3, humidity: 69, coordinates: { lat: -1.2921, lon: 36.8219 } },
];

interface PopularCitiesWeatherState {
  cities: CurrentWeatherDisplay[];
  loading: boolean;
  error: string | null;
  rotationIndex: number;
}

const fallbackByCity = new Map(
  fallbackCityData.map((city) => [city.city.toLowerCase(), city])
);

const getFallbackSeed = (cityName: string): FallbackCity => {
  return fallbackByCity.get(cityName.toLowerCase()) || {
    city: cityName,
    country: '',
    temperature: 24,
    description: 'scattered clouds',
    conditionType: 'clouds',
    windSpeed: 3.2,
    humidity: 65,
    coordinates: { lat: 0, lon: 0 },
  };
};

const toDisplayCity = (
  seed: FallbackCity,
  unit: TemperatureUnit
): CurrentWeatherDisplay => {
  const temperature =
    unit === 'fahrenheit'
      ? convertTemperature(seed.temperature, 'celsius', 'fahrenheit')
      : seed.temperature;
  const windSpeed = unit === 'fahrenheit' ? seed.windSpeed * 2.237 : seed.windSpeed;
  const now = new Date();

  return {
    city: seed.city,
    country: seed.country,
    temperature,
    feelsLike: temperature,
    tempMin: temperature - 2,
    tempMax: temperature + 2,
    humidity: seed.humidity,
    pressure: 1013,
    windSpeed,
    windDirection: 180,
    visibility: 10000,
    description: seed.description,
    mainCondition: seed.conditionType,
    conditionType: seed.conditionType,
    icon: '03d',
    sunrise: now,
    sunset: new Date(now.getTime() + 8 * 60 * 60 * 1000),
    timestamp: now,
    coordinates: seed.coordinates,
  };
};

const getFallbackCities = (
  cityNames: readonly string[],
  unit: TemperatureUnit
): CurrentWeatherDisplay[] => {
  return cityNames.map((cityName) => toDisplayCity(getFallbackSeed(cityName), unit));
};

export function usePopularCitiesWeather(unit: TemperatureUnit): PopularCitiesWeatherState {
  const [rotationIndex, setRotationIndex] = useState(0);
  const activeCityNames = useMemo(
    () => CITY_ROTATION_BATCHES[rotationIndex],
    [rotationIndex]
  );
  const [state, setState] = useState<PopularCitiesWeatherState>({
    cities: getFallbackCities(activeCityNames, unit),
    loading: isApiKeyConfigured(),
    error: isApiKeyConfigured() ? null : 'Add your OpenWeatherMap API key to refresh live popular city weather.',
    rotationIndex,
  });

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setRotationIndex((currentIndex) => (
        currentIndex + 1
      ) % CITY_ROTATION_BATCHES.length);
    }, CITY_ROTATION_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const fallbackCities = getFallbackCities(activeCityNames, unit);

    if (!isApiKeyConfigured()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState({
        cities: fallbackCities,
        loading: false,
        error: 'Add your OpenWeatherMap API key to refresh live popular city weather.',
        rotationIndex,
      });
      return;
    }

    const loadPopularCities = async () => {
      setState({
        cities: fallbackCities,
        loading: true,
        error: null,
        rotationIndex,
      });

      const results = await Promise.allSettled(
        activeCityNames.map((city) => getCurrentWeatherByCity(city, unit))
      );

      if (cancelled) return;

      const cities = results.map((result, index) => {
        if (result.status === 'fulfilled') {
          return transformCurrentWeather(result.value);
        }

        return fallbackCities[index];
      });

      const failedRefresh = results.some((result) => result.status === 'rejected');
      const firstError = results.find(
        (result): result is PromiseRejectedResult => result.status === 'rejected'
      );
      const error = failedRefresh
        ? firstError?.reason instanceof WeatherApiError
          ? firstError.reason.message
          : 'Some live city weather could not be refreshed.'
        : null;

      setState({
        cities,
        loading: false,
        error,
        rotationIndex,
      });
    };

    void loadPopularCities();

    return () => {
      cancelled = true;
    };
  }, [activeCityNames, rotationIndex, unit]);

  return state;
}
