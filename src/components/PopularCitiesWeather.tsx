import { MapPin, RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { WeatherConditionIcon } from '@/components/WeatherConditionIcon';
import { POPULAR_CITIES, usePopularCitiesWeather } from '@/hooks/usePopularCitiesWeather';
import type { TemperatureUnit } from '@/types/weather';
import { formatTemperature, formatWindSpeed } from '@/utils/weatherUtils';

interface PopularCitiesWeatherProps {
  unit: TemperatureUnit;
  onCitySelect: (city: string) => void;
}

export function PopularCitiesWeather({ unit, onCitySelect }: PopularCitiesWeatherProps) {
  const { cities, loading, error } = usePopularCitiesWeather(unit);

  return (
    <section className="rounded-2xl bg-muted/10 p-4 shadow-sm md:p-6">
      <div className="mb-5 flex flex-col gap-2 text-primary-foreground md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            Popular City Weather
          </h2>
          <p className="max-w-2xl text-sm font-medium leading-6 text-primary-foreground/90">
            Live weather from six major cities, refreshed with a new global set every minute.
          </p>
        </div>
        {loading && (
          <span className="inline-flex items-center gap-2 text-sm font-medium text-primary-foreground">
            <RefreshCw className="h-4 w-4 animate-spin" />
            Updating
          </span>
        )}
      </div>

      {error && cities.length === 0 ? (
        <div className="rounded-xl bg-card/95 p-4 text-sm font-medium text-muted-foreground shadow-xs">
          {error}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {loading && cities.length === 0
            ? POPULAR_CITIES.map((city) => (
                <div key={city} className="rounded-2xl bg-card/95 p-4 shadow-xs">
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
                  className="group min-h-[176px] rounded-2xl bg-card/95 p-4 text-left text-foreground shadow-xs transition-all duration-300 hover:-translate-y-1 hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={`Show full weather for ${city.city}`}
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-bold tracking-tight">{city.city}</p>
                      <p className="mt-1 flex items-center gap-1 text-sm font-medium text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        {city.country}
                      </p>
                    </div>
                    <div className="rounded-full bg-primary/10 p-3 text-primary transition-colors group-hover:bg-accent/15">
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
                      <p className="mt-1 text-sm font-medium capitalize text-muted-foreground">
                        {city.description}
                      </p>
                    </div>
                    <p className="text-right text-xs font-semibold leading-5 text-muted-foreground">
                      Wind<br />
                      {formatWindSpeed(city.windSpeed, unit)}
                    </p>
                  </div>
                </button>
              ))}
        </div>
      )}

      {error && cities.length > 0 && (
        <p className="mt-3 text-sm font-medium text-muted-foreground">
          Live refresh paused. Restart the dev server after changing `.env`, then refresh the browser.
        </p>
      )}
    </section>
  );
}
