'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { LocationResult } from '@/lib/maptiler';

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

    const dateInTz = new Date(`${birthDate}T${birthTime}:00`);
    const utcString = dateInTz.toISOString();

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
        <div className="mb-6 p-3 bg-red-500/20 border border-red-500/50 rounded text-red-300 text-sm font-mono">
          {displayError}
        </div>
      )}

      <div className="cosmic-input-group">
        <label>Birth Date</label>
        <input
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          className="cosmic-input"
          required
        />
        <div className="cosmic-input-bar" />
      </div>

      <div className="cosmic-input-group">
        <label>Birth Time</label>
        <input
          type="time"
          value={birthTime}
          onChange={(e) => setBirthTime(e.target.value)}
          className="cosmic-input"
          required
        />
        <div className="cosmic-input-bar" />
      </div>

      <div ref={containerRef} className="cosmic-input-group">
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
            className="cosmic-input pr-8"
            autoComplete="off"
          />
          <div className="cosmic-input-bar" />
          {isSearching && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2">
              <svg className="animate-spin h-5 w-5 text-nebula-cyan" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          )}
        </div>

        {isOpen && (
          <ul className="absolute z-50 w-full mt-2 cosmic-dropdown rounded-md shadow-lg max-h-60 overflow-auto">
            {results.map((result, index) => (
              <li
                key={result.id}
                className={`px-4 py-3 cursor-pointer text-sm transition-colors ${
                  index === selectedIndex
                    ? 'bg-nebula-cyan/20 text-white'
                    : 'text-white/70 hover:bg-white/5'
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
          <p className="text-xs text-nebula-cyan/70 mt-2 font-mono">
            {location.lat.toFixed(4)}, {location.lng.toFixed(4)} | {location.timezone}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="cosmic-button mt-4"
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
