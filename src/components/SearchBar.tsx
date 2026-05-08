/**
 * SearchBar Component
 * 
 * A reusable search input with loading state and search history.
 * Features location detection and recent searches dropdown.
 */

import { useState, useRef, useEffect } from 'react';
import { Search, MapPin, X, Clock, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { SearchHistoryItem } from '@/hooks/useLocalStorage';

interface SearchBarProps {
  onSearch: (city: string) => void;
  onLocationClick: () => void;
  isLoading: boolean;
  isLocating: boolean;
  history: SearchHistoryItem[];
  onHistoryItemClick: (city: string) => void;
  onClearHistory: () => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onLocationClick,
  isLoading,
  isLocating,
  history,
  onHistoryItemClick,
  onClearHistory,
  placeholder = 'Search for a city...',
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  const handleHistoryClick = (city: string) => {
    setQuery(city);
    onHistoryItemClick(city);
    setIsFocused(false);
  };

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const showHistory = isFocused && history.length > 0 && query.length === 0;

  return (
    <div ref={containerRef} className="relative w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <Search 
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none dark:text-primary-foreground/70" 
          />
          <Input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            placeholder={placeholder}
            className="h-12 rounded-xl border-0 border-b-2 border-input bg-background/95 pl-10 pr-10 text-base font-semibold text-foreground shadow-xs backdrop-blur-sm transition-all duration-200 placeholder:font-medium placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-0 dark:bg-primary/25 dark:text-primary-foreground dark:placeholder:text-primary-foreground/70"
            disabled={isLoading}
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted transition-colors dark:hover:bg-primary-foreground/10"
            >
              <X className="w-4 h-4 text-muted-foreground dark:text-primary-foreground/70" />
            </button>
          )}
        </div>
        
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={onLocationClick}
          disabled={isLocating}
          className="h-12 w-12 shrink-0 bg-background/95 text-foreground backdrop-blur-sm transition-all duration-200 hover:bg-primary/10 dark:bg-primary/25 dark:text-primary-foreground dark:hover:bg-primary/35"
          title="Use my location"
        >
          {isLocating ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <MapPin className="w-5 h-5" />
          )}
        </Button>
        
        <Button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="h-12 shrink-0 rounded-xl bg-primary bg-none px-6 font-bold text-primary-foreground shadow-xs transition-all duration-200 hover:bg-secondary hover:text-secondary-foreground disabled:cursor-not-allowed disabled:bg-primary disabled:text-primary-foreground disabled:opacity-100 dark:hover:bg-accent dark:hover:text-accent-foreground"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            'Search'
          )}
        </Button>
      </form>

      {/* Search History Dropdown */}
      {showHistory && (
        <div className="absolute top-full left-0 right-0 mt-2 py-2 bg-background/90 backdrop-blur-xl rounded-lg shadow-lg z-50 animate-in fade-in slide-in-from-top-2 duration-200 dark:bg-primary/25 dark:text-primary-foreground">
          <div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center justify-between dark:text-primary-foreground/75">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Recent Searches
            </span>
            {history.length > 0 && (
              <button
                onClick={onClearHistory}
                className="text-xs text-destructive transition-colors hover:text-destructive/80 dark:text-primary-foreground dark:hover:text-accent"
              >
                Clear
              </button>
            )}
          </div>
          <div className="max-h-48 overflow-y-auto">
            {history.map((item) => (
              <button
                key={`${item.city}-${item.timestamp}`}
                onClick={() => handleHistoryClick(item.city)}
                className="w-full px-3 py-2.5 text-left hover:bg-muted/50 transition-colors flex items-center justify-between group dark:hover:bg-primary-foreground/10"
              >
                <span className="font-medium">
                  {item.city}
                  <span className="text-muted-foreground ml-1 dark:text-primary-foreground/70">, {item.country}</span>
                </span>
                <Search className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity dark:text-primary-foreground/70" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
