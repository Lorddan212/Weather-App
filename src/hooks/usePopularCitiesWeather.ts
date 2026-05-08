import { useEffect, useState } from 'react';
import {
  API_KEY_SETUP_MESSAGE,
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
export const DISPLAYED_CITY_COUNT = 6;

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
  { city: 'Reykjavik', country: 'IS', temperature: 4, description: 'overcast clouds', conditionType: 'clouds', windSpeed: 5.7, humidity: 79, coordinates: { lat: 64.1466, lon: -21.9426 } },
  { city: 'Oslo', country: 'NO', temperature: 6, description: 'few clouds', conditionType: 'clouds', windSpeed: 3.9, humidity: 73, coordinates: { lat: 59.9139, lon: 10.7522 } },
  { city: 'Helsinki', country: 'FI', temperature: 5, description: 'light snow', conditionType: 'snow', windSpeed: 4.5, humidity: 81, coordinates: { lat: 60.1699, lon: 24.9384 } },
  { city: 'Prague', country: 'CZ', temperature: 8, description: 'mist', conditionType: 'mist', windSpeed: 2.8, humidity: 77, coordinates: { lat: 50.0755, lon: 14.4378 } },
  { city: 'Athens', country: 'GR', temperature: 16, description: 'clear sky', conditionType: 'clear', windSpeed: 3.6, humidity: 55, coordinates: { lat: 37.9838, lon: 23.7275 } },
  { city: 'Marrakesh', country: 'MA', temperature: 23, description: 'clear sky', conditionType: 'clear', windSpeed: 3.2, humidity: 38, coordinates: { lat: 31.6295, lon: -7.9811 } },
  { city: 'Dakar', country: 'SN', temperature: 26, description: 'scattered clouds', conditionType: 'clouds', windSpeed: 5.4, humidity: 68, coordinates: { lat: 14.7167, lon: -17.4677 } },
  { city: 'Accra', country: 'GH', temperature: 29, description: 'few clouds', conditionType: 'clouds', windSpeed: 4.1, humidity: 79, coordinates: { lat: 5.6037, lon: -0.187 } },
  { city: 'Kigali', country: 'RW', temperature: 20, description: 'light rain', conditionType: 'rain', windSpeed: 2.4, humidity: 72, coordinates: { lat: -1.9441, lon: 30.0619 } },
  { city: 'Windhoek', country: 'NA', temperature: 24, description: 'clear sky', conditionType: 'clear', windSpeed: 4.9, humidity: 33, coordinates: { lat: -22.5609, lon: 17.0658 } },
  { city: 'Antananarivo', country: 'MG', temperature: 19, description: 'broken clouds', conditionType: 'clouds', windSpeed: 2.6, humidity: 70, coordinates: { lat: -18.8792, lon: 47.5079 } },
  { city: 'Muscat', country: 'OM', temperature: 30, description: 'clear sky', conditionType: 'clear', windSpeed: 3.8, humidity: 46, coordinates: { lat: 23.588, lon: 58.3829 } },
  { city: 'Kathmandu', country: 'NP', temperature: 17, description: 'haze', conditionType: 'haze', windSpeed: 2.1, humidity: 58, coordinates: { lat: 27.7172, lon: 85.324 } },
  { city: 'Colombo', country: 'LK', temperature: 29, description: 'light rain', conditionType: 'rain', windSpeed: 3.5, humidity: 82, coordinates: { lat: 6.9271, lon: 79.8612 } },
  { city: 'Hanoi', country: 'VN', temperature: 24, description: 'mist', conditionType: 'mist', windSpeed: 2.9, humidity: 84, coordinates: { lat: 21.0278, lon: 105.8342 } },
  { city: 'Taipei', country: 'TW', temperature: 22, description: 'overcast clouds', conditionType: 'clouds', windSpeed: 3.6, humidity: 76, coordinates: { lat: 25.033, lon: 121.5654 } },
  { city: 'Ulaanbaatar', country: 'MN', temperature: -4, description: 'clear sky', conditionType: 'clear', windSpeed: 4.2, humidity: 49, coordinates: { lat: 47.8864, lon: 106.9057 } },
  { city: 'Tbilisi', country: 'GE', temperature: 12, description: 'few clouds', conditionType: 'clouds', windSpeed: 3.1, humidity: 61, coordinates: { lat: 41.7151, lon: 44.8271 } },
  { city: 'Tashkent', country: 'UZ', temperature: 14, description: 'clear sky', conditionType: 'clear', windSpeed: 3.7, humidity: 45, coordinates: { lat: 41.2995, lon: 69.2401 } },
  { city: 'Phnom Penh', country: 'KH', temperature: 31, description: 'scattered clouds', conditionType: 'clouds', windSpeed: 2.8, humidity: 74, coordinates: { lat: 11.5564, lon: 104.9282 } },
  { city: 'Wellington', country: 'NZ', temperature: 15, description: 'light rain', conditionType: 'rain', windSpeed: 6.3, humidity: 71, coordinates: { lat: -41.2865, lon: 174.7762 } },
  { city: 'Suva', country: 'FJ', temperature: 27, description: 'moderate rain', conditionType: 'rain', windSpeed: 4.4, humidity: 86, coordinates: { lat: -18.1248, lon: 178.4501 } },
  { city: 'Quito', country: 'EC', temperature: 16, description: 'broken clouds', conditionType: 'clouds', windSpeed: 2.5, humidity: 69, coordinates: { lat: -0.1807, lon: -78.4678 } },
  { city: 'Lima', country: 'PE', temperature: 21, description: 'mist', conditionType: 'mist', windSpeed: 3.9, humidity: 77, coordinates: { lat: -12.0464, lon: -77.0428 } },
  { city: 'La Paz', country: 'BO', temperature: 10, description: 'few clouds', conditionType: 'clouds', windSpeed: 4.3, humidity: 48, coordinates: { lat: -16.4897, lon: -68.1193 } },
  { city: 'Montevideo', country: 'UY', temperature: 18, description: 'scattered clouds', conditionType: 'clouds', windSpeed: 5.0, humidity: 66, coordinates: { lat: -34.9011, lon: -56.1645 } },
  { city: 'Santiago', country: 'CL', temperature: 20, description: 'clear sky', conditionType: 'clear', windSpeed: 3.0, humidity: 41, coordinates: { lat: -33.4489, lon: -70.6693 } },
  { city: 'Bogota', country: 'CO', temperature: 15, description: 'light rain', conditionType: 'rain', windSpeed: 2.7, humidity: 75, coordinates: { lat: 4.711, lon: -74.0721 } },
  { city: 'Paramaribo', country: 'SR', temperature: 28, description: 'thunderstorm', conditionType: 'thunderstorm', windSpeed: 2.8, humidity: 88, coordinates: { lat: 5.852, lon: -55.2038 } },
];

export const CITY_CARD_PLACEHOLDERS = fallbackCityData
  .slice(0, DISPLAYED_CITY_COUNT)
  .map((city) => city.city);

interface PopularCitiesWeatherState {
  cities: CurrentWeatherDisplay[];
  loading: boolean;
  error: string | null;
  rotationIndex: number;
}

const getCityKey = (city: FallbackCity): string => {
  return `${city.city}-${city.country}`;
};

const getCityQuery = (city: FallbackCity): string => {
  return city.country ? `${city.city},${city.country}` : city.city;
};

const shuffleCities = (cities: readonly FallbackCity[]): FallbackCity[] => {
  const shuffled = [...cities];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }

  return shuffled;
};

const getRandomCitySeeds = (
  previousCities: readonly FallbackCity[] = []
): FallbackCity[] => {
  const previousKeys = new Set(previousCities.map(getCityKey));
  const shuffled = shuffleCities(fallbackCityData);
  const freshCities = shuffled.filter((city) => !previousKeys.has(getCityKey(city)));

  return [...freshCities, ...shuffled]
    .filter((city, index, cities) => (
      cities.findIndex((item) => getCityKey(item) === getCityKey(city)) === index
    ))
    .slice(0, DISPLAYED_CITY_COUNT);
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
  citySeeds: readonly FallbackCity[],
  unit: TemperatureUnit
): CurrentWeatherDisplay[] => {
  return citySeeds.map((citySeed) => toDisplayCity(citySeed, unit));
};

export function usePopularCitiesWeather(unit: TemperatureUnit): PopularCitiesWeatherState {
  const [selection, setSelection] = useState(() => ({
    citySeeds: getRandomCitySeeds(),
    rotationIndex: 0,
  }));
  const { citySeeds: activeCitySeeds, rotationIndex } = selection;
  const [state, setState] = useState<PopularCitiesWeatherState>({
    cities: getFallbackCities(activeCitySeeds, unit),
    loading: isApiKeyConfigured(),
    error: isApiKeyConfigured() ? null : API_KEY_SETUP_MESSAGE,
    rotationIndex,
  });

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setSelection((currentSelection) => ({
        citySeeds: getRandomCitySeeds(currentSelection.citySeeds),
        rotationIndex: currentSelection.rotationIndex + 1,
      }));
    }, CITY_ROTATION_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const fallbackCities = getFallbackCities(activeCitySeeds, unit);

    if (!isApiKeyConfigured()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState({
        cities: fallbackCities,
        loading: false,
        error: API_KEY_SETUP_MESSAGE,
        rotationIndex,
      });
      return;
    }

    const loadGlobalCities = async () => {
      setState({
        cities: fallbackCities,
        loading: true,
        error: null,
        rotationIndex,
      });

      const results = await Promise.allSettled(
        activeCitySeeds.map((city) => getCurrentWeatherByCity(getCityQuery(city), unit))
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

    void loadGlobalCities();

    return () => {
      cancelled = true;
    };
  }, [activeCitySeeds, rotationIndex, unit]);

  return state;
}
