'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { ChartData, BirthData, SelectedElement } from '@/types';
import Bodygraph2D from '@/components/chart/Bodygraph2D';
import ElementInfoPanel from '@/components/chart/ElementInfoPanel';

interface Sparkle {
  id: number;
  left: string;
  top: string;
  delay: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [birthData, setBirthData] = useState<BirthData | null>(null);
  const [selectedElement, setSelectedElement] = useState<SelectedElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

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

  useEffect(() => {
    // Check for chart data in sessionStorage
    const storedChart = sessionStorage.getItem('chartData');
    const storedBirth = sessionStorage.getItem('birthData');

    if (storedChart) {
      try {
        setChartData(JSON.parse(storedChart));
        if (storedBirth) {
          setBirthData(JSON.parse(storedBirth));
        }
      } catch (error) {
        console.error('Failed to parse stored chart data:', error);
        router.push('/');
        return;
      }
    } else {
      // No chart data, redirect to home
      router.push('/');
      return;
    }

    setIsLoading(false);
  }, [router]);

  if (isLoading || !chartData) {
    return (
      <>
        <div className="solar-haze-bg">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
        </div>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-white/20 border-t-[#ff9d6c] rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white/60">Loading your chart...</p>
          </div>
        </div>
      </>
    );
  }

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

      <main className="min-h-screen relative overflow-hidden">

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span className="text-sm">Back to Chart</span>
          </Link>

          <div className="text-center">
            <h1 className="text-lg font-serif text-white">
              Bodygraph Explorer
            </h1>
            {birthData?.timezone && (
              <p className="text-xs text-white/40">{birthData.timezone}</p>
            )}
          </div>

          <div className="text-right">
            <div className="text-sm text-[#ff9d6c]">{chartData.type}</div>
            <div className="text-xs text-white/50">{chartData.profile}</div>
          </div>
        </div>
      </header>

      {/* Chart summary bar */}
      <div className="absolute top-16 left-0 right-0 z-10 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-6 py-2 px-4 rounded-full bg-black/30 backdrop-blur-md border border-white/5 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-white/40">Strategy:</span>
              <span className="text-white/80">{chartData.strategy}</span>
            </div>
            <div className="w-px h-3 bg-white/10" />
            <div className="flex items-center gap-2">
              <span className="text-white/40">Authority:</span>
              <span className="text-white/80">{chartData.authority}</span>
            </div>
            <div className="w-px h-3 bg-white/10" />
            <div className="flex items-center gap-2">
              <span className="text-white/40">Definition:</span>
              <span className="text-white/80">{chartData.definition}</span>
            </div>
            <div className="w-px h-3 bg-white/10" />
            <div className="flex items-center gap-2">
              <span className="text-white/40">Channels:</span>
              <span className="text-white/80">{chartData.channels.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2D Bodygraph */}
      <div className="absolute inset-0 pt-28 pb-24">
        <Bodygraph2D
          chartData={chartData}
          onElementSelect={setSelectedElement}
          selectedElement={selectedElement}
        />
      </div>

      {/* Info Panel */}
      {selectedElement && (
        <ElementInfoPanel
          element={selectedElement}
          chartData={chartData}
          onClose={() => setSelectedElement(null)}
        />
      )}

      {/* Cross info (bottom) */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10">
        <div className="px-4 py-2 rounded-lg bg-black/30 backdrop-blur-md border border-white/5 text-center">
          <div className="text-xs text-white/40 mb-1">Incarnation Cross</div>
          <div className="text-sm text-white/90">{chartData.cross.name}</div>
          <div className="text-xs text-[#ffe66d]/70 mt-1">
            {chartData.cross.type} • {chartData.cross.quarter}
          </div>
        </div>
      </div>
      </main>
    </>
  );
}
