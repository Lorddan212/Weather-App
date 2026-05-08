/**
 * LoadingState Component
 * 
 * Displays loading skeletons and animations while data is being fetched.
 */

import type { FC } from 'react';
import { Loader2, Cloud, Sun, CloudRain } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

interface LoadingStateProps {
  className?: string;
}

/**
 * Animated weather icon loader
 */
export const WeatherLoader: FC = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8">
      <div className="relative">
        <Sun className="w-12 h-12 text-accent animate-spin-slow absolute -top-2 -right-2" />
        <Cloud className="w-16 h-16 text-muted-foreground animate-float dark:text-primary-foreground/75" />
        <CloudRain className="w-8 h-8 text-primary animate-bounce-subtle absolute -bottom-2 left-1/2 -translate-x-1/2" />
      </div>
      <p className="text-muted-foreground animate-pulse dark:text-primary-foreground/80">Loading weather data...</p>
    </div>
  );
};

/**
 * Skeleton loader for current weather
 */
export const CurrentWeatherSkeleton: FC = () => {
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-0 bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-xl dark:from-primary/30 dark:to-primary/15">
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-4 flex-1">
              <div className="space-y-2">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-6 w-24" />
              </div>
              
              <div className="flex items-center gap-4">
                <Skeleton className="h-20 w-32" />
                <Skeleton className="h-16 w-16 rounded-full" />
              </div>

              <Skeleton className="h-5 w-64" />
            </div>

            <Skeleton className="hidden md:block h-32 w-32 rounded-full" />
          </div>
        </CardContent>
      </Card>

      {/* Metrics Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-background/50 dark:bg-primary/20">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-5 w-12" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Skeleton loader for forecast
 */
export const ForecastSkeleton: FC = () => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-5 w-16" />
      </div>
      
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="overflow-hidden dark:bg-primary/25 dark:text-primary-foreground">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-14 w-14 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-4 w-12" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

/**
 * Full page loading state
 */
export const LoadingState: FC<LoadingStateProps> = ({ className = '' }) => {
  return (
    <div className={`space-y-8 ${className}`}>
      <CurrentWeatherSkeleton />
      <ForecastSkeleton />
    </div>
  );
};

/**
 * Inline loading spinner
 */
export const InlineLoader: FC<{ text?: string }> = ({ text = 'Loading...' }) => {
  return (
    <div className="flex items-center justify-center gap-2 py-4">
      <Loader2 className="w-5 h-5 animate-spin text-primary" />
      <span className="text-muted-foreground text-sm dark:text-primary-foreground/80">{text}</span>
    </div>
  );
};
