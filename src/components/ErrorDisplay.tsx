/**
 * ErrorDisplay Component
 * 
 * Displays error messages with appropriate styling and retry functionality.
 */

import type { ReactNode } from 'react';
import { AlertCircle, RefreshCw, MapPinOff, WifiOff, Key } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface ErrorDisplayProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

/**
 * Get appropriate icon based on error message
 */
const getErrorIcon = (message: string): ReactNode => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('location') || lowerMessage.includes('denied')) {
    return <MapPinOff className="w-5 h-5" />;
  }
  if (lowerMessage.includes('network') || lowerMessage.includes('internet')) {
    return <WifiOff className="w-5 h-5" />;
  }
  if (lowerMessage.includes('api key') || lowerMessage.includes('configuration')) {
    return <Key className="w-5 h-5" />;
  }
  
  return <AlertCircle className="w-5 h-5" />;
};

/**
 * Get error title based on message
 */
const getErrorTitle = (message: string): string => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('location')) return 'Location Error';
  if (lowerMessage.includes('network') || lowerMessage.includes('internet')) return 'Connection Error';
  if (lowerMessage.includes('api key')) return 'Configuration Error';
  if (lowerMessage.includes('not found')) return 'City Not Found';
  if (lowerMessage.includes('too many')) return 'Rate Limited';
  
  return 'Error';
};

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ 
  message, 
  onRetry,
  className = '' 
}) => {
  const icon = getErrorIcon(message);
  const title = getErrorTitle(message);

  return (
    <Alert 
      variant="destructive" 
      className={`animate-in fade-in slide-in-from-bottom-4 duration-300 ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{icon}</div>
        <div className="flex-1">
          <AlertTitle className="font-semibold">{title}</AlertTitle>
          <AlertDescription className="mt-1 text-sm opacity-90">
            {message}
          </AlertDescription>
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="mt-3 bg-background/50 hover:bg-background"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          )}
        </div>
      </div>
    </Alert>
  );
};
