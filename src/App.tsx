import { useEffect, useCallback, useState } from 'react';
import { Toaster, toast } from 'sonner';
import { Header } from '@/components/Header';
import { SearchBar } from '@/components/SearchBar';
import { CurrentWeather } from '@/components/CurrentWeather';
import { Forecast } from '@/components/Forecast';
import { ErrorDisplay } from '@/components/ErrorDisplay';
import { LoadingState, WeatherLoader } from '@/components/LoadingState';
import { WeatherBackground } from '@/components/WeatherBackground';
import { PopularCitiesWeather } from '@/components/PopularCitiesWeather';
import { useWeather } from '@/hooks/useWeather';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useTheme } from '@/hooks/useTheme';
import { useSearchHistory, useLastSearchedCity } from '@/hooks/useLocalStorage';
import type { TemperatureUnit, WeatherConditionType } from '@/types/weather';
import { isApiKeyConfigured } from '@/services/weatherApi';
import { formatDate } from '@/utils/weatherUtils';

function App() {
  // Theme management
  const { theme, toggleTheme, isLoaded: themeLoaded } = useTheme();
  
  // Temperature unit
  const [unit, setUnit] = useState<TemperatureUnit>('celsius');
  
  // Weather data fetching
  const { 
    data: weatherData, 
    loading: weatherLoading, 
    error: weatherError, 
    fetchByCity, 
    fetchByCoords,
    refetch,
    clearError: clearWeatherError 
  } = useWeather(unit);
  
  // Geolocation
  const { 
    position, 
    loading: geoLoading, 
    error: geoError, 
    getPosition,
    clearError: clearGeoError,
    isSupported: geoSupported 
} = useGeolocation({ immediate: false });
  
  // Search history
  const { 
    history, 
    addToHistory, 
    clearHistory,
    isLoaded: historyLoaded 
  } = useSearchHistory();
  
  // Last searched city
  const { 
    lastCity, 
    setLastCity,
    isLoaded: lastCityLoaded 
  } = useLastSearchedCity();

  // Track if initial load is complete
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // Check API key configuration
  useEffect(() => {
    if (!isApiKeyConfigured()) {
      toast.error('API key not configured', {
        description: 'Please add your OpenWeatherMap API key to the .env file',
        duration: 10000,
      });
    }
  }, []);

  // Handle successful weather fetch
  useEffect(() => {
    if (weatherData && !weatherLoading) {
      addToHistory(weatherData.current.city, weatherData.current.country);
      setLastCity(weatherData.current.city);
    }
  }, [weatherData, weatherLoading, addToHistory, setLastCity]);

  // Handle geolocation position change
  useEffect(() => {
    if (position && !geoLoading) {
      fetchByCoords({ lat: position.latitude, lon: position.longitude });
    }
  }, [position, geoLoading, fetchByCoords]);

  // Handle errors
  useEffect(() => {
    if (weatherError) {
      toast.error(weatherError);
    }
  }, [weatherError]);

  useEffect(() => {
    if (geoError) {
      toast.error(geoError);
    }
  }, [geoError]);

  // Initial load - try last searched city, otherwise use a default city.
  useEffect(() => {
    if (!initialLoadComplete && lastCityLoaded && historyLoaded) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInitialLoadComplete(true);
      
      if (lastCity) {
        fetchByCity(lastCity);
      } else {
        fetchByCity('London');
      }
    }
  }, [initialLoadComplete, lastCityLoaded, historyLoaded, lastCity, fetchByCity]);

  // Handlers
  const handleSearch = useCallback((city: string) => {
    clearWeatherError();
    clearGeoError();
    fetchByCity(city);
  }, [fetchByCity, clearWeatherError, clearGeoError]);

  const handleLocationClick = useCallback(() => {
    if (!geoSupported) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }
    clearWeatherError();
    clearGeoError();
    getPosition();
  }, [geoSupported, getPosition, clearWeatherError, clearGeoError]);

  const handleHistoryItemClick = useCallback((city: string) => {
    clearWeatherError();
    clearGeoError();
    fetchByCity(city);
  }, [fetchByCity, clearWeatherError, clearGeoError]);

  const handleRefresh = useCallback(() => {
    clearWeatherError();
    clearGeoError();
    refetch();
  }, [refetch, clearWeatherError, clearGeoError]);

  const handleUnitChange = useCallback((newUnit: TemperatureUnit) => {
    setUnit(newUnit);
    toast.success(`Temperature unit changed to ${newUnit === 'celsius' ? 'Celsius' : 'Fahrenheit'}`);
  }, []);

  // Determine background condition
  const backgroundCondition: WeatherConditionType = weatherData?.current?.conditionType || 'clear';
  const isDay = weatherData?.current ? 
    new Date().getTime() >= weatherData.current.sunrise.getTime() && 
    new Date().getTime() < weatherData.current.sunset.getTime() 
    : true;

  // Show loading state while theme is loading
  if (!themeLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <WeatherLoader />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Dynamic Background */}
      <WeatherBackground conditionType={backgroundCondition} isDay={isDay} />
      
      {/* Toast notifications */}
      <Toaster 
        position="top-right" 
        closeButton
        theme={theme}
      />
      
      {/* Header */}
      <Header 
        theme={theme}
        onThemeToggle={toggleTheme}
        unit={unit}
        onUnitChange={handleUnitChange}
      />
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 md:py-8 max-w-5xl">
        {/* Search Section */}
        <section className="mb-8">
          <SearchBar
            onSearch={handleSearch}
            onLocationClick={handleLocationClick}
            isLoading={weatherLoading}
            isLocating={geoLoading}
            history={history}
            onHistoryItemClick={handleHistoryItemClick}
            onClearHistory={clearHistory}
          />
        </section>

        <section className="mb-8">
          <PopularCitiesWeather unit={unit} onCitySelect={handleSearch} />
        </section>

        {/* Error Display */}
        {(weatherError || geoError) && (
          <section className="mb-6">
            <ErrorDisplay 
              message={weatherError || geoError || ''} 
              onRetry={weatherError ? () => fetchByCity(lastCity || 'London') : handleLocationClick}
            />
          </section>
        )}

        {/* Loading State */}
        {weatherLoading && !weatherData && (
          <LoadingState />
        )}

        {/* Weather Content */}
        {weatherData && (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Last Updated */}
            <div className="flex items-center justify-between rounded-xl bg-background/95 px-4 py-3 text-sm font-bold text-foreground shadow-xs backdrop-blur-sm">
              <span>Last updated: {formatDate(weatherData.lastUpdated)}</span>
              <button 
                onClick={handleRefresh}
                disabled={weatherLoading}
                className="font-bold text-primary transition-colors hover:text-secondary disabled:cursor-not-allowed disabled:opacity-60"
              >
                {weatherLoading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>

            {/* Current Weather */}
            <section>
              <CurrentWeather 
                weather={weatherData.current} 
                unit={unit} 
              />
            </section>

            {/* Forecast */}
            <section>
              <Forecast 
                forecast={weatherData.forecast} 
                unit={unit} 
              />
            </section>
          </div>
        )}

        {/* Empty State */}
        {!weatherData && !weatherLoading && !weatherError && !geoError && (
          <div className="text-center py-16 animate-in fade-in slide-in-from-bottom-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
              <span className="text-4xl">🌤️</span>
            </div>
            <h2 className="text-2xl font-semibold mb-2">Welcome to WeatherApp</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Search for a city or use your current location to get real-time weather updates and forecasts.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-background/50 backdrop-blur-sm mt-auto">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-muted-foreground">
          <p>
            Weather data provided by{' '}
            <a 
              href="https://openweathermap.org" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              OpenWeatherMap
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
