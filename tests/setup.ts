/**
 * Vitest Setup
 *
 * Patches global fetch to handle file:// URLs for WASM loading in Node.js
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';

const originalFetch = global.fetch;

global.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;

  if (url.startsWith('file://')) {
    const filePath = fileURLToPath(url);
    const buffer = readFileSync(filePath);
    return new Response(buffer, {
      status: 200,
      headers: { 'Content-Type': 'application/wasm' },
    });
  }

  return originalFetch(input, init);
};
