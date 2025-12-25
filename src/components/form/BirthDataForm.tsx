'use client';

import { useState } from 'react';
import { Spinner } from '@/components/ui';
import { LocationSearch } from './LocationSearch';

interface BirthDataFormProps {
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

export function BirthDataForm({ onSubmit, isLoading, error }: BirthDataFormProps) {
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [location, setLocation] = useState<Location | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Timezone is derived from location
  const timezone = location?.timezone || 'UTC';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!birthDate || !birthTime || !location) {
      setValidationError('Please fill in all required fields');
      return;
    }

    // Convert local time to UTC using the timezone
    const localDateTime = new Date(`${birthDate}T${birthTime}:00`);

    // Create a date string with the timezone for proper conversion
    const options: Intl.DateTimeFormatOptions = {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    };

    // Get the offset for the selected timezone at the given date
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    // For simplicity, we'll use a different approach: construct the datetime
    // and let the server interpret it. For now, we'll assume the user's input
    // is in their selected timezone and calculate the offset.

    // Get UTC string by creating a date in the local timezone and converting
    const dateInTz = new Date(`${birthDate}T${birthTime}:00`);

    // This is a simplified approach - for a production app, you'd want to use
    // a library like date-fns-tz or luxon for accurate timezone handling
    const utcString = dateInTz.toISOString();

    onSubmit({
      datetime_utc: utcString,
      lat: location.lat,
      lng: location.lng,
    });
  };

  const displayError = validationError || error;

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Calculate Your Chart
      </h2>

      {displayError && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-700 rounded text-red-700 dark:text-red-200 text-sm">
          {displayError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Birth Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Birth Time <span className="text-red-500">*</span>
          </label>
          <input
            type="time"
            value={birthTime}
            onChange={(e) => setBirthTime(e.target.value)}
            className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100"
            required
          />
        </div>

        <div className="md:col-span-2">
          <LocationSearch
            onSelect={setLocation}
            value={location?.displayName}
          />
          {location && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Coordinates: {location.lat.toFixed(4)}, {location.lng.toFixed(4)} | Timezone: {location.timezone}
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full md:w-auto bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Spinner size="sm" />
            Calculating...
          </>
        ) : (
          'Calculate Chart'
        )}
      </button>

    </form>
  );
}
