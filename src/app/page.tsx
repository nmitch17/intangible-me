'use client';

import { useState } from 'react';
import { BirthDataForm } from '@/components/form';
import { ChartResult } from '@/components/chart';
import type { ChartResponse } from '@/types';

export default function Home() {
  const [chartData, setChartData] = useState<ChartResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: { datetime_utc: string; lat: number; lng: number }) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to calculate chart');
      }

      const result = await response.json();
      setChartData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Human Design Chart
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Calculate your unique energetic blueprint
          </p>
        </header>

        <BirthDataForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          error={error}
        />

        {chartData && (
          <ChartResult
            chart={chartData.chart}
            birth={chartData.birth}
          />
        )}
      </div>
    </main>
  );
}
