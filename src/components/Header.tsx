/**
 * Header Component
 * 
 * Application header with logo, theme toggle, and unit switch.
 */

import { Cloud, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import type { TemperatureUnit, ThemeMode } from '@/types/weather';

interface HeaderProps {
  theme: ThemeMode;
  onThemeToggle: () => void;
  unit: TemperatureUnit;
  onUnitChange: (unit: TemperatureUnit) => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onThemeToggle,
  unit,
  onUnitChange,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-background/70 shadow-xs backdrop-blur-xl">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Cloud className="w-8 h-8 text-primary" />
            <Sun className="w-4 h-4 text-accent absolute -top-1 -right-1" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            WeatherApp
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          {/* Unit Switch */}
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium ${unit === 'celsius' ? 'text-primary' : 'text-muted-foreground'}`}>
              °C
            </span>
            <Switch
              checked={unit === 'fahrenheit'}
              onCheckedChange={(checked) => onUnitChange(checked ? 'fahrenheit' : 'celsius')}
              aria-label="Toggle temperature unit"
            />
            <span className={`text-sm font-medium ${unit === 'fahrenheit' ? 'text-primary' : 'text-muted-foreground'}`}>
              °F
            </span>
          </div>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onThemeToggle}
            className="relative overflow-hidden"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            <div className="relative w-5 h-5">
              <Sun 
                className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
                  theme === 'dark' ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
                }`} 
              />
              <Moon 
                className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
                  theme === 'light' ? '-rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
                }`} 
              />
            </div>
          </Button>
        </div>
      </div>
    </header>
  );
};
