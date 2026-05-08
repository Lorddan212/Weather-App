/**
 * CurrentWeather Component
 * 
 * Displays current weather information with animated icons and detailed metrics.
 */

import { 
  Droplets, 
  Wind, 
  Eye, 
  Gauge, 
  Sunrise, 
  Sunset,
  Navigation,
  Thermometer
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { WeatherConditionIcon } from '@/components/WeatherConditionIcon';
import type { CurrentWeatherDisplay, TemperatureUnit } from '@/types/weather';
import {
  formatTemperature,
  formatWindSpeed,
  formatHumidity,
  formatPressure,
  formatVisibility,
  getWindDirection,
  formatTime,
  getWeatherAnimation,
} from '@/utils/weatherUtils';

interface CurrentWeatherProps {
  weather: CurrentWeatherDisplay;
  unit: TemperatureUnit;
}

interface WeatherMetricProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  delay?: number;
}

const WeatherMetric: React.FC<WeatherMetricProps> = ({ icon, label, value, delay = 0 }) => (
  <div 
    className="flex items-center gap-3 rounded-lg bg-background/95 p-3 text-foreground shadow-xs ring-1 ring-border/20 backdrop-blur-sm transition-all duration-300 hover:bg-background animate-in fade-in slide-in-from-bottom-4 fill-mode-both dark:bg-primary/25 dark:text-primary-foreground dark:ring-primary-foreground/10 dark:hover:bg-primary/35"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="p-2 rounded-full bg-primary/15 text-primary dark:bg-background/25 dark:text-primary-foreground">
      {icon}
    </div>
    <div>
      <p className="text-xs font-bold uppercase tracking-wider text-secondary dark:text-primary-foreground/70">{label}</p>
      <p className="text-lg font-bold leading-tight text-foreground dark:text-primary-foreground">{value}</p>
    </div>
  </div>
);

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({ weather, unit }) => {
  const animationClass = getWeatherAnimation(weather.conditionType);

  return (
    <div className="space-y-6 text-foreground dark:text-primary-foreground">
      {/* Main Weather Card */}
      <Card className="overflow-hidden bg-gradient-to-br from-card/95 to-background/95 shadow-2xl ring-1 ring-border/20 backdrop-blur-xl dark:from-primary/35 dark:to-primary/20 dark:text-primary-foreground dark:ring-primary-foreground/10">
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            {/* Left: Location and Main Info */}
            <div className="space-y-4">
              <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                  {weather.city}
                </h2>
                <p className="text-lg font-medium text-muted-foreground dark:text-primary-foreground/80">
                  {weather.country}
                </p>
              </div>
              
              <div className="flex items-center gap-4 animate-in fade-in slide-in-from-left-4 duration-500 delay-100">
                <span className="text-6xl md:text-7xl font-bold tracking-tighter">
                  {formatTemperature(weather.temperature, unit, 0)}
                </span>
                <div className="space-y-1">
                  <WeatherConditionIcon
                    conditionType={weather.conditionType}
                    className={`h-16 w-16 md:h-20 md:w-20 ${animationClass}`}
                    strokeWidth={1.6}
                  />
                  <p className="text-sm capitalize text-muted-foreground font-semibold dark:text-primary-foreground/80">
                    {weather.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground animate-in fade-in slide-in-from-left-4 duration-500 delay-200 dark:text-primary-foreground/80">
                <span className="flex items-center gap-1">
                  <Thermometer className="w-4 h-4" />
                  Feels like {formatTemperature(weather.feelsLike, unit, 0)}
                </span>
                <span className="text-border">|</span>
                <span>
                  H: {formatTemperature(weather.tempMax, unit, 0)} 
                  <span className="mx-2">•</span> 
                  L: {formatTemperature(weather.tempMin, unit, 0)}
                </span>
              </div>
            </div>

            {/* Right: Weather Icon Large */}
            <div className="hidden md:flex items-center justify-center animate-in zoom-in duration-500">
              <WeatherConditionIcon
                conditionType={weather.conditionType}
                className={`h-32 w-32 opacity-80 ${animationClass}`}
                strokeWidth={1.4}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weather Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        <WeatherMetric
          icon={<Droplets className="w-5 h-5" />}
          label="Humidity"
          value={formatHumidity(weather.humidity)}
          delay={100}
        />
        <WeatherMetric
          icon={<Wind className="w-5 h-5" />}
          label="Wind Speed"
          value={formatWindSpeed(weather.windSpeed, unit)}
          delay={150}
        />
        <WeatherMetric
          icon={<Navigation className="w-5 h-5" />}
          label="Wind Direction"
          value={getWindDirection(weather.windDirection)}
          delay={200}
        />
        <WeatherMetric
          icon={<Gauge className="w-5 h-5" />}
          label="Pressure"
          value={formatPressure(weather.pressure)}
          delay={250}
        />
        <WeatherMetric
          icon={<Eye className="w-5 h-5" />}
          label="Visibility"
          value={formatVisibility(weather.visibility)}
          delay={300}
        />
        <WeatherMetric
          icon={<Sunrise className="w-5 h-5" />}
          label="Sunrise"
          value={formatTime(weather.sunrise)}
          delay={350}
        />
        <WeatherMetric
          icon={<Sunset className="w-5 h-5" />}
          label="Sunset"
          value={formatTime(weather.sunset)}
          delay={400}
        />
      </div>
    </div>
  );
};
