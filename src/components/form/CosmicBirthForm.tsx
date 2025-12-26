'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { LocationResult } from '@/lib/maptiler';

/**
 * Convert a local date/time string in a specific timezone to UTC ISO string
 *
 * Strategy: We create a Date object as if the input is UTC, then format it
 * in the target timezone. The difference tells us the timezone offset.
 * We then apply the reverse offset to get the correct UTC time.
 *
 * @param localDateTimeString - Local date/time in format "YYYY-MM-DDTHH:mm:ss"
 * @param timezone - IANA timezone string (e.g., "America/New_York", "Europe/London")
 * @returns UTC datetime as ISO string
 */
function convertToUTC(localDateTimeString: string, timezone: string): string {
  // Parse the input date/time components
  const [datePart, timePart] = localDateTimeString.split('T');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hour, minute, second = 0] = timePart.split(':').map(Number);

  // Create a Date treating our input as if it were UTC
  const asIfUtc = new Date(Date.UTC(year, month - 1, day, hour, minute, second));

  // Format this date in the target timezone to see what local time it represents
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const parts = formatter.formatToParts(asIfUtc);
  const getValue = (type: string) => parts.find(p => p.type === type)?.value || '00';

  const tzYear = parseInt(getValue('year'));
  const tzMonth = parseInt(getValue('month'));
  const tzDay = parseInt(getValue('day'));
  const tzHour = parseInt(getValue('hour'));
  const tzMinute = parseInt(getValue('minute'));
  const tzSecond = parseInt(getValue('second'));

  // Calculate the offset: how different is the TZ representation from our input?
  const tzAsUtc = Date.UTC(tzYear, tzMonth - 1, tzDay, tzHour, tzMinute, tzSecond);
  const offset = asIfUtc.getTime() - tzAsUtc;

  // Apply the offset: if the input is meant to be in the target timezone,
  // we need to adjust by this offset to get the true UTC time
  const correctUtc = new Date(asIfUtc.getTime() - offset);

  return correctUtc.toISOString();
}

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

    // Convert local time in birth location timezone to UTC
    const localDateTimeString = `${birthDate}T${birthTime}:00`;
    const utcString = convertToUTC(localDateTimeString, location.timezone);

    onSubmit({
      datetime_utc: utcString,
      lat: location.lat,
      lng: location.lng,
    });
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
