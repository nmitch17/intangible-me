'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { CosmicBirthForm } from '@/components/form';
import { ChartResult } from '@/components/chart';
import { CopilotChat } from '@/components/chat';
import type { ChartResponse } from '@/types';

interface Sparkle {
  id: number;
  left: string;
  top: string;
  delay: string;
}

export default function Home() {
  const [chartData, setChartData] = useState<ChartResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const chartRef = useRef<HTMLDivElement>(null);

  // Generate sparkles only on client to avoid hydration mismatch
  useEffect(() => {
    setSparkles(
      Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        delay: `${Math.random() * 4}s`,
      }))
    );
  }, []);

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

      // Store in sessionStorage for dashboard access
      try {
        sessionStorage.setItem('chartData', JSON.stringify(result.chart));
        sessionStorage.setItem('birthData', JSON.stringify(result.birth));
      } catch (e) {
        console.error('Failed to save chart to session storage:', e);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Scroll to chart when data is loaded
  useEffect(() => {
    if (chartData && chartRef.current) {
      chartRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [chartData]);

  return (
    <>
      {/* Grain Overlay */}
      <svg className="grain">
        <filter id="noiseFilter">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)"/>
      </svg>

      {/* Solar Haze Background */}
      <div className="solar-haze-bg">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />

        {/* Sparkle particles */}
        {sparkles.map((sparkle) => (
          <div
            key={sparkle.id}
            className="sparkle"
            style={{
              left: sparkle.left,
              top: sparkle.top,
              animationDelay: sparkle.delay,
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <main className="min-h-screen flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-[1fr_480px] items-center gap-8 lg:gap-16 animate-slideUp">

          {/* Manifesto / Left Side */}
          <section className="text-center lg:text-left pointer-events-none">
            <div className="data-point justify-center lg:justify-start">
              Live an empowered life
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-normal leading-[0.95] tracking-[-0.02em] mb-6 text-white">
              Discover Your <br />Human Design
            </h1>
            <p className="font-sans font-light text-base text-white/70 max-w-[400px] leading-relaxed mx-auto lg:mx-0">
              Your Human Design chart is the energetic blueprint you were born with. It reveals the unique gifts, challenges, and potential you carry within.
              <br /><br />
              Learn why you've never felt quite right in your own skin and the practical steps you can take right now to start living the life you were meant to live.
            </p>
          </section>

          {/* Form Card / Right Side */}
          <div className="prism-suspension">
            <div className="glass-shroud" />
            <section className="clay-card p-8 md:p-12">
              <h2 className="font-mono text-xs tracking-[0.25em] mb-8 text-solar-glow text-center uppercase">
                About You
              </h2>

              <CosmicBirthForm
                onSubmit={handleSubmit}
                isLoading={isLoading}
                error={error}
              />

            </section>
          </div>
        </div>
      </main>

      {/* Chart Results Section */}
      {chartData && (
        <div
          ref={chartRef}
          className="min-h-screen px-4 md:px-8 pb-16 pt-8"
        >
          <div className="max-w-5xl mx-auto animate-slideUp">
            <div className="prism-suspension">
              <div className="glass-shroud-lg" />
              <div className="text-center mb-8">
                <div className="data-point justify-center">
                  Chart Generated
                </div>
                <h2 className="font-display text-3xl md:text-4xl font-normal text-white">
                  Your Human Design
                </h2>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 mt-4 px-6 py-3 rounded-xl bg-gradient-to-r from-[#ff9d6c] to-[#f0a2b1] text-[#1a0f2e] font-medium text-sm hover:opacity-90 transition-opacity"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line x1="12" y1="22.08" x2="12" y2="12" />
                  </svg>
                  Explore 3D Bodygraph
                </Link>
              </div>

              <div className="prism-suspension">
                <div className="space-y-6 relative z-[1]">
                  <ChartResult
                    chart={chartData.chart}
                    birth={chartData.birth}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CopilotKit Chat */}
      <CopilotChat chart={chartData?.chart} />
    </>
  );
}
