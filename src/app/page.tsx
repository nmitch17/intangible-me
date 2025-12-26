'use client';

import { useState, useRef, useEffect } from 'react';
import { CosmicBirthForm } from '@/components/form';
import { ChartResult } from '@/components/chart';
import type { ChartResponse } from '@/types';

export default function Home() {
  const [chartData, setChartData] = useState<ChartResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cardRef = useRef<HTMLElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);

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

  // Scroll to chart when data is loaded
  useEffect(() => {
    if (chartData && chartRef.current) {
      chartRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [chartData]);

  // Mouse parallax effect for the card
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const xAxis = (window.innerWidth / 2 - e.pageX) / 45;
      const yAxis = (window.innerHeight / 2 - e.pageY) / 45;
      card.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    };

    const handleMouseLeave = () => {
      card.style.transition = 'all 0.5s ease';
      card.style.transform = 'rotateY(0deg) rotateX(0deg)';
    };

    const handleMouseEnter = () => {
      card.style.transition = 'none';
    };

    document.body.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseleave', handleMouseLeave);
    document.body.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      document.body.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
      document.body.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  return (
    <>
      {/* Grain Overlay */}
      <svg className="grain">
        <filter id="noiseFilter">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)"/>
      </svg>

      {/* Cosmic Background */}
      <div className="cosmos">
        <div className="stars" />
        <div className="nebula nebula-1" />
        <div className="nebula nebula-2" />
      </div>

      {/* Hero Section */}
      <main className="min-h-screen flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-[1fr_450px] items-center gap-8 lg:gap-16 animate-reveal">

          {/* Manifesto / Left Side */}
          <section className="text-center lg:text-left pointer-events-none">
            <div className="data-point justify-center lg:justify-start">
              Cosmic Blueprint Generator
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[0.9] tracking-[-0.04em] uppercase mb-6">
              <span className="bg-gradient-to-b from-white to-white/20 bg-clip-text text-transparent">
                Discover<br />Your Design
              </span>
            </h1>
            <p className="font-mono text-sm text-white/60 max-w-[400px] leading-relaxed mx-auto lg:mx-0">
              Your Human Design chart reveals the energetic blueprint you were born with.
              Enter your birth details to unlock your unique cosmic configuration.
            </p>
          </section>

          {/* Form Card / Right Side */}
          <section
            ref={cardRef}
            className="crystal-card p-8 md:p-10"
            style={{ perspective: '1000px' }}
          >
            <h2 className="font-mono text-sm tracking-[0.4em] mb-8 text-white/60 text-center uppercase">
              Birth Data
            </h2>

            <CosmicBirthForm
              onSubmit={handleSubmit}
              isLoading={isLoading}
              error={error}
            />

            <div className="mt-6 flex justify-center">
              <span className="font-mono text-[0.65rem] text-white/40 tracking-wider">
                ACCURATE TO THE SECOND
              </span>
            </div>
          </section>
        </div>
      </main>

      {/* Chart Results Section */}
      {chartData && (
        <div
          ref={chartRef}
          className="min-h-screen px-4 md:px-8 pb-16 pt-8"
        >
          <div className="max-w-5xl mx-auto animate-reveal">
            <div className="text-center mb-8">
              <div className="data-point justify-center">
                Chart Generated
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                <span className="bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
                  Your Human Design
                </span>
              </h2>
            </div>

            <div className="space-y-6">
              <ChartResult
                chart={chartData.chart}
                birth={chartData.birth}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
