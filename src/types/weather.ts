/**
 * Weather Application Type Definitions
 * 
 * This file contains all TypeScript interfaces and types for the weather API data,
 * ensuring strong typing throughout the application.
 */

// ============================================
// OpenWeatherMap API Response Types
// ============================================

/**
 * Geographic coordinates
 */
export interface Coordinates {
  lat: number;
  lon: number;
}

/**
 * Weather condition information
 */
export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

/**
 * Main weather data (temperature, pressure, humidity, etc.)
 */
export interface MainWeatherData {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  sea_level?: number;
  grnd_level?: number;
}

/**
 * Wind information
 */
export interface WindData {
  speed: number;
  deg: number;
  gust?: number;
}

/**
 * Cloud coverage information
 */
export interface CloudsData {
  all: number;
}

/**
 * System data (sunrise, sunset, country)
 */
export interface SystemData {
  type?: number;
  id?: number;
  country: string;
  sunrise: number;
  sunset: number;
}

/**
 * Current weather API response
 */
export interface CurrentWeatherResponse {
  coord: Coordinates;
  weather: WeatherCondition[];
  base: string;
  main: MainWeatherData;
  visibility: number;
  wind: WindData;
  clouds: CloudsData;
  dt: number;
  sys: SystemData;
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

/**
 * Forecast item (for 5-day forecast)
 */
export interface ForecastItem {
  dt: number;
  main: MainWeatherData;
  weather: WeatherCondition[];
  clouds: CloudsData;
  wind: WindData;
  visibility: number;
  pop: number; // Probability of precipitation
  rain?: { '3h': number };
  snow?: { '3h': number };
  dt_txt: string;
}

/**
 * City information in forecast response
 */
export interface ForecastCity {
  id: number;
  name: string;
  coord: Coordinates;
  country: string;
  population: number;
  timezone: number;
  sunrise: number;
  sunset: number;
}

/**
 * 5-day forecast API response
 */
export interface ForecastResponse {
  cod: string;
  message: number;
  cnt: number;
  list: ForecastItem[];
  city: ForecastCity;
}

// ============================================
// Application-Specific Types
// ============================================

/**
 * Temperature unit preference
 */
export type TemperatureUnit = 'celsius' | 'fahrenheit';

/**
 * Theme mode preference
 */
export type ThemeMode = 'light' | 'dark';

/**
 * Weather condition categories for UI theming
 */
export type WeatherConditionType = 
  | 'clear'
  | 'clouds'
  | 'rain'
  | 'drizzle'
  | 'thunderstorm'
  | 'snow'
  | 'mist'
  | 'fog'
  | 'haze'
  | 'dust'
  | 'sand'
  | 'ash'
  | 'squall'
  | 'tornado'
  | 'unknown';

/**
 * Processed current weather data for UI display
 */
export interface CurrentWeatherDisplay {
  city: string;
  country: string;
  temperature: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  visibility: number;
  description: string;
  mainCondition: string;
  conditionType: WeatherConditionType;
  icon: string;
  sunrise: Date;
  sunset: Date;
  timestamp: Date;
  coordinates: Coordinates;
}

/**
 * Processed forecast data for UI display
 */
export interface ForecastDisplay {
  date: Date;
  temperature: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  windSpeed: number;
  description: string;
  mainCondition: string;
  conditionType: WeatherConditionType;
  icon: string;
  pop: number; // Probability of precipitation
}

/**
 * Daily forecast (grouped by day)
 */
export interface DailyForecast {
  date: Date;
  dayName: string;
  forecasts: ForecastDisplay[];
  highTemp: number;
  lowTemp: number;
  avgHumidity: number;
  avgWindSpeed: number;
  dominantCondition: WeatherConditionType;
  dominantIcon: string;
  description: string;
  pop: number;
}

/**
 * Complete weather data for the application
 */
export interface WeatherData {
  current: CurrentWeatherDisplay;
  forecast: DailyForecast[];
  lastUpdated: Date;
}

/**
 * API error response
 */
export interface ApiError {
  cod: string | number;
  message: string;
}

/**
 * Geolocation position
 */
export interface GeoPosition {
  latitude: number;
  longitude: number;
}

/**
 * Geolocation error
 */
export interface GeoError {
  code: number;
  message: string;
}

/**
 * Search history item
 */
export interface SearchHistoryItem {
  city: string;
  country: string;
  timestamp: number;
}

/**
 * Application settings
 */
export interface AppSettings {
  unit: TemperatureUnit;
  theme: ThemeMode;
  lastSearchedCity?: string;
  searchHistory: SearchHistoryItem[];
}
