/**
 * Forecast Component
 * 
 * Displays 5-day weather forecast with daily cards and expandable details.
 */

import { useState } from 'react';
import { ChevronDown, ChevronUp, Droplets, Wind } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { WeatherConditionIcon } from '@/components/WeatherConditionIcon';
import type { DailyForecast, TemperatureUnit } from '@/types/weather';
import {
  formatTemperature,
  formatHumidity,
  formatWindSpeed,
  getWeatherAnimation,
} from '@/utils/weatherUtils';

interface ForecastProps {
  forecast: DailyForecast[];
  unit: TemperatureUnit;
}

interface ForecastDayProps {
  day: DailyForecast;
  unit: TemperatureUnit;
  isExpanded: boolean;
  onToggle: () => void;
  index: number;
}

const ForecastDay: React.FC<ForecastDayProps> = ({ 
  day, 
  unit, 
  isExpanded, 
  onToggle,
  index 
}) => {
  const animationClass = getWeatherAnimation(day.dominantCondition);

  return (
    <Card 
      className={`overflow-hidden bg-background/95 text-foreground shadow-xs ring-1 ring-border/20 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 fill-mode-both dark:bg-primary/25 dark:text-primary-foreground dark:ring-primary-foreground/10 ${
        isExpanded ? 'ring-2 ring-primary/20 dark:ring-primary-foreground/25' : 'hover:shadow-lg dark:hover:bg-primary/35'
      }`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <CardContent className="p-0">
        {/* Main Day Info */}
        <button
          onClick={onToggle}
          className="w-full p-4 flex items-center justify-between hover:bg-muted/30 transition-colors dark:hover:bg-primary-foreground/10"
        >
          <div className="flex items-center gap-3 md:gap-4">
            <WeatherConditionIcon
              conditionType={day.dominantCondition}
              className={`h-12 w-12 md:h-14 md:w-14 ${animationClass}`}
              strokeWidth={1.7}
            />
            <div className="text-left">
              <p className="font-semibold text-base md:text-lg">{day.dayName}</p>
              <p className="text-sm text-muted-foreground capitalize dark:text-primary-foreground/80">{day.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-bold text-lg md:text-xl">
                {formatTemperature(day.highTemp, unit, 0)}
              </p>
              <p className="text-sm text-muted-foreground dark:text-primary-foreground/80">
                {formatTemperature(day.lowTemp, unit, 0)}
              </p>
            </div>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground dark:text-primary-foreground/80" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground dark:text-primary-foreground/80" />
            )}
          </div>
        </button>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="px-4 pb-4 animate-in slide-in-from-top-2 duration-200">
            <div className="pt-3">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 dark:bg-primary-foreground/10">
                  <Droplets className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground dark:text-primary-foreground/75">Humidity</p>
                    <p className="font-medium text-sm">{formatHumidity(day.avgHumidity)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 dark:bg-primary-foreground/10">
                  <Wind className="w-4 h-4 text-secondary dark:text-primary-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground dark:text-primary-foreground/75">Wind</p>
                    <p className="font-medium text-sm">{formatWindSpeed(day.avgWindSpeed, unit)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 dark:bg-primary-foreground/10">
                  <Droplets className="w-4 h-4 text-accent" />
                  <div>
                    <p className="text-xs text-muted-foreground dark:text-primary-foreground/75">Rain Chance</p>
                    <p className="font-medium text-sm">{Math.round(day.pop)}%</p>
                  </div>
                </div>
              </div>

              {/* Hourly Forecast Preview */}
              {day.forecasts.length > 0 && (
                <div className="mt-3 pt-3">
                  <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider dark:text-primary-foreground/75">Hourly</p>
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-muted">
                    {day.forecasts.slice(0, 8).map((forecast, idx) => (
                      <div 
                        key={idx}
                        className="flex-shrink-0 flex flex-col items-center p-2 rounded-lg bg-muted/30 min-w-[60px] dark:bg-primary-foreground/10"
                      >
                        <p className="text-xs text-muted-foreground dark:text-primary-foreground/75">
                          {forecast.date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true })}
                        </p>
                        <WeatherConditionIcon
                          conditionType={forecast.conditionType}
                          className="h-8 w-8"
                          strokeWidth={1.8}
                        />
                        <p className="text-sm font-medium">
                          {formatTemperature(forecast.temperature, unit, 0)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const Forecast: React.FC<ForecastProps> = ({ forecast, unit }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  if (forecast.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3 text-foreground dark:text-primary-foreground">
      <div className="flex items-center justify-between rounded-xl bg-background/95 px-4 py-3 text-foreground shadow-xs ring-1 ring-border/20 backdrop-blur-sm dark:bg-primary/25 dark:text-primary-foreground dark:ring-primary-foreground/10">
        <h3 className="text-xl font-bold tracking-tight">5-Day Forecast</h3>
        <span className="text-sm font-bold text-secondary dark:text-primary-foreground/80">
          {forecast.length} days
        </span>
      </div>
      
      <div className="space-y-3">
        {forecast.map((day, index) => (
          <ForecastDay
            key={day.date.toISOString()}
            day={day}
            unit={unit}
            isExpanded={expandedIndex === index}
            onToggle={() => handleToggle(index)}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};
