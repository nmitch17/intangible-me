'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { LocationResult } from '@/lib/maptiler';

interface LocationSearchProps {
  onSelect: (location: { lat: number; lng: number; displayName: string; timezone: string }) => void;
  value?: string;
  error?: string;
}

export function LocationSearch({ onSelect, value = '', error }: LocationSearchProps) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<LocationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [hasSelected, setHasSelected] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced search
  useEffect(() => {
    // Don't search if user just selected a location
    if (hasSelected) {
      return;
    }

    if (query.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true);
      setApiError(null);

      try {
        const response = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`);

        if (!response.ok) {
          const data = await response.json();
          if (response.status === 429) {
            setApiError('Too many requests. Please wait a moment and try again.');
          } else {
            setApiError(data.error || 'Failed to search locations');
          }
          setResults([]);
          setIsOpen(false);
          return;
        }

        const data: LocationResult[] = await response.json();
        setResults(data);
        setIsOpen(data.length > 0);
        setSelectedIndex(-1);
      } catch {
        setApiError('Network error. Please check your connection and try again.');
        setResults([]);
        setIsOpen(false);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, hasSelected]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = useCallback((location: LocationResult) => {
    setQuery(location.displayName);
    setHasSelected(true);
    setIsOpen(false);
    setResults([]);
    onSelect({
      lat: location.lat,
      lng: location.lng,
      displayName: location.displayName,
      timezone: location.timezone || 'UTC',
    });
  }, [onSelect]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleSelect(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setQuery(newValue);
    // Clear selection when user edits after selecting
    if (hasSelected) {
      setHasSelected(false);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
        Birth Location <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (results.length > 0 && !hasSelected) {
              setIsOpen(true);
            }
          }}
          placeholder="Search city, zip code, or location..."
          className={`w-full p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100 pr-8 ${
            error ? 'border-red-500' : ''
          }`}
          role="combobox"
          aria-label="Search for birth location"
          aria-expanded={isOpen}
          aria-controls="location-search-listbox"
          aria-haspopup="listbox"
          aria-autocomplete="list"
          autoComplete="off"
        />
        {isLoading && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <svg
              className="animate-spin h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Error message */}
      {(error || apiError) && (
        <p className="text-xs text-red-500 mt-1">{error || apiError}</p>
      )}

      {/* Dropdown results */}
      {isOpen && (
        <ul
          id="location-search-listbox"
          className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto"
          role="listbox"
        >
          {results.length === 0 && !isLoading && query.length >= 2 && (
            <li className="px-4 py-2 text-gray-500 dark:text-gray-400 text-sm">
              No results found
            </li>
          )}
          {results.map((result, index) => (
            <li
              key={result.id}
              role="option"
              aria-selected={index === selectedIndex}
              className={`px-4 py-2 cursor-pointer text-sm truncate ${
                index === selectedIndex
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100'
                  : 'text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
              onClick={() => handleSelect(result)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              {result.displayName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
