/**
 * Weather Utilities
 * 
 * This file contains utility functions for transforming and formatting
 * weather data from the API into display-friendly formats.
 */

import type {
  CurrentWeatherResponse,
  ForecastResponse,
  ForecastItem,
  CurrentWeatherDisplay,
  ForecastDisplay,
  DailyForecast,
  WeatherConditionType,
  TemperatureUnit,
} from '@/types/weather';

/**
 * Map weather condition ID to condition type
 * Based on OpenWeatherMap condition codes
 */
export const getConditionType = (conditionId: number): WeatherConditionType => {
  // Thunderstorm
  if (conditionId >= 200 && conditionId < 300) return 'thunderstorm';
  
  // Drizzle
  if (conditionId >= 300 && conditionId < 400) return 'drizzle';
  
  // Rain
  if (conditionId >= 500 && conditionId < 600) return 'rain';
  
  // Snow
  if (conditionId >= 600 && conditionId < 700) return 'snow';
  
  // Atmosphere (mist, fog, haze, etc.)
  if (conditionId >= 700 && conditionId < 800) {
    if (conditionId === 701) return 'mist';
    if (conditionId === 711) return 'dust';
    if (conditionId === 721) return 'haze';
    if (conditionId === 731 || conditionId === 761) return 'dust';
    if (conditionId === 741) return 'fog';
    if (conditionId === 751) return 'sand';
    if (conditionId === 762) return 'ash';
    if (conditionId === 771) return 'squall';
    if (conditionId === 781) return 'tornado';
    return 'mist';
  }
  
  // Clear
  if (conditionId === 800) return 'clear';
  
  // Clouds
  if (conditionId > 800 && conditionId < 900) return 'clouds';
  
  return 'unknown';
};

/**
 * Get background gradient based on weather condition and time
 */
export const getWeatherBackground = (
  conditionType: WeatherConditionType,
  isDay: boolean = true
): string => {
  const backgrounds: Record<WeatherConditionType, { day: string; night: string }> = {
    clear: {
      day: 'from-background via-primary/10 to-accent/10',
      night: 'from-secondary via-primary/70 to-muted',
    },
    clouds: {
      day: 'from-background via-muted/20 to-primary/10',
      night: 'from-secondary via-muted to-primary/40',
    },
    rain: {
      day: 'from-primary/30 via-muted/30 to-background',
      night: 'from-secondary via-primary/60 to-muted',
    },
    drizzle: {
      day: 'from-muted/30 via-primary/20 to-background',
      night: 'from-secondary via-muted to-primary/40',
    },
    thunderstorm: {
      day: 'from-secondary via-accent/50 to-primary/50',
      night: 'from-secondary via-accent/40 to-primary/70',
    },
    snow: {
      day: 'from-background via-primary/10 to-muted/15',
      night: 'from-secondary via-primary/40 to-muted',
    },
    mist: {
      day: 'from-muted/20 via-background to-muted/15',
      night: 'from-secondary via-muted to-secondary',
    },
    fog: {
      day: 'from-muted/20 via-background to-muted/15',
      night: 'from-secondary via-muted to-secondary',
    },
    haze: {
      day: 'from-accent/15 via-background to-primary/10',
      night: 'from-secondary via-accent/30 to-muted',
    },
    dust: {
      day: 'from-accent/20 via-muted/20 to-background',
      night: 'from-secondary via-accent/30 to-secondary',
    },
    sand: {
      day: 'from-accent/20 via-muted/20 to-background',
      night: 'from-secondary via-accent/30 to-secondary',
    },
    ash: {
      day: 'from-muted/40 via-secondary/20 to-background',
      night: 'from-secondary via-muted to-secondary',
    },
    squall: {
      day: 'from-primary/25 via-secondary/25 to-background',
      night: 'from-secondary via-primary/50 to-muted',
    },
    tornado: {
      day: 'from-secondary/80 via-muted/50 to-primary/30',
      night: 'from-secondary via-muted to-primary/60',
    },
    unknown: {
      day: 'from-background via-primary/10 to-accent/10',
      night: 'from-secondary via-primary/70 to-muted',
    },
  };

  return backgrounds[conditionType]?.[isDay ? 'day' : 'night'] || backgrounds.unknown.day;
};

/**
 * Get weather icon animation class based on condition
 */
export const getWeatherAnimation = (conditionType: WeatherConditionType): string => {
  const animations: Record<WeatherConditionType, string> = {
    clear: 'animate-pulse-slow',
    clouds: 'animate-float',
    rain: 'animate-bounce-subtle',
    drizzle: 'animate-bounce-subtle',
    thunderstorm: 'animate-pulse',
    snow: 'animate-float',
    mist: 'animate-fade-in-out',
    fog: 'animate-fade-in-out',
    haze: 'animate-fade-in-out',
    dust: 'animate-shake-subtle',
    sand: 'animate-shake-subtle',
    ash: 'animate-fade-in-out',
    squall: 'animate-shake',
    tornado: 'animate-spin-slow',
    unknown: '',
  };

  return animations[conditionType] || '';
};

/**
 * Format temperature with unit symbol
 */
export const formatTemperature = (
  temp: number,
  unit: TemperatureUnit,
  decimals: number = 0
): string => {
  const symbol = unit === 'celsius' ? '°C' : '°F';
  return `${temp.toFixed(decimals)}${symbol}`;
};

/**
 * Convert temperature between units
 */
export const convertTemperature = (
  temp: number,
  from: TemperatureUnit,
  to: TemperatureUnit
): number => {
  if (from === to) return temp;
  
  if (from === 'celsius' && to === 'fahrenheit') {
    return (temp * 9) / 5 + 32;
  }
  
  // Fahrenheit to Celsius
  return ((temp - 32) * 5) / 9;
};

/**
 * Format wind speed with unit
 */
export const formatWindSpeed = (speed: number, unit: TemperatureUnit): string => {
  // API returns m/s for metric and mph for imperial
  const unitLabel = unit === 'celsius' ? 'm/s' : 'mph';
  return `${speed.toFixed(1)} ${unitLabel}`;
};

/**
 * Format humidity percentage
 */
export const formatHumidity = (humidity: number): string => {
  return `${humidity}%`;
};

/**
 * Format pressure with unit
 */
export const formatPressure = (pressure: number): string => {
  return `${pressure} hPa`;
};

/**
 * Format visibility with unit
 */
export const formatVisibility = (visibility: number): string => {
  // visibility is in meters
  if (visibility >= 1000) {
    return `${(visibility / 1000).toFixed(1)} km`;
  }
  return `${visibility} m`;
};

/**
 * Get wind direction from degrees
 */
export const getWindDirection = (degrees: number): string => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
};

/**
 * Format date to day name
 */
export const formatDayName = (date: Date, short: boolean = false): string => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: short ? 'short' : 'long',
  };
  return date.toLocaleDateString('en-US', options);
};

/**
 * Format date to time string
 */
export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format date to full date string
 */
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Check if it's daytime based on sunrise/sunset
 */
export const isDaytime = (sunrise: Date, sunset: Date, currentTime: Date = new Date()): boolean => {
  return currentTime >= sunrise && currentTime < sunset;
};

/**
 * Transform API current weather response to display format
 */
export const transformCurrentWeather = (
  data: CurrentWeatherResponse
): CurrentWeatherDisplay => {
  const weather = data.weather[0];
  const sunrise = new Date((data.sys.sunrise + data.timezone) * 1000);
  const sunset = new Date((data.sys.sunset + data.timezone) * 1000);
  const timestamp = new Date(data.dt * 1000);

  return {
    city: data.name,
    country: data.sys.country,
    temperature: data.main.temp,
    feelsLike: data.main.feels_like,
    tempMin: data.main.temp_min,
    tempMax: data.main.temp_max,
    humidity: data.main.humidity,
    pressure: data.main.pressure,
    windSpeed: data.wind.speed,
    windDirection: data.wind.deg,
    visibility: data.visibility,
    description: weather.description,
    mainCondition: weather.main,
    conditionType: getConditionType(weather.id),
    icon: weather.icon,
    sunrise,
    sunset,
    timestamp,
    coordinates: data.coord,
  };
};

/**
 * Transform API forecast item to display format
 */
export const transformForecastItem = (item: ForecastItem): ForecastDisplay => {
  const weather = item.weather[0];
  
  return {
    date: new Date(item.dt * 1000),
    temperature: item.main.temp,
    tempMin: item.main.temp_min,
    tempMax: item.main.temp_max,
    humidity: item.main.humidity,
    windSpeed: item.wind.speed,
    description: weather.description,
    mainCondition: weather.main,
    conditionType: getConditionType(weather.id),
    icon: weather.icon,
    pop: item.pop * 100, // Convert to percentage
  };
};

/**
 * Group forecast items by day
 */
export const groupForecastByDay = (forecastItems: ForecastDisplay[]): DailyForecast[] => {
  const grouped = new Map<string, ForecastDisplay[]>();

  // Group items by date
  forecastItems.forEach((item) => {
    const dateKey = item.date.toISOString().split('T')[0];
    if (!grouped.has(dateKey)) {
      grouped.set(dateKey, []);
    }
    grouped.get(dateKey)!.push(item);
  });

  // Transform groups into daily forecasts
  const dailyForecasts: DailyForecast[] = [];

  grouped.forEach((items, dateKey) => {
    const date = new Date(dateKey);
    const humidities = items.map((i) => i.humidity);
    const windSpeeds = items.map((i) => i.windSpeed);
    const pops = items.map((i) => i.pop);

    // Find dominant condition (most frequent)
    const conditionCounts = new Map<WeatherConditionType, number>();
    items.forEach((item) => {
      const count = conditionCounts.get(item.conditionType) || 0;
      conditionCounts.set(item.conditionType, count + 1);
    });
    
    let dominantCondition: WeatherConditionType = 'unknown';
    let maxCount = 0;
    conditionCounts.forEach((count, condition) => {
      if (count > maxCount) {
        maxCount = count;
        dominantCondition = condition;
      }
    });

    // Get icon for dominant condition (prefer day icon)
    const dominantItem = items.find((i) => i.conditionType === dominantCondition) || items[0];

    dailyForecasts.push({
      date,
      dayName: formatDayName(date),
      forecasts: items,
      highTemp: Math.max(...items.map((i) => i.tempMax)),
      lowTemp: Math.min(...items.map((i) => i.tempMin)),
      avgHumidity: Math.round(humidities.reduce((a, b) => a + b, 0) / humidities.length),
      avgWindSpeed: windSpeeds.reduce((a, b) => a + b, 0) / windSpeeds.length,
      dominantCondition,
      dominantIcon: dominantItem.icon.replace('n', 'd'), // Use day icon
      description: dominantItem.description,
      pop: Math.max(...pops),
    });
  });

  // Sort by date and return first 5 days
  return dailyForecasts.sort((a, b) => a.date.getTime() - b.date.getTime()).slice(0, 5);
};

/**
 * Transform full API response to application weather data
 */
export const transformWeatherData = (
  currentData: CurrentWeatherResponse,
  forecastData: ForecastResponse
) => {
  const current = transformCurrentWeather(currentData);
  const forecastItems = forecastData.list.map(transformForecastItem);
  const forecast = groupForecastByDay(forecastItems);

  return {
    current,
    forecast,
    lastUpdated: new Date(),
  };
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

/**
 * Debounce function for search input
 */
export function debounce<T extends (arg: string) => void>(
  func: T,
  wait: number
): (arg: string) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return (arg: string) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      func(arg);
    }, wait);
  };
}
