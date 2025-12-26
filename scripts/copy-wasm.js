const fs = require('fs');
const path = require('path');

const source = path.join(
  __dirname,
  '..',
  'node_modules',
  'sweph-wasm',
  'dist',
  'wasm',
  'swisseph.wasm'
);

const dest = path.join(__dirname, '..', 'public', 'swisseph.wasm');

try {
  // Ensure public directory exists
  const publicDir = path.dirname(dest);
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Copy file
  fs.copyFileSync(source, dest);
  console.log('✓ Copied swisseph.wasm to public directory');
} catch (error) {
  console.error('✗ Failed to copy swisseph.wasm:', error.message);
  process.exit(1);
}
