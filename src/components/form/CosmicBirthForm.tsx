'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { LocationResult } from '@/lib/maptiler';
import { parseISO, isValid, formatISO } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';

interface CosmicBirthFormProps {
  onSubmit: (data: { datetime_utc: string; lat: number; lng: number }) => void;
  isLoading: boolean;
  error: string | null;
}

interface Location {
  lat: number;
  lng: number;
  displayName: string;
  timezone: string;
}

export function CosmicBirthForm({ onSubmit, isLoading, error }: CosmicBirthFormProps) {
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [location, setLocation] = useState<Location | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Location search state
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LocationResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [hasSelected, setHasSelected] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const timezone = location?.timezone || 'UTC';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!birthDate || !birthTime || !location) {
      setValidationError('Please fill in all required fields');
      return;
    }

    // Validate date format (YYYY-MM-DD)
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!datePattern.test(birthDate)) {
      setValidationError('Invalid date format. Please use a valid date.');
      return;
    }

    // Validate time format (HH:MM)
    const timePattern = /^\d{2}:\d{2}$/;
    if (!timePattern.test(birthTime)) {
      setValidationError('Invalid time format. Please use a valid time.');
      return;
    }

    // Construct ISO string and validate it's a real date
    const dateTimeString = `${birthDate}T${birthTime}:00`;
    const parsedDate = parseISO(dateTimeString);

    if (!isValid(parsedDate)) {
      setValidationError('Invalid date or time. Please check your input and try again.');
      return;
    }

    // Convert from local timezone to UTC
    try {
      const utcDate = zonedTimeToUtc(dateTimeString, timezone);

      if (!isValid(utcDate)) {
        setValidationError('Unable to convert date to UTC. Please try again.');
        return;
      }

      const utcString = formatISO(utcDate);

      onSubmit({
        datetime_utc: utcString,
        lat: location.lat,
        lng: location.lng,
      });
    } catch (error) {
      setValidationError('Invalid date or timezone. Please check your input and try again.');
    }
  };

  // Location search effect
  useEffect(() => {
    if (hasSelected) return;
    if (query.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`);
        if (response.ok) {
          const data: LocationResult[] = await response.json();
          setResults(data);
          setIsOpen(data.length > 0);
          setSelectedIndex(-1);
        }
      } catch {
        setResults([]);
        setIsOpen(false);
      } finally {
        setIsSearching(false);
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

  const handleSelectLocation = useCallback((loc: LocationResult) => {
    setQuery(loc.displayName);
    setHasSelected(true);
    setIsOpen(false);
    setResults([]);
    setLocation({
      lat: loc.lat,
      lng: loc.lng,
      displayName: loc.displayName,
      timezone: loc.timezone || 'UTC',
    });
  }, []);

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
          handleSelectLocation(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const displayError = validationError || error;

  return (
    <form onSubmit={handleSubmit}>
      {displayError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm font-mono">
          {displayError}
        </div>
      )}

      <div className="solar-input-group">
        <label>Birth Date</label>
        <input
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          className="solar-input"
          required
        />
      </div>

      <div className="solar-input-group">
        <label>Birth Time</label>
        <input
          type="time"
          value={birthTime}
          onChange={(e) => setBirthTime(e.target.value)}
          className="solar-input"
          required
        />
      </div>

      <div ref={containerRef} className="solar-input-group">
        <label>Birth Location</label>
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (hasSelected) setHasSelected(false);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (results.length > 0 && !hasSelected) setIsOpen(true);
            }}
            placeholder="Search city or location..."
            className="solar-input pr-10"
            autoComplete="off"
          />
          {isSearching && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <svg className="animate-spin h-5 w-5 text-solar-glow" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          )}
        </div>

        {isOpen && (
          <ul className="absolute z-50 w-full mt-2 solar-dropdown rounded-xl shadow-lg max-h-60 overflow-auto">
            {results.map((result, index) => (
              <li
                key={result.id}
                className={`px-4 py-3 cursor-pointer text-sm transition-colors ${
                  index === selectedIndex
                    ? 'bg-solar-glow/20 text-deep-cosmos'
                    : 'text-deep-cosmos/70 hover:bg-haze-pink/10'
                }`}
                onClick={() => handleSelectLocation(result)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                {result.displayName}
              </li>
            ))}
          </ul>
        )}

        {location && (
          <p className="text-xs text-solar-glow mt-2 font-mono ml-1.5">
            {location.lat.toFixed(4)}, {location.lng.toFixed(4)} | {location.timezone}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="solar-button mt-6"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-3">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Calculating...
          </span>
        ) : (
          'Reveal Your Design'
        )}
      </button>
    </form>
  );
}
