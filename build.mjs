import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables from multiple sources
console.log('Loading environment variables...');

const requiredVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
  'VITE_SUPABASE_PUBLISHABLE_KEY',
  'VITE_ANTHROPIC_API_KEY'
];

// Try to load from .env.production first (local development)
const envFile = path.join(__dirname, '.env.production');
if (fs.existsSync(envFile)) {
  console.log('Reading from .env.production...');
  const envContent = fs.readFileSync(envFile, 'utf8');
  const lines = envContent.split('\n');

  lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const equalsIndex = trimmed.indexOf('=');
      if (equalsIndex !== -1) {
        const key = trimmed.substring(0, equalsIndex);
        const value = trimmed.substring(equalsIndex + 1);
        if (key) {
          // ALWAYS overwrite with .env.production values, even if env var exists
          process.env[key] = value;
          console.log(`  Loaded ${key} from .env.production`);
        }
      }
    }
  });
}

// Create .env file from process.env for Vite to read during build
// Vite reads .env files at compile time to replace VITE_* variables
const envContent = requiredVars
  .map(v => `${v}=${process.env[v] || ''}`)
  .join('\n');

const envPath = path.join(__dirname, '.env');
fs.writeFileSync(envPath, envContent);
console.log('Created .env file for Vite build with current environment variables');

// Check for required environment variables
const missingVars = requiredVars.filter(v => !process.env[v]);
if (missingVars.length > 0) {
  console.warn(`⚠️  Missing environment variables: ${missingVars.join(', ')}`);
  console.warn('These should be configured in Vercel project settings.');
} else {
  console.log('✅ All required environment variables are set');
}

console.log('');

// Run Vite build
try {
  console.log('Starting Vite build...');
  execSync('npx vite build', { stdio: 'inherit' });
  console.log('Build completed successfully!');
  process.exit(0);
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}
