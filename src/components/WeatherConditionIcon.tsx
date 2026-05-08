import type { ComponentProps, ComponentType } from 'react';
import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  Sun,
  Tornado,
  Wind,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { WeatherConditionType } from '@/types/weather';

type IconProps = ComponentProps<typeof Sun>;

interface WeatherConditionIconProps extends IconProps {
  conditionType: WeatherConditionType;
}

const conditionIcons: Record<WeatherConditionType, ComponentType<IconProps>> = {
  clear: Sun,
  clouds: Cloud,
  rain: CloudRain,
  drizzle: CloudDrizzle,
  thunderstorm: CloudLightning,
  snow: CloudSnow,
  mist: CloudFog,
  fog: CloudFog,
  haze: CloudFog,
  dust: Wind,
  sand: Wind,
  ash: Wind,
  squall: Wind,
  tornado: Tornado,
  unknown: Cloud,
};

const conditionTones: Record<WeatherConditionType, string> = {
  clear: 'text-accent',
  clouds: 'text-muted-foreground',
  rain: 'text-primary',
  drizzle: 'text-primary',
  thunderstorm: 'text-secondary',
  snow: 'text-primary',
  mist: 'text-muted-foreground',
  fog: 'text-muted-foreground',
  haze: 'text-accent',
  dust: 'text-accent',
  sand: 'text-accent',
  ash: 'text-secondary',
  squall: 'text-secondary',
  tornado: 'text-secondary',
  unknown: 'text-muted-foreground',
};

export function WeatherConditionIcon({
  conditionType,
  className,
  ...props
}: WeatherConditionIconProps) {
  const Icon = conditionIcons[conditionType] || Cloud;

  return (
    <Icon
      aria-hidden="true"
      className={cn(conditionTones[conditionType], className)}
      {...props}
    />
  );
}
