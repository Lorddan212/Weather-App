/**
 * WeatherBackground Component
 * 
 * Dynamic background that changes based on weather conditions.
 * Includes animated particles and gradients.
 */

import { useMemo } from 'react';
import type { WeatherConditionType } from '@/types/weather';
import { getWeatherBackground } from '@/utils/weatherUtils';

interface WeatherBackgroundProps {
  conditionType: WeatherConditionType;
  isDay?: boolean;
}

/**
 * Generate random particles for background animation
 */
const generateParticles = (count: number, type: 'rain' | 'snow' | 'cloud') => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 5}s`,
    animationDuration: `${type === 'rain' ? 0.5 + Math.random() * 0.5 : type === 'snow' ? 3 + Math.random() * 4 : 20 + Math.random() * 20}s`,
    size: type === 'cloud' ? 50 + Math.random() * 100 : type === 'snow' ? 2 + Math.random() * 4 : 1 + Math.random() * 2,
    opacity: type === 'cloud' ? 0.1 + Math.random() * 0.2 : 0.3 + Math.random() * 0.5,
  }));
};

export const WeatherBackground: React.FC<WeatherBackgroundProps> = ({
  conditionType,
  isDay = true,
}) => {
  const gradientClass = getWeatherBackground(conditionType, isDay);

  // Generate particles based on condition
  const particles = useMemo(() => {
    switch (conditionType) {
      case 'rain':
      case 'drizzle':
        return generateParticles(50, 'rain');
      case 'snow':
        return generateParticles(30, 'snow');
      case 'clouds':
        return generateParticles(5, 'cloud');
      default:
        return [];
    }
  }, [conditionType]);

  const renderParticles = () => {
    switch (conditionType) {
      case 'rain':
      case 'drizzle':
        return (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((p) => (
              <div
                key={p.id}
                className="absolute w-px bg-gradient-to-b from-primary/0 via-primary/50 to-primary/0 animate-rain"
                style={{
                  left: p.left,
                  height: '20px',
                  animationDelay: p.animationDelay,
                  animationDuration: p.animationDuration,
                }}
              />
            ))}
          </div>
        );

      case 'snow':
        return (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((p) => (
              <div
                key={p.id}
                className="absolute rounded-full bg-background animate-snow"
                style={{
                  left: p.left,
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  opacity: p.opacity,
                  animationDelay: p.animationDelay,
                  animationDuration: p.animationDuration,
                }}
              />
            ))}
          </div>
        );

      case 'clouds':
        return (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((p) => (
              <div
                key={p.id}
                className="absolute rounded-full bg-background/10 blur-3xl animate-float-slow"
                style={{
                  left: p.left,
                  top: `${Math.random() * 50}%`,
                  width: `${p.size}px`,
                  height: `${p.size * 0.6}px`,
                  opacity: p.opacity,
                  animationDelay: p.animationDelay,
                  animationDuration: p.animationDuration,
                }}
              />
            ))}
          </div>
        );

      case 'clear':
        return isDay ? (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Sun rays */}
            <div 
              className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-accent/20 blur-3xl animate-pulse-slow"
            />
            <div 
              className="absolute top-10 right-10 w-64 h-64 rounded-full bg-primary/10 blur-2xl animate-float"
              style={{ animationDelay: '2s' }}
            />
          </div>
        ) : (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Stars */}
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-background animate-twinkle"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 60}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  opacity: 0.3 + Math.random() * 0.7,
                }}
              />
            ))}
            {/* Moon glow */}
            <div 
              className="absolute top-10 right-10 w-32 h-32 rounded-full bg-background/10 blur-3xl"
            />
          </div>
        );

      case 'thunderstorm':
        return (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Lightning flash */}
            <div className="absolute inset-0 bg-accent/10 animate-lightning" />
            {particles.map((p) => (
              <div
                key={p.id}
                className="absolute w-px bg-gradient-to-b from-accent/0 via-accent/30 to-accent/0 animate-rain"
                style={{
                  left: p.left,
                  height: '20px',
                  animationDelay: p.animationDelay,
                  animationDuration: p.animationDuration,
                }}
              />
            ))}
          </div>
        );

      case 'mist':
      case 'fog':
        return (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-full h-32 bg-gradient-to-r from-background/0 via-background/5 to-background/0 animate-fog"
                style={{
                  top: `${i * 15}%`,
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: '15s',
                }}
              />
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div 
      className={`fixed inset-0 -z-10 bg-gradient-to-br ${gradientClass} transition-all duration-1000`}
    >
      {/* Base gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/20 to-background/80" />
      
      {/* Animated particles */}
      {renderParticles()}
      
    </div>
  );
};
