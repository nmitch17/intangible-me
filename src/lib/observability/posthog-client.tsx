'use client';

import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import { useEffect } from 'react';

/**
 * Initialize PostHog on the client side
 */
export function PostHogInit() {
  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
        capture_pageview: true,
        capture_pageleave: true,
        autocapture: true,
        persistence: 'localStorage+cookie',
        session_recording: {
          maskAllInputs: true,
        },
        // Respect Do Not Track
        respect_dnt: true,
        // Disable in development unless explicitly enabled
        loaded: (posthog) => {
          if (process.env.NODE_ENV === 'development') {
            // Optionally disable in dev - uncomment to enable dev tracking
            // posthog.opt_out_capturing();
          }
        },
      });
    }
  }, []);

  return null;
}

/**
 * PostHog Provider wrapper for React components
 */
export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return <PHProvider client={posthog}>{children}</PHProvider>;
}

/**
 * Export the PostHog client for direct usage
 */
export { posthog };

/**
 * Client-side event capture helper
 */
export function captureClientEvent(
  event: string,
  properties?: Record<string, unknown>
) {
  if (typeof window !== 'undefined' && posthog) {
    posthog.capture(event, properties);
  }
}

/**
 * Identify user on the client side
 */
export function identifyClientUser(
  distinctId: string,
  properties?: Record<string, unknown>
) {
  if (typeof window !== 'undefined' && posthog) {
    posthog.identify(distinctId, properties);
  }
}

/**
 * Reset user identification (on logout)
 */
export function resetClientUser() {
  if (typeof window !== 'undefined' && posthog) {
    posthog.reset();
  }
}
