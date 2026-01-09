/**
 * In-memory rate limiter for API endpoints
 * Thread-safe for serverless environments
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

class RateLimiter {
  private requests: Map<string, RateLimitEntry> = new Map();
  private readonly limit: number;
  private readonly windowMs: number;

  constructor(limit: number, windowMs: number) {
    this.limit = limit;
    this.windowMs = windowMs;
  }

  /**
   * Check if a request should be rate limited
   * @param identifier - Unique identifier (e.g., IP address)
   * @returns Object with success status and retry information
   */
  check(identifier: string): {
    success: boolean;
    limit: number;
    remaining: number;
    reset: number;
  } {
    const now = Date.now();
    const entry = this.requests.get(identifier);

    // Clean up expired entries periodically
    if (this.requests.size > 1000) {
      this.cleanup(now);
    }

    if (!entry || now >= entry.resetAt) {
      // No entry or window expired, create new entry
      this.requests.set(identifier, {
        count: 1,
        resetAt: now + this.windowMs,
      });

      return {
        success: true,
        limit: this.limit,
        remaining: this.limit - 1,
        reset: now + this.windowMs,
      };
    }

    if (entry.count < this.limit) {
      // Within limit, increment count
      entry.count++;
      this.requests.set(identifier, entry);

      return {
        success: true,
        limit: this.limit,
        remaining: this.limit - entry.count,
        reset: entry.resetAt,
      };
    }

    // Rate limit exceeded
    return {
      success: false,
      limit: this.limit,
      remaining: 0,
      reset: entry.resetAt,
    };
  }

  /**
   * Clean up expired entries
   */
  private cleanup(now: number): void {
    for (const [key, entry] of this.requests.entries()) {
      if (now >= entry.resetAt) {
        this.requests.delete(key);
      }
    }
  }
}

// Nominatim rate limit: 1 request per second
// We use a slightly more generous limit to account for bursts
export const nominatimRateLimiter = new RateLimiter(1, 1000); // 1 request per second

/**
 * Get client identifier from request
 * Uses IP address or falls back to a default for development
 */
export function getClientIdentifier(request: Request): string {
  // Try to get real IP from headers (Vercel, Cloudflare, etc.)
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');

  const ip = cfConnectingIp || realIp || forwardedFor?.split(',')[0] || 'unknown';

  return ip.trim();
}
