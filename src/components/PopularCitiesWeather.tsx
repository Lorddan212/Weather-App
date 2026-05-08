import { MapPin, RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { WeatherConditionIcon } from '@/components/WeatherConditionIcon';
import { CITY_CARD_PLACEHOLDERS, usePopularCitiesWeather } from '@/hooks/usePopularCitiesWeather';
import { isApiKeyConfigured } from '@/services/weatherApi';
import type { TemperatureUnit } from '@/types/weather';
import { formatTemperature, formatWindSpeed } from '@/utils/weatherUtils';

interface PopularCitiesWeatherProps {
  unit: TemperatureUnit;
  onCitySelect: (city: string) => void;
}

export function PopularCitiesWeather({ unit, onCitySelect }: PopularCitiesWeatherProps) {
  const { cities, loading, error } = usePopularCitiesWeather(unit);
  const liveDetailsEnabled = isApiKeyConfigured();

  return (
    <section className="space-y-4 text-foreground dark:text-primary-foreground">
      <div className="flex flex-col gap-2 px-1 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            Global City Weather
          </h2>
          <p className="max-w-2xl text-sm font-medium leading-6 text-foreground/85 dark:text-primary-foreground/90">
            Real-time temperatures, sky conditions, and wind updates from cities around the world.
          </p>
        </div>
        {loading && (
          <span className="inline-flex items-center gap-2 text-sm font-medium text-foreground dark:text-primary-foreground">
            <RefreshCw className="h-4 w-4 animate-spin" />
            Updating
          </span>
        )}
      </div>

      <div className="rounded-2xl bg-muted/10 p-4 shadow-sm ring-1 ring-border/20 backdrop-blur-sm md:p-6 dark:bg-primary-foreground/10 dark:ring-primary-foreground/10">
        {error && cities.length === 0 ? (
          <div className="rounded-xl bg-background/95 p-4 text-sm font-medium text-muted-foreground shadow-xs dark:bg-primary/25 dark:text-primary-foreground/80">
            {error}
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {loading && cities.length === 0
              ? CITY_CARD_PLACEHOLDERS.map((city) => (
                  <div key={city} className="rounded-2xl bg-background/95 p-4 shadow-xs ring-1 ring-border/10 dark:bg-primary/25 dark:ring-primary-foreground/10">
                    <div className="mb-5 flex items-center justify-between">
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="h-10 w-10 rounded-full" />
                    </div>
                    <Skeleton className="mb-3 h-9 w-20" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ))
              : cities.map((city) => (
                  <button
                    key={`${city.city}-${city.country}`}
                    type="button"
                    onClick={() => onCitySelect(city.city)}
                    disabled={!liveDetailsEnabled}
                    className="group min-h-[176px] rounded-2xl bg-background/95 p-4 text-left text-foreground shadow-xs ring-1 ring-border/10 transition-all duration-300 hover:-translate-y-1 hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-default disabled:hover:translate-y-0 dark:bg-primary/25 dark:text-primary-foreground dark:ring-primary-foreground/10 dark:hover:bg-primary/35"
                    aria-label={`Show full weather for ${city.city}`}
                  >
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div>
                        <p className="text-lg font-bold tracking-tight">{city.city}</p>
                        <p className="mt-1 flex items-center gap-1 text-sm font-medium text-muted-foreground dark:text-primary-foreground/75">
                          <MapPin className="h-3.5 w-3.5" />
                          {city.country}
                        </p>
                      </div>
                      <div className="rounded-full bg-primary/10 p-3 text-primary transition-colors group-hover:bg-accent/15 dark:bg-background/25 dark:text-primary-foreground dark:group-hover:bg-accent/25">
                        <WeatherConditionIcon
                          conditionType={city.conditionType}
                          className="h-7 w-7"
                          strokeWidth={1.8}
                        />
                      </div>
                    </div>

                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <p className="text-4xl font-bold tracking-tight">
                          {formatTemperature(city.temperature, unit, 0)}
                        </p>
                        <p className="mt-1 text-sm font-medium capitalize text-muted-foreground dark:text-primary-foreground/75">
                          {city.description}
                        </p>
                      </div>
                      <p className="text-right text-xs font-semibold leading-5 text-muted-foreground dark:text-primary-foreground/75">
                        Wind<br />
                        {formatWindSpeed(city.windSpeed, unit)}
                      </p>
                    </div>
                  </button>
                ))}
          </div>
        )}

        {error && cities.length > 0 && (
          <p className="mt-3 text-sm font-medium text-muted-foreground dark:text-primary-foreground/75">
            {error}
          </p>
        )}
      </div>
    </section>
  );
}
